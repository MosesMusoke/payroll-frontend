
'use client';

import Link from 'next/link';
import { useState } from 'react';

export interface EmployeeFormData {
  organization: {
    organizationName: string;
    registrationNumber: string;
  };
  payPeriod: {
    year: number;
    month: number;
  };
  employee: {
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
  };
}

interface EmployeeFormProps {
    onSubmit: (data: any) => Promise<void>;
    loading: boolean;
}
  

export default function EmployeeForm({ onSubmit, loading }: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    organization: { organizationName: '', registrationNumber: '' },
    payPeriod: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
    employee: {
      staffNIN: '',
      staffNssfNumber: '',
      contributionType: 'Standard',
      incomeType: 'Salary',
      staffName: '',
      staffBasicPay: 0,
      staffMedicalPay: 0,
      staffHousingPay: 0,
      staffBonus: 0,
      PAYE: 0,
      savings: 0
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof EmployeeFormData],
        [field]: field === 'year' || field === 'month' || field.endsWith('Pay') || 
                 field.endsWith('Bonus') || field === 'PAYE' || field === 'savings' 
                 ? Number(value) 
                 : value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md font-[Montserrat]">
      <h2 className="text-2xl font-semibold mb-4 text-blue-900">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Organization Section */}
        <div className="space-y-2">
          <h3 className="font-medium text-blue-800">Organization Details</h3>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Organization Name</label>
            <input
              type="text"
              name="organization.organizationName"
              value={formData.organization.organizationName}
              onChange={handleInputChange}
              placeholder="Organization Name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Registration Number</label>
            <input
              type="text"
              name="organization.registrationNumber"
              value={formData.organization.registrationNumber}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
        </div>

        {/* Pay Period Section */}
        <div className="space-y-2">
          <h3 className="font-medium text-blue-800">Pay Period</h3>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Year</label>
            <input
              type="number"
              name="payPeriod.year"
              value={formData.payPeriod.year}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Month</label>
            <select
              name="payPeriod.month"
              value={formData.payPeriod.month}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Details */}
        <div className="space-y-2 md:col-span-2">
          <h3 className="font-medium text-blue-800">Employee Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "National ID Number", name: "employee.staffNIN", type: "text" },
              { label: "NSSF Number", name: "employee.staffNssfNumber", type: "text" },
              { label: "Full Name", name: "employee.staffName", type: "text" },
              { label: "Basic Pay", name: "employee.staffBasicPay", type: "number" },
              { label: "Medical Allowance", name: "employee.staffMedicalPay", type: "number" },
              { label: "Housing Allowance", name: "employee.staffHousingPay", type: "number" },
              { label: "Bonus", name: "employee.staffBonus", type: "number" },
              { label: "PAYE Tax", name: "employee.PAYE", type: "number" },
              { label: "Savings", name: "employee.savings", type: "number" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={
                    name.split('.')[1] && formData.employee[name.split('.')[1] as keyof typeof formData.employee]
                  }
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required={["employee.staffNIN", "employee.staffNssfNumber", "employee.staffName", "employee.staffBasicPay", "employee.PAYE"].includes(name)}
                />
              </div>
            ))}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Contribution Type</label>
              <select
                name="employee.contributionType"
                value={formData.employee.contributionType}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="Standard">Standard Contribution</option>
                <option value="Voluntary">Voluntary Contribution</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Income Type</label>
              <input
                type="text"
                name="employee.incomeType"
                value={formData.employee.incomeType}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-4 justify-end mt-4">
          <Link href="/">
            <button
              type="button"
              className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Return to Home
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-400"
          >
            {loading ? 'Submitting...' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}