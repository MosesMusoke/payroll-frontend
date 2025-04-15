'use client';

import { useRouter } from 'next/navigation';
import EmployeeForm from '@/components/EmployeeForm';

export default function AddEmployeePage() {
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    try {
        const payload = {
            organization: {
              organizationName: formData.organization.organizationName,
              registrationNumber: formData.organization.registrationNumber
            },
            payPeriod: formData.payPeriod,
            employees: [formData.employee]
          };
      
          console.log("payload")
          console.log(payload)
        const response = await fetch('https://payroll-backend-2.onrender.com/api/employees', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

      if (response.ok) {
        router.push('/');
      } else {
        alert('Error submitting form');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting form');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add New Employee</h1>
      <EmployeeForm onSubmit={handleSubmit} loading={false} />
    </div>
  );
}