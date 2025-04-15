// In types/employee.ts
export type Employee = {
  id: number;
  staffNIN: string;
  staffNssfNumber: string;
  contributionType: string;
  incomeType: string;
  staffName: string;
  staffBasicPay: number;
  staffMedicalPay: number;
  staffHousingPay: number;
  staffBonus: number;
  PAYE: number;
  savings: number;
  organization: {
    organizationName: string;
    registrationNumber: string;
  };
  payPeriod: {
    year: number;
    month: number;
  };
};