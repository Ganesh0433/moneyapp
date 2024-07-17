import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function History() {
  const router = useRouter();
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const { me } = router.query;

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    return token ? true : false;
  };

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
    } 
  }, [me]);

  const fetchdat = async () => {
    setLoading(true);
    setProgress(0);
    try {
      const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${me}/Transactions.json`);
      if (res.ok) {
        const data = await res.json();
        setStore(Object.values(data).reverse());
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (me) {
      fetchdat();
    }
  }, [me]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(prevProgress => (prevProgress >= 100 ? 100 : prevProgress + 10));
      }, 100);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [loading]);

  const formatDate = (date, time) => {
    const dateTime = `${date} ${time}`;
    // You can format the date/time here as needed
    return dateTime;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <h2 className="fixed z-10 w-full p-6 text-3xl font-semibold text-gray-800 bg-white xb top-4 ">
        Transaction History
      </h2>
      <div className="p-6 mt-20 overflow-x-auto">
        {loading && (
          <div className="">
            <div className="h-0.5 bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {!loading && !error && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 z-10 bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Debit Date & Time</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Credit Date & Time</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {store.map((transaction, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{transaction.txnid}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(transaction.DateOfDebit, transaction.TimeOfDebit)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(transaction.DateToCredit, transaction.TimeToCredit)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-right text-black whitespace-nowrap">
                    ₹{transaction.Amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {error && (
          <div className="p-4 mt-4 text-red-700 bg-red-100 border border-red-400">
            <p>Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
