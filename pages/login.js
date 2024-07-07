import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const [loginDetails, setLoginDetails] = useState({
    PhoneNumber: '',
    UserPassword: '',
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { PhoneNumber, UserPassword } = loginDetails;
    try {
      const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/credentials.json`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          const matches = Object.values(data).filter(entry => {
            return entry.Phoneno === PhoneNumber && entry.Password === UserPassword;
          });
          if (matches.length > 0) {
            const user = matches[0].Username;
            localStorage.setItem('token', 'your_token_here');
            router.push(`/home?me=${user}`);
          } else {
            console.error('No matching user found');
          }
        }
      } else {
        throw new Error('Failed to fetch data.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const goToSignUp = () => {
    router.push('/signup');
  };

  return (
    <>
      <button onClick={goToSignUp} className="absolute px-4 py-2 mt-6 text-white transition-colors duration-300 bg-transparent border-2 border-white rounded w-30 hover:bg-white hover:text-black top-3 right-16">
        Sign Up
      </button>
      <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="p-8 bg-black rounded-lg shadow-lg bg-opacity-80 w-96">
          <div className="mt-2 text-4xl font-normal text-center text-white">Login</div>
          <div>
            <h4 className="mt-8 text-white">Phone Number</h4>
            <input
              type="number"
              name='PhoneNumber'
              value={loginDetails.PhoneNumber}
              className="w-full p-2 mt-2 text-white placeholder-gray-400 bg-white border-none rounded appearance-none focus:outline-none bg-opacity-10"
              placeholder="Enter your phone number"
              onChange={handleLoginChange}
            />
          </div>
          <div className="relative mt-5">
            <h4 className="text-white">Password</h4>
            <input
              type="password"
              name='UserPassword'
              value={loginDetails.UserPassword}
              className="w-full p-2 mt-2 text-white placeholder-gray-400 bg-white border-none rounded appearance-none focus:outline-none bg-opacity-10"
              placeholder="Enter your password"
              onChange={handleLoginChange}
            />
          </div>
          <button className="w-full px-4 py-2 mt-6 text-white transition-colors duration-300 bg-transparent border-2 border-white rounded hover:bg-white hover:text-black" onClick={handleLoginSubmit}>
            Submit
          </button>
          <style jsx>{`
            input[type='number']::-webkit-inner-spin-button,
            input[type='number']::-webkit-outer-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            input[type='number'] {
              -moz-appearance: textfield; 
            }
          `}</style>
        </div>
      </div>
    </>
  );
};

export default Login;
