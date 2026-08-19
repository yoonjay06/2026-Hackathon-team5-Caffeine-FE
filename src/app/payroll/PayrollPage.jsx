import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import PayrollHeader from "./components/PayrollHeader";
import PayrollSummaryCards from "./components/PayrollSummaryCards";
import EmployeeTable from "./components/EmployeeTable";
import AddEmployeeModal from "./components/AddEmployeeModal";
import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";
import { useBusiness } from "../../contexts/BusinessContext";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getPayrollSummary,
  getPayments,
  createPayment,
  updatePayment,
  exportPayslips,
  getPayslip,
} from "../../api/payroll";

const YEAR = 2026;
const MONTH = 8; // TODO: 실제로는 현재 월 기준 동적 계산 필요

// 한글 파일명이 섞이면 서버가 Content-Disposition 자체를 RFC 2047(=?utf-8?b?...?=)로 인코딩해서 내려줌
function decodeRfc2047(value) {
  const match = value.match(/^=\?utf-8\?b\?([^?]+)\?=$/i);
  if (!match) return value;
  return decodeURIComponent(
    atob(match[1])
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

// Content-Disposition 헤더에서 파일명을 뽑아 blob 다운로드를 트리거
function downloadBlob(res, fallbackFilename) {
  const disposition = decodeRfc2047(res.headers["content-disposition"] ?? "");
  const filename = disposition.match(/filename="?([^"]+)"?/)?.[1] ?? fallbackFilename;

  const url = URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// employees(직원 기본정보)와 payments(월별 급여 계산 결과)를 employee_id 기준으로 합침
// monthly_contracted_hours는 서버가 "80.0" 같은 소수점 문자열로 내려줘서 number input에 그대로 넣으면 편집이 불편해짐 - 숫자로 정규화
function mergeEmployeesWithPayments(employees, payments) {
  const paymentByEmployeeId = new Map(payments.map((p) => [p.employee_id, p]));
  return employees.map((emp) => {
    const payment = paymentByEmployeeId.get(emp.employee_id);
    return {
      ...emp,
      monthly_contracted_hours: emp.monthly_contracted_hours === null ? "" : Number(emp.monthly_contracted_hours),
      paymentId: payment?.payment_id ?? null,
      grossPay: payment?.gross_pay ?? 0,
      withholdingTax: payment?.withholding_tax ?? 0,
    };
  });
}

function PayrollPage() {
  const { business } = useBusiness();
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState({ total_labor_cost: 0, withholding_tax: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    const [employeesRes, paymentsRes, summaryRes] = await Promise.all([
      getEmployees(business.businessId),
      getPayments(business.businessId, YEAR, MONTH),
      getPayrollSummary(business.businessId, YEAR, MONTH),
    ]);
    setEmployees(mergeEmployeesWithPayments(employeesRes.data.data, paymentsRes.data.data));
    setSummary(summaryRes.data.data);
  }, [business.businessId]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await loadData();
      } catch {
        setError("급여 정보를 불러오지 못했어요. 사업장 정보를 확인해주세요.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [loadData]);

  // 시급·근무시간이 바뀌면 급여도 다시 계산되어야 하므로 payments를 함께 갱신
  const syncPayment = async (employee) => {
    const workHours = employee.monthly_contracted_hours;
    if (!workHours) return;

    if (employee.paymentId) {
      await updatePayment(business.businessId, employee.paymentId, { work_hours: workHours });
    } else {
      await createPayment(business.businessId, {
        employee_id: employee.employee_id,
        year: YEAR,
        month: MONTH,
        work_hours: workHours,
      });
    }
    await loadData();
  };

  const handleUpdateEmployee = async (employeeId, field, value) => {
    const target = employees.find((emp) => emp.employee_id === employeeId);
    if (!target) return;
    const updated = { ...target, [field]: value };

    setEmployees((prev) =>
      prev.map((emp) => (emp.employee_id === employeeId ? updated : emp))
    );

    await updateEmployee(business.businessId, employeeId, { [field]: value });

    if (field === "hourly_wage" || field === "monthly_contracted_hours") {
      await syncPayment(updated);
    }
  };

  const handleAddEmployee = async (newEmployeeData) => {
    const res = await createEmployee(business.businessId, newEmployeeData);
    const { employee_id } = res.data.data;

    if (newEmployeeData.monthly_contracted_hours) {
      await createPayment(business.businessId, {
        employee_id,
        year: YEAR,
        month: MONTH,
        work_hours: newEmployeeData.monthly_contracted_hours,
      });
    }

    setIsModalOpen(false);
    await loadData();
  };

  const handleExport = async () => {
    const res = await exportPayslips(business.businessId, YEAR, MONTH, "xlsx");
    downloadBlob(res, `payslip_${YEAR}_${MONTH}.xlsx`);
  };

  const handleViewPayslip = async (paymentId) => {
    const res = await getPayslip(business.businessId, paymentId);
    downloadBlob(res, `payslip_${paymentId}.pdf`);
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteEmployee(business.businessId, employeeId);
      await loadData();
    } catch (err) {
      // 급여 기록이 있는 직원은 서버에서 409(EMPLOYEE_HAS_PAYROLL_DATA)로 삭제를 막음
      if (err.response?.status === 409) {
        window.alert("이번 달 급여 기록이 있는 직원은 삭제할 수 없습니다.");
        return;
      }
      throw err;
    }
  };

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loadData();
    } catch {
      setError("급여 정보를 불러오지 못했어요. 사업장 정보를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={handleRetry} />;

  return (
    <Wrapper>
      <PayrollHeader onAddClick={() => setIsModalOpen(true)} />
      <PayrollSummaryCards
        totalExpense={summary.total_labor_cost}
        totalWithholdingTax={summary.withholding_tax}
        onExport={handleExport}
      />
      <EmployeeTable
        employees={employees}
        onUpdateEmployee={handleUpdateEmployee}
        onViewPayslip={handleViewPayslip}
        onDeleteEmployee={handleDeleteEmployee}
      />
      <AddEmployeeModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddEmployee} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 16px 32px 24px;
`;

export default PayrollPage;