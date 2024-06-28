import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [qrText, setQrText] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleGenerateQRCode = () => {
    const upiUrl = `upi://pay?pa=mekalaganeshreddy796@oksbi&pn=M.Ganesh%20Reddy&am=${amount}&cu=INR&aid=uGICAgICnh8qGLA&tn=${encodeURIComponent(message)}`;
    setQrText(upiUrl);
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
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            placeholder="Enter amount"
          />
          <label className="block mb-2 font-semibold text-gray-700">Message:</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            placeholder="Enter a message (Phone no)"
          />
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700" htmlFor="date">
              Date to Credit:
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="date"
              type="text"
              placeholder="Enter date (e.g., DD/MM/YYYY)"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700" htmlFor="time">
              Time to Credit:
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="time"
              type="text"
              placeholder="Enter time (e.g., HH:MM AM/PM)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <button
            onClick={handleGenerateQRCode}
            className="w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Generate QR Code
          </button>
          <p className="mt-4 mb-2 text-center text-gray-700 text-md">
            After completing the payment, please press the 
            <span className="font-semibold text-blue-600"> "Payment Successful" </span>
            button below to confirm your transaction.
          </p>
          <button
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
