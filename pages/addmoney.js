import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { useRouter } from 'next/router';

const QRCodeGenerator = () => {
    const router = useRouter();
    const { me } = router.query;

    const [details, setDetails] = useState({
        Amount: '+',
        Message: '',
        DateToCredit: '',  
        TimeToCredit: ''   
    });

    const [qrText, setQrText] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails({ ...details, [name]: value });
    };

    const handleGenerateQRCode = () => {
        const { Amount, Message} = details;
        const upiUrl = `upi://pay?pa=mekalaganeshreddy796@oksbi&pn=M.Ganesh%20Reddy&am=${Amount}&cu=INR&aid=uGICAgICnh8qGLA&tn=${encodeURIComponent(Message)}`;
        setQrText(upiUrl);
    };

    const PaymentSuccessful = async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedHours = String(hours).padStart(2, '0');
        const DateOfDebit = `${day}-${month}-${year}`;
        const TimeOfDebit = `${formattedHours}:${minutes} ${ampm}`;
        const { Amount, Message,DateToCredit,TimeToCredit  } = details;
        function getRandomThreeDigitInt() {
            return Math.floor(Math.random() * 900) + 100;
        }
        const randomno = getRandomThreeDigitInt();
        const txnid = "TXN"+randomno
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                txnid,
                DateToCredit,
                TimeToCredit,
                DateOfDebit,
                TimeOfDebit,
                Amount,
                Message
            })
        };
        const option = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                txnid,
                DateOfDebit,
                TimeOfDebit,
                Amount,
                Message
            })
        };
        try {
            const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${me}/Transactions.json`, options);
            const response = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${me}/RecentTransaction.json`, option);
            if (res.ok) {
                alert('Data stored successfully!');
            } else {
                throw new Error('Failed to store data.');
            }
            if (response.ok) {
                alert('Data stored successfully!');
            } else {
                throw new Error('Failed to store data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error occurred while storing data.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="mb-4 text-center">
                <p className="text-lg font-semibold">Please scan the QR code to make a payment.</p>
                <p className="text-gray-700 text-md">Ensure the payment amount and message are correct.</p>
                <p className="mt-2 font-semibold text-red-500 text-md">Make sure you are paying to a trusted recipient.</p>
            </div>
            <div className="flex flex-col items-start justify-center w-full max-w-4xl md:flex-row">
                <div className="w-full p-4 md:w-1/2">
                    <label className="block mb-2 font-semibold text-gray-700">Amount (INR):</label>
                    <input
                        name="Amount"
                        type="number"
                        value={details.Amount}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        placeholder="Enter amount"
                    />
                    <label className="block mb-2 font-semibold text-gray-700">Message:</label>
                    <input
                        name="Message"
                        type="text"
                        value={details.Message}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        placeholder="Enter a message (Phone no)"
                    />
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold text-gray-700" htmlFor="date">
                            Date to Credit:
                        </label>
                        <input
                            name="DateToCredit"  
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            id="date"
                            type="text"
                            placeholder="Enter date (e.g., DD-MM-YYYY)"
                            value={details.DateToCredit}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700" htmlFor="time">
                            Time to Credit:
                        </label>
                        <input
                            name="TimeToCredit" 
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            id="time"
                            type="text"
                            placeholder="Enter time (e.g., HH:MM AM/PM)"
                            value={details.TimeToCredit}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        onClick={handleGenerateQRCode}
                        className="w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Generate QR Code
                    </button>
                    <p className="mt-4 mb-2 text-center text-gray-700 text-md">
                        After completing the payment, please press the{' '}
                        <span className="font-semibold text-blue-600"> "Payment Successful" </span>
                    </p>
                    <button
                        onClick={PaymentSuccessful}
                        className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none"
                    >
                        Payment Successful
                    </button>
                </div>
                <div className="relative flex flex-col items-center justify-center w-full p-4 md:w-1/2">
                    <span className="px-4 py-2 mb-3 text-4xl font-bold text-gray-800 bg-white rounded-lg shadow-md">
                        Pay with Google Pay
                    </span>
                    {qrText ? (
                        <QRCode
                            value={qrText}
                            size={256}
                            level={"H"}
                            includeMargin={true}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-64 h-64 text-gray-500 border border-gray-300">
                            QR code will appear here
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
