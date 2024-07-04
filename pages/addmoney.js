import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useRouter } from 'next/router';
import style from './home.module.css';
import LoadingBar from 'react-top-loading-bar'; 

const QRCodeGenerator = () => {
    const router = useRouter();
    const { me } = router.query;

    const [details, setDetails] = useState({
        Amount: '',
        Message: '',
        DateToCredit: '',
        TimeToCredit: ''
    });

    const [qrText, setQrText] = useState('');
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0); 
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (me) {
            setLoading(false);
            setProgress(100); 
        }
    }, [me]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails({ ...details, [name]: value });
    };

    const handleGenerateQRCode = () => {
        setLoading(true);
        const { Amount, Message } = details;
        const upiUrl = `upi://pay?pa=mekalaganeshreddy796@oksbi&pn=M.Ganesh%20Reddy&am=${Amount}&cu=INR&aid=uGICAgICnh8qGLA&tn=${encodeURIComponent(Message)}`;
        setQrText(upiUrl);
        setLoading(false);
    };

    const PaymentSuccessful = async () => {
        setLoading(true);
        setProgress(0); 
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
        const { Amount, Message, DateToCredit, TimeToCredit } = details;
        function getRandomThreeDigitInt() {
            return Math.floor(Math.random() * 900) + 100;
        }
        const randomno = getRandomThreeDigitInt();
        const txnid = "TXN" + randomno;
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
                Message,
                userid: me
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
                Message,
                userid: me
            })
        };
        try {
            const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${me}/Transactions.json`, options);
            const response = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${me}/RecentTransaction.json`, option);
            const uresponse = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/Alltransactions.json`, options);
            if (res.ok && response.ok && uresponse.ok) {
                setSuccessMessage('Payment Successful!');
            } else {
                throw new Error('Failed to store data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error occurred while storing data.');
        } finally {
            setLoading(false);
            setProgress(100); // Complete the progress bar
        }
    };

    const areAllFieldsFilled = () => {
        const { Amount, Message, DateToCredit, TimeToCredit } = details;
        return Amount && Message && DateToCredit && TimeToCredit;
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
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            {loading && <div className={style.youtubeloader}></div>}
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
                        required
                    />
                    <label className="block mb-2 font-semibold text-gray-700">UPI id:</label>
                    <input
                        name="Message"
                        type="text"
                        value={details.Message}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                        placeholder="Enter Your UPI id"
                        required
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
                            required
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
                            required
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
                        disabled={!areAllFieldsFilled()} 
                    >
                        Payment Successful
                    </button>
                </div>
                <div className="relative flex flex-col items-center justify-center w-full p-4 md:w-1/2">
                    <span className="px-4 py-2 mb-3 text-4xl font-bold text-gray-800 bg-white rounded-lg shadow-md">
                        Scan and Pay
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
            {successMessage && (
                <div className="p-4 mt-4 text-green-700 bg-green-100 border border-green-400 rounded">
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default QRCodeGenerator;
