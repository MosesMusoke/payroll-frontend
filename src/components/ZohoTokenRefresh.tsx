'use client';
import { useState } from 'react';
import axios from 'axios';

export default function ZohoTokenRefresh() {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<null | string | { success: boolean, message: string, expires_at?: string }>(null);

  const handleRefreshToken = async () => {
    setLoading(true);
    setResponseData(null);

    try {
      const response = await axios.get('https://payroll-backend-2.onrender.com/zoho/refresh');
      setResponseData(response.data);
    } catch (error) {
      console.error('Refresh failed:', error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data || 'Refresh failed'
        : 'Unknown error';
      setResponseData(typeof errorMessage === 'string' ? errorMessage : { message: 'Refresh failed', success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <button
        onClick={handleRefreshToken}
        disabled={loading}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
      >
        {loading ? 'Refreshing...' : 'Refresh Zoho Token'}
      </button>

      {responseData && (
        <div className="mt-2 p-2 text-sm">
          {typeof responseData === 'string' ? (
            <span className="text-red-600">{responseData}</span>
          ) : responseData.success ? (
            <div>
              <p className="text-green-600">{responseData.message}</p>
              {responseData.expires_at && (
                <p className="text-gray-600 text-xs">Expires At: {new Date(responseData.expires_at).toLocaleString()}</p>
              )}
            </div>
          ) : (
            <span className="text-red-600">{responseData.message}</span>
          )}
        </div>
      )}
    </div>
  );
}
