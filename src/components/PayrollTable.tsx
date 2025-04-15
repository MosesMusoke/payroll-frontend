import { Employee } from '@/types/employee';

export default function PayrollTable({ employees, loading }: { 
  employees: Employee[], 
  loading: boolean 
}) {
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Employee Payroll Data</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">NIN</th>
              <th className="border p-2">NSSF Number</th>
              <th className="border p-2">Basic Pay</th>
              <th className="border p-2">Organization</th>
              <th className="border p-2">Pay Period</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="border p-2">{employee.staffName}</td>
                <td className="border p-2">{employee.staffNIN}</td>
                <td className="border p-2">{employee.staffNssfNumber}</td>
                <td className="border p-2">{employee.staffBasicPay}</td>
                <td className="border p-2">{employee.organization.organizationName}</td>
                <td className="border p-2">
                  {employee.payPeriod.month}/{employee.payPeriod.year}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}