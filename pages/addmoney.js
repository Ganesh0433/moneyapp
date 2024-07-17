import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useRouter } from 'next/router';
import style from './home.module.css';
import LoadingBar from 'react-top-loading-bar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';


const QRCodeGenerator = () => {
    const router = useRouter();
    const { me } = router.query;

    const [details, setDetails] = useState({
        Amount: '',
        Message: '',
        DateToCredit: null,
        TimeToCredit: ''
    });

    const [qrText, setQrText] = useState('');
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [shakeButton, setShakeButton] = useState(false);

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

    const handleDateChange = (date) => {
        setDetails({ ...details, DateToCredit: date });
    };

    const handleTimeChange = (time) => {
        setDetails({ ...details, TimeToCredit: time });
    };

    const handleGenerateQRCode = () => {
        const { Amount, Message } = details;
        const upiUrl = `upi://pay?pa=mekalaganeshreddy796@oksbi&pn=M.Ganesh%20Reddy&am=${Amount}&cu=INR&aid=uGICAgICnh8qGLA&tn=${encodeURIComponent(Message)}`;
        setQrText(upiUrl);
        setLoading(false);
    };

    const PaymentSuccessful = async () => {
        if (!details.DateToCredit || !details.TimeToCredit) {
            setErrorMessage('Please select a valid date and time.');
            return;
        }

        const now = new Date();
        const selectedDate = new Date(details.DateToCredit);
        const [hours, minutes] = details.TimeToCredit.split(':');
        selectedDate.setHours(hours % 12 + (details.TimeToCredit.includes('PM') ? 12 : 0), minutes);

        if (selectedDate <= now) {
            setErrorMessage('The credit date and time must be in the future.');
            return;
        }

        setLoading(true);
        setProgress(0);

        const { Amount, Message, DateToCredit, TimeToCredit } = details;

        function getRandomThreeDigitInt() {
            return Math.floor(Math.random() * 90000000) + 10000000;
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
                DateOfDebit: now.toISOString(),
                TimeOfDebit: now.toLocaleTimeString(),
                Amount,
                Message,
                userid: me,
            })
        };

        try {
            const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${me}/Transactions.json`, options);
            if (res.ok) {
                setSuccessMessage('Payment Successful!');
                setErrorMessage('');
                setDetails({
                    Amount: '',
                    Message: '',
                    DateToCredit: null,
                    TimeToCredit: ''
                });
                setQrText('');
            } else {
                throw new Error('Failed to store data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error occurred while storing data.');
        } finally {
            setLoading(false);
            setProgress(100);
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
        }
    }, [me]);

    useEffect(() => {
        if (areAllFieldsFilled()) {
            setShakeButton(true);
            const timeoutId = setTimeout(() => setShakeButton(false), 500);
            return () => clearTimeout(timeoutId);
        }
    }, [details]);

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
                        <DatePicker
                            selected={details.DateToCredit}
                            onChange={handleDateChange}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            dateFormat="dd-MM-yyyy"
                            minDate={new Date()}
                            placeholderText="Select a date"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700" htmlFor="time">
                            Time to Credit:
                        </label>
                        <TimePicker
                            onChange={handleTimeChange}
                            value={details.TimeToCredit}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            disableClock={true}
                            format="h:mm a"
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
                        className={`w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none`}
                        disabled={!areAllFieldsFilled()}
                    >
                        Payment Successful
                    </button>
                </div>
                <div className="relative flex flex-col items-center justify-center w-full p-4 md:w-1/2">
                    <span className="px-4 py-2 mb-3 text-4xl font-bold text-gray-800 bg-white rounded-lg shadow-md">
                        Scan and Pay
                    </span>
                    {qrText && (
                        <QRCode
                            value={qrText}
                            size={250}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="Q"
                            includeMargin={true}
                            className="p-2 bg-white rounded-lg shadow-md"
                        />
                    )}
                    {!qrText && (
                        <div className="w-64 h-64 bg-gray-200 rounded-lg"></div>
                    )}
                </div>
            </div>
            {successMessage && (
                <p className="mt-4 text-center text-green-500 text-md">{successMessage}</p>
            )}
            {errorMessage && (
                <p className="mt-4 text-center text-red-500 text-md">{errorMessage}</p>
            )}
        </div>
    );
};

export default QRCodeGenerator;
