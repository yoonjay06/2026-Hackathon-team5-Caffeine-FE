// 실제 PG(토스페이먼츠/포트원 등) SDK가 프론트에서 하는 일을 흉내내는 가상 PG 모듈.
//
// - 카드 원본 정보(카드번호/유효기간/CVC)는 여기서만 다루고, 우리 서버(Django)로는
//   절대 보내지 않는다. 서버에는 이 모듈이 만든 payment_token만 전달된다 — 실제
//   PG 연동 구조와 동일한 전제를 그대로 유지한다.
// - PG사 선정 후에는 이 파일을 해당 PG의 SDK 호출로 통째로 교체하면 된다.
//   (호출부인 SettingsPage/CardInputModal은 requestBillingAuth의 인터페이스만 알면 됨)
//
// 데모용 테스트 시나리오 카드 (실제 PG들이 흔히 제공하는 테스트카드 방식과 동일):
//   - 마지막 4자리 0002 → 카드 등록(승인) 자체가 거절됨
//   - 마지막 4자리 0341 → 등록은 되지만, 이후 정기 결제 시 결제가 실패함

const CARD_BIN_MAP = [
  { prefix: "4", company: "비자카드(가상)" },
  { prefix: "5", company: "마스터카드(가상)" },
  { prefix: "3", company: "신한카드(가상)" },
  { prefix: "9", company: "국민카드(가상)" },
];

export const TEST_SCENARIO_LAST4 = {
  REGISTRATION_FAIL: "0002",
  CHARGE_FAIL: "0341",
};

export class PaymentGatewayError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "PaymentGatewayError";
    this.code = code;
  }
}

function detectCardCompany(cardNumberDigits) {
  const matched = CARD_BIN_MAP.find((entry) => cardNumberDigits.startsWith(entry.prefix));
  return matched ? matched.company : "가상카드사";
}

function assertValidCardInput({ cardNumber, expiry, cvc }) {
  const digitsOnly = (cardNumber || "").replace(/\D/g, "");
  if (digitsOnly.length !== 16) {
    throw new PaymentGatewayError("카드번호 16자리를 입력해주세요.", "INVALID_CARD_NUMBER");
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry || "")) {
    throw new PaymentGatewayError("유효기간을 MM/YY 형식으로 입력해주세요.", "INVALID_EXPIRY");
  }
  const [mm, yy] = expiry.split("/").map(Number);
  if (mm < 1 || mm > 12) {
    throw new PaymentGatewayError("유효기간의 월이 올바르지 않습니다.", "INVALID_EXPIRY");
  }
  const expiryEnd = new Date(2000 + yy, mm, 1); // 해당 월 말일 다음날 0시 = 그 전까지 유효
  if (expiryEnd <= new Date()) {
    throw new PaymentGatewayError("이미 만료된 카드입니다.", "EXPIRED_CARD");
  }

  if (!/^\d{3}$/.test(cvc || "")) {
    throw new PaymentGatewayError("CVC 3자리를 입력해주세요.", "INVALID_CVC");
  }

  return digitsOnly;
}

// base64url 인코딩 (백엔드의 base64.urlsafe_b64decode와 짝을 맞춤)
function encodeToken(payload) {
  const standardBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  return standardBase64.replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * 실제 PG SDK의 카드 등록/빌링키 발급 호출(예: 토스페이먼츠 requestBillingAuth)을 흉내낸다.
 * 네트워크 지연과 카드사 승인 심사를 시뮬레이션하고, payment_token을 반환한다.
 *
 * @returns {Promise<{ paymentToken: string, cardCompany: string, cardLast4: string }>}
 */
export function requestBillingAuth({ cardNumber, expiry, cvc }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let digitsOnly;
      try {
        digitsOnly = assertValidCardInput({ cardNumber, expiry, cvc });
      } catch (err) {
        reject(err);
        return;
      }

      const last4 = digitsOnly.slice(-4);
      const cardCompany = detectCardCompany(digitsOnly);

      if (last4 === TEST_SCENARIO_LAST4.REGISTRATION_FAIL) {
        reject(
          new PaymentGatewayError(
            "카드사 승인이 거절되었습니다. 카드 정보를 다시 확인하거나 다른 카드로 시도해주세요.",
            "CARD_DECLINED"
          )
        );
        return;
      }

      const scenario = last4 === TEST_SCENARIO_LAST4.CHARGE_FAIL ? "CHARGE_FAIL" : null;
      const paymentToken = encodeToken({ card_company: cardCompany, card_last4: last4, scenario });

      resolve({ paymentToken, cardCompany, cardLast4: last4 });
    }, 900); // 실제 PG 호출처럼 약간의 지연을 둬서 "카드 등록 중..." 로딩 UX를 보여준다.
  });
}
