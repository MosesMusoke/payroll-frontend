import React from 'react';

const ZohoConnectButton: React.FC = () => {
  const handleConnect = () => {
    // This will redirect to your backend, which then redirects to Zoho
    window.location.href = 'https://payroll-backend-2.onrender.com/zoho/auth';
  };

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Connect to Zoho Books
    </button>
  );
};

export default ZohoConnectButton;
