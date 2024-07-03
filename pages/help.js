import React from 'react';

function Help() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold">Need Help?</h1>
        <p className="mt-2 text-gray-700">Contact us for assistance.</p>
      </div>
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
        <div className="flex items-center space-x-4">
       
          <span className="text-gray-800">Phone: +91 8688510433</span>
          <span className="text-gray-800">Email: mekalaganeshreddy796@gmail.com </span>
          <span className="text-gray-800">Address: Gujarat-vadodara-ParulUniversity-(Atal-B/422/6),</span>
        </div>
      </div>
    </div>
  );
}

export default Help;
