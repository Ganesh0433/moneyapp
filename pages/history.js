import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function History() {
    const router = useRouter();
    const [store, setStore] = useState([]);

    const { me } = router.query;



    const fetchdat = async () => {
        try {
            const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${me}/Transactions.json`);
            if (res.ok) {
                const data = await res.json();
                console.log("Fetched data:", data);
                setStore(Object.values(data)); // Assuming data is an object with values to store in state
            } else {
                console.error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        if (me) {
            fetchdat();
        }
    }, [me]);

    console.log("store is ", store);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="mb-6">
                <h2 className="pb-2 mb-4 text-3xl font-semibold text-gray-800 border-b-4 border-blue-500">
                    History
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Transaction ID</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date & Time</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {store.length>0 ? (store.map((transaction,index) => (
                            <tr key={index} className="bg-white">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{transaction.txnid}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    <div>
                                        {transaction.DateOfDebit} {transaction.TimeOfDebit}  &nbsp; To &nbsp; {transaction.DateToCredit} {transaction.TimeToCredit}
                                    </div>
                                </td>
                                <td className='px-6 py-4 text-sm font-medium text-blue-500 whitespace-nowrap'>{transaction.Amount}</td>
                            </tr>
                        ))):( <tr>
                            <td colSpan="3" className="px-6 py-4 text-sm text-center text-gray-500">No transactions found</td>
                          </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default History;
