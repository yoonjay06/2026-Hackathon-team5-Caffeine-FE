import axios from "axios";

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// TODO: 인증 토큰 붙이는 로직 필요해지면 request 인터셉터에 추가
// TODO: 공통 에러 처리(401 리다이렉트 등) 필요해지면 response 인터셉터에 추가

export default client;  