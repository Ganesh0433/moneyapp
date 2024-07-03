import React from 'react';

function AboutUs() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 ">
      <div className="max-w-2xl p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="mb-6 text-5xl font-extrabold text-center text-gray-800">About Us</h1>
        <p className="mb-6 text-lg text-gray-700">
          Welcome to our website! Our primary goal is to provide a platform where you can securely lock your money for a selected period and time. This ensures that your funds are safeguarded and only accessible when you need them.
        </p>
        <h2 className="mb-4 text-3xl font-semibold text-gray-800">Our Mission</h2>
        <p className="mb-6 text-lg text-gray-700">
          We aim to offer a reliable and user-friendly service that helps you manage your finances effectively. By locking your money, you can plan your expenses better and achieve your financial goals without the temptation to spend prematurely.
        </p>
        <h2 className="mb-4 text-3xl font-semibold text-gray-800">How It Works</h2>
        <p className="mb-6 text-lg text-gray-700">
          Our platform allows you to deposit money and select a specific date and time when you want to unlock it. During this period, your funds will be securely held, and you'll be unable to withdraw them until the designated time arrives. Once the selected period meets, your money will automatically be transferred back to your bank account.
        </p>
        <h2 className="mb-4 text-3xl font-semibold text-gray-800">Why Choose Us</h2>
        <ul className="mb-6 space-y-2 text-lg text-gray-700 list-disc list-inside">
          <li>Secure and reliable platform</li>
          <li>User-friendly interface</li>
          <li>Helps in financial planning and discipline</li>
          <li>Transparent and easy-to-use</li>
          <li>Automatic transfer of funds upon maturity</li>
        </ul>
        <p className="mb-6 text-lg text-gray-700">
          Thank you for choosing our service. We are committed to helping you manage your finances better and achieve your financial goals.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
