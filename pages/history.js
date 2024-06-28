import React from 'react';

function History() {
    const transactions = [
        { id: 'TRX001', amount: '₹50.00', fromdate: '2024-06-28',Todate: '2027-06-28', fromtime: '10:30 AM',totime: '10:30 AM' },
        { id: 'TRX002', amount: '₹200.00', fromdate: '2024-06-27',Todate: '2027-04-28', fromtime: '02:15 PM',totime: '11:30 AM' },
        { id: 'TRX003', amount: '₹120.00', fromdate: '2024-06-26',Todate: '2029-06-28', fromtime: '11:45 AM',totime: '5:30 PM'},
        { id: 'TRX004', amount: '₹1,000.00', fromdate: '2024-06-25',Todate: '2027-02-28', fromtime: '09:00 AM',totime: '9:30 AM'},
    ];

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
                        {transactions.map((transaction, index) => (
                            <tr key={index} className="bg-white">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{transaction.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    <div>
                                   {transaction.fromdate} {transaction.fromtime}
                                     &nbsp;  &nbsp;
                                   To  &nbsp; {transaction.fromdate} {transaction.totime}
                                    
                                    </div></td>
                                <td className='px-6 py-4 text-sm whitespace-nowrap' >{transaction.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default History;
