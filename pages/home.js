import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import style from './home.module.css';
import { stringify } from 'postcss';

function Home() {
  const router = useRouter();
  const { me } = router.query;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [store, setStore] = useState([]);
  const [currentbalance, setcurrentbalance] = useState([]);
  const [status, setStatus] = useState({});
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
      const respstatus = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${me}/TransactionStatus.json`);
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
      if (respstatus.ok) {
        const statusdata = await respstatus.json();
        setStatus(statusdata)
        console.log("status data ", statusdata)
        console.log("status data of key", Object.keys(status))
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
  if (!balance) {
    balance = 0
  }


  var lastfetched = currentbalance.formattedDate;
  const login = () => {
    router.push('/login');
  };
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
              <div className='flex p-2 mt-0 ml-3 transition-transform duration-300 ease-in-out bg-white rounded-lg shadow-md hover:scale-95'>
                <div className='flex items-center w-6 h-6 p-1 mt-0 mr-2 bg-white border border-black rounded-full'>
                  <img src='profile.png' alt='Profile' />
                </div>
                {store[0] ? (
                  <div className='font-medium text-black '>
                    {store[0].Username}
                  </div>
                ) : (
                  <div className='font-medium text-black'>
                    { }
                  </div>
                )}
              </div>
            </button>
            <div className='flex space-x-2 md:space-x-4'>
              <button onClick={history} className='px-2 py-1 text-white transition duration-500 ease-in-out transform bg-black rounded hover:scale-105 focus:outline-none'>History</button>
              <button onClick={aboutus} className='px-2 py-1 text-white transition duration-500 ease-in-out transform bg-black rounded hover:scale-105 focus:outline-none'>About Us</button>
              <button onClick={faqs} className='px-2 py-1 text-white transition duration-500 ease-in-out transform bg-black rounded hover:scale-105 focus:outline-none'>FAQ</button>
              <button onClick={help} className='px-2 py-1 text-white transition duration-500 ease-in-out transform bg-black rounded hover:scale-105 focus:outline-none'>Help</button>
            </div>
          </div>

          <div className={`fixed top-0 left-0 w-96 h-full bg-white shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
  <button className='p-4' onClick={toggleSidebar}>
    <img className='w-12 h-12 transition-transform duration-300 ease-in-out hover:scale-95' src='backbutton.png'></img>
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
      <p>Facing Problem ...</p>
    )}
  </div>

  <button
    className="absolute w-32 px-4 py-2 text-white transition duration-300 ease-in-out bg-black border-2 border-black rounded-md bottom-3 left-3 hover:bg-white hover:text-black"
    onClick={() => {
      localStorage.removeItem('token'); 
      router.push('/login'); 
    }}
  >
    Log Out
  </button>
</div>

          <div className={`p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-96' : 'ml-0'}`}>
            <div className='container p-4 mx-auto'>
              <div className='p-6 mb-6 bg-white rounded-lg shadow-md'>
                <div className='flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                  <div>
                    <h2 className='pb-2 mb-4 text-3xl font-semibold text-gray-800 border-b-4 '>Current Balance</h2>
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
                  <div className='overflow-y-scroll max-h-60'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-100'>
                        <tr>
                          <th className='px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Transaction ID</th>
                          <th className='px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Date & Time</th>
                          <th className='px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Amount</th>
                          <th className='px-4 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase'>Status</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200'>
                        {store.length > 1 && status ? (
                          Object.values(store[1]).reverse().map((transaction, index) => (
                            Object.keys(status).filter(key => key === transaction.txnid).map(key => {
                              const nestedObject = status[key];
                              const lastKey = Object.keys(nestedObject).pop();
                              const lastItem = nestedObject[lastKey];
                              return (
                                <tr key={index} className='bg-white'>
                                  <td className='px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap'>{transaction.txnid}</td>
                                  {transaction.DateOfDebit && transaction.TimeOfDebit ? (
                                    <td className='px-4 py-2 text-sm text-gray-500 whitespace-nowrap'>{transaction.DateOfDebit} {transaction.TimeOfDebit}</td>
                                  ) : (
                                    <td className='px-4 py-2 text-sm text-gray-500 whitespace-nowrap'>{transaction.DateToCredit} {transaction.TimeToCredit}</td>
                                  )}
                                  {transaction.DateOfDebit && transaction.TimeOfDebit ? (
                                    <td className='px-4 py-2 text-sm font-medium text-red-500 whitespace-nowrap'>-₹{transaction.Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                  ) : (
                                    <td className='px-4 py-2 text-sm font-medium text-green-500 whitespace-nowrap'>+₹{transaction.Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                  )}
                                  {transaction.DateOfDebit && transaction.TimeOfDebit ? (
                                    lastItem.Status === 'Pending' ? (
                                      <td className='px-4 py-2 text-sm font-medium text-right text-orange-300 whitespace-nowrap'>
                                        {lastItem.Status}
                                      </td>
                                    ) : lastItem.Status === 'Success' ? (
                                      <td className='px-4 py-2 text-sm font-medium text-right text-green-500 whitespace-nowrap'>
                                        {lastItem.Status}
                                      </td>
                                    ) : (
                                      <td className='px-4 py-2 text-sm font-medium text-right text-red-500 whitespace-nowrap'>
                                        {lastItem.Status}
                                      </td>
                                    )
                                  ) : (

                                    <td className='px-4 py-2 text-sm font-medium text-right text-green-500 whitespace-nowrap'>
                                      Success
                                    </td>


                                  )}


                                </tr>
                              );
                            })
                          ))

                        ) : (
                          <tr>
                            <td colSpan="3" className="px-4 py-2 text-sm text-center text-gray-500">No transactions found</td>
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
