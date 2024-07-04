import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import style from './home.module.css';

function Home() {
  const router = useRouter();
  const { me } = router.query;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [store, setStore] = useState([]);
  const [currentbalance, setcurrentbalance] = useState([]);
  const [loading, setLoading] = useState(true);

  const addMoney = () => {
    router.push(`/addmoney?me=${me}`);
  };

  const history = () => {
    router.push(`/history?me=${me}`);
  };

  const aboutus = () => {
    router.push(`/aboutus`);
  };

  const faqs = () => {
    router.push(`/faqs`);
  };

  const help = () => {
    router.push(`/help`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchdata = async () => {
    try {
      const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${me}.json`);
      const resp = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/currentbalance/${me}.json`);
      if (res.ok) {
        const data = await res.json();
        setStore(Object.values(data));
        console.log("userinfo: ", data);
      } else {
        console.error("Failed to fetch data");
      }
      if (resp.ok) {
        const resdata = await resp.json();
        setcurrentbalance(Object.values(resdata).pop());
        console.log("current balance ", currentbalance.CurrentBalance);
      } else {
        console.error("Failed to fetch data");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    return token ? true : false;
  };

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
    } else if (me) {
      fetchdata();
    }
  }, [me]);

  var balance = currentbalance.CurrentBalance;
  var lastfetched = currentbalance.formattedDate;

  return (
    <div className='min-h-screen bg-white'>
      {loading ? (
        <div className='flex items-center justify-center h-full'>
          <div className={style.loader}></div>
        </div>
      ) : (
        <>
          <div className='flex justify-between p-4 bg-transparent'>
            <button className='cursor-pointer' onClick={toggleSidebar}>
              <div className='flex p-2 mt-0 ml-3 bg-white rounded-lg shadow-md'>
                <div className='flex items-center w-6 h-6 p-1 mt-0 mr-2 bg-white border border-black rounded-full'>
                  <img src='profile.png' alt='Profile' />
                </div>
                {store[0] ? (
                  <div className='font-medium text-black'>
                    {store[0].Username}
                  </div>
                ) : (
                  <div className='font-medium text-black'>
                    { }
                  </div>
                )}
              </div>
            </button>
            <div className='flex space-x-10'>
              <button onClick={history} className='px-4 text-white transition duration-500 ease-in-out transform bg-black rounded hover:scale-105 focus:outline-none'>History</button>
              <button onClick={aboutus} className='px-4 text-white transition duration-500 ease-in-out transform bg-black rounded hover:scale-105 focus:outline-none'>About Us</button>
              <button onClick={faqs} className='px-4 text-white transition duration-500 ease-in-out transform bg-black rounded hover:scale-105 focus:outline-none'>FAQ</button>
              <button onClick={help} className='px-4 text-white transition duration-500 ease-in-out transform bg-black rounded hover:scale-105 focus:outline-none'>Help</button>
            </div>
          </div>

          <div className={`fixed top-0 left-0 w-76 h-full bg-white shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <button className='p-4' onClick={toggleSidebar}>
              Close
            </button>
            <div className='p-4'>
              <h2 className='mb-4 text-xl font-semibold text-gray-800'>Profile</h2>
              {store[0] ? (
                <>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-gray-600'>Name:</p>
                    <p className='text-lg text-gray-900'>{store[0].Name}</p>
                  </div>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-gray-600'>Phone Number:</p>
                    <p className='text-lg text-gray-900'>{store[0].Phoneno}</p>
                  </div>
                  <div className='mb-4'>
                    <p className='text-sm font-medium text-gray-600'>Email:</p>
                    <p className='text-lg text-gray-900'>{store[0].Email}</p>
                  </div>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>

          <div className={`p-10 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
            <div className='container p-4 mx-auto'>
              <div className='p-6 mb-6 bg-white rounded-lg shadow-md'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-xl font-bold'>Current Balance</h2>
                    <p className='text-3xl font-semibold text-green-500'>₹{balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                  </div>
                  <div className='relative'>
                    <button onClick={addMoney} className='px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300'>
                      Add Money
                    </button>
                  </div>
                </div>
                <p className='px-1 py-0.5 mt-2 text-xs text-gray-500 max-w-fit bg-slate-100' style={{ wordSpacing: '-0.09em' }}>{lastfetched}</p>
              </div>
              <div className='p-6 bg-white rounded-lg shadow-md'>
                <div className='mb-6'>
                  <h2 className='pb-2 mb-4 text-3xl font-semibold text-gray-800 border-b-4'>
                    Recent Transactions
                  </h2>
                </div>
                <div className='overflow-x-auto'>
                  <div className='overflow-y-scroll max-h-96'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-100'>
                        <tr>
                          <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Transaction ID</th>
                          <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Date & Time</th>
                          <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Amount</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200'>
                        {store.length > 1 ? (
                          Object.values(store[1]).reverse().map((transaction, index) => (
                            <tr key={index} className='bg-white'>
                              <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>{transaction.txnid}</td>
                              {transaction.DateOfDebit && transaction.TimeOfDebit ? (
                                <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>{transaction.DateOfDebit} {transaction.TimeOfDebit}</td>
                              ) : (
                                <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>{transaction.DateToCredit} {transaction.TimeToCredit}</td>
                              )}
                              {transaction.DateOfDebit && transaction.TimeOfDebit ? (
                                <td className='px-6 py-4 text-sm font-medium text-red-500 whitespace-nowrap'>₹{transaction.Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                              ) : (
                                <td className='px-6 py-4 text-sm font-medium text-green-500 whitespace-nowrap'>₹{transaction.Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="px-6 py-4 text-sm text-center text-gray-500">No transactions found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
