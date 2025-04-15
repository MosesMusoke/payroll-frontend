'use client';
import { useEffect, useState } from 'react';
import FileUpload from '@/components/FileUpload';
import PayrollTable from '@/components/PayrollTable';
import { Employee } from '@/types/employee';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import ZohoConnectButton from '@/components/ZohoConnectButton';
import { error } from 'console';
import ZohoTokenRefresh from '@/components/ZohoTokenRefresh';
import ZohoExpenseCreator from '@/components/ZohoExpenseCreator';

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterNIN, setFilterNIN] = useState('');
  const [noEmployeError, setNoEmployeError] = useState('');

  const handleJsonSubmit = async (jsonData: any) => {
    console.log("jsonData")
    console.log(jsonData)
    setLoading(true);
    try {
      const response = await axios.post('https://payroll-backend-2.onrender.com/api/employees', jsonData);
      
      alert('Data submitted successfully!');
      fetchEmployees();
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const { organization, ...rest } = data;

        const transformedOrganization = {organization: {
          organizationName: organization["Organization Name"],
          registrationNumber: organization["Registration Number"]}
        };

        const transformedData = {
          ...rest,
          ...transformedOrganization,
        };

        console.log("Transformed Data:");
        console.log(transformedData);

        handleJsonSubmit(transformedData);
      } catch (parseError) {
        console.error('Invalid JSON file:', parseError);
        alert('Invalid JSON format');
      }
    };
    reader.readAsText(file);
  };

  const fetchEmployees = async () => {
    try {
      const params = new URLSearchParams();
      
      if (filterYear) params.append('year', filterYear);
      if (filterMonth) params.append('month', filterMonth);
      if (filterNIN) params.append('nin', filterNIN);
  
      const url = params.toString()
        ? `https://payroll-backend-2.onrender.com/api/employees/salary-details?${params.toString()}`
        : 'https://payroll-backend-2.onrender.com/api/employees';
  
      const response = await axios.get(url);
      setEmployees(response.data);
      
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.error || 'Error fetching employees');
      }
    }
  };

  const handleDownloadFile = async () => {
    try {
      const response = await axios.get('https://payroll-backend-2.onrender.com/export', {
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const showExcelTableData = async () => {
    try {
      const response = await axios.get('https://payroll-backend-2.onrender.com/export', {
        responseType: 'arraybuffer',
      });

      console.log("reached 1")
  
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log("reached 2")
  
      setExcelData(jsonData);
    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
  };

  const sendToZoho = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://payroll-backend-2.onrender.com/zoho/record-expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ employees })
      });

      const result = await response.json();
      setMessage(result.message || "Something went wrong");
    } catch (err) {
      setMessage("Error sending data to Zoho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Payroll Management</h1>
      
      <Link 
        href="/add-employee"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add New Employee
      </Link>

      <div className="mb-6 mt-4 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Filter by NIN"
          value={filterNIN}
          onChange={(e) => setFilterNIN(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Year (e.g. 2024)"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2000, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <button
          onClick={fetchEmployees}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filter
        </button>

        <button
          onClick={() => {
            setFilterYear('');
            setFilterMonth('');
            setFilterNIN('');
            fetchEmployees();
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Reset Filters
        </button>
      </div>
      
      {/* Show message when no employees found */}
      {employees.length === 0 && !loading ? (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          {filterYear || filterMonth || filterNIN ? (
            <p>No employees found matching the current filters.</p>
          ) : (
            <p>No employee records found in the system.</p>
          )}
        </div>
      ) : (
        <PayrollTable employees={employees} loading={loading} />
      )}

      <div className="mb-8  mt-8">
        <label className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
          Upload JSON Data
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </label>
        <p className="mt-2 text-sm text-gray-600">
          Upload a JSON file with payroll data
        </p>
      </div>

      <button
        onClick={showExcelTableData}
        className="bg-blue-500 text-white px-4 py-2 mr-3 rounded hover:bg-blue-600"
      >
        Display Excel Report
      </button>

      <button
        onClick={handleDownloadFile}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
      >
        Download Excel Report
      </button>

      {/* <button
        onClick={handleExportToSheets}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
      >
        Download to Google Sheets
      </button> */}

      {excelData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Excel Data Preview</h2>
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr>
                {Object.keys(excelData[0]).map((key) => (
                  <th key={key} className="border px-4 py-2">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex} className="border px-4 py-2">{String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Zoho Books Integration</h1>
        <ZohoConnectButton />
        <ZohoTokenRefresh />
        <ZohoExpenseCreator />
        <button onClick={sendToZoho} disabled={loading}>
          {loading ? "Sending..." : "Send Payroll to Zoho"}
        </button>
        <p>{message}</p>
      </div>

    </main>
  );
}