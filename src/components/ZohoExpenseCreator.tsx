// components/ZohoExpenseCreator.tsx
'use client';
import { useState } from 'react';
import axios from 'axios';

export default function ZohoExpenseCreator() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [expenseData, setExpenseData] = useState({
    description: 'Payroll Expenses',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });


  const formData = new URLSearchParams();
  const test = {
    account_id: 6189498000000093035,
    date: new Date().toISOString().split('T')[0],
    amount: 112000,
    description: "Payroll Expenses",
    is_inclusive_tax: false,
    payment_mode: "cash"
  }
  

  const handleCreateExpense = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Send request to YOUR backend endpoint
      const response = await axios.post(
        'https://payroll-backend-2.onrender.com/zoho/expenses',
        {
            "account_id": "6189498000000093035",
            "date": new Date().toISOString().split('T')[0],
            "amount": 250000,
            "description": "description",
        }
      );
      
      setMessage(response.data.message);
    } catch (error) {
      console.error('Expense creation failed:', error);
      setMessage(axios.isAxiosError(error) 
        ? error.response?.data.error || 'Creation failed'
        : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Create Zoho Expense</h3>
      
      <div className="grid gap-4 mb-4">
        <input
          type="text"
          placeholder="Description"
          value={expenseData.description}
          onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
          className="p-2 border rounded"
        />
        
        <input
          type="number"
          placeholder="Amount"
          value={expenseData.amount}
          onChange={(e) => setExpenseData({...expenseData, amount: Number(e.target.value)})}
          className="p-2 border rounded"
        />
        
        <input
          type="date"
          value={expenseData.date}
          onChange={(e) => setExpenseData({...expenseData, date: e.target.value})}
          className="p-2 border rounded"
        />
      </div>

      <button
        onClick={handleCreateExpense}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Expense'}
      </button>

      {message && (
        <div className={`mt-2 p-2 rounded ${
          message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}