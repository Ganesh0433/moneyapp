import React, { useState } from 'react';
import { useRouter } from 'next/router';

const SignUp = () => {
    const router = useRouter();
    const [details, setDetails] = useState({
        Name: '',
        Phoneno: '',
        Email: '',
        Password: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Name' && /\s/.test(value)) {
            return; // Prevent entering whitespace in Name
        }
        setDetails({ ...details, [name]: value });
    };

    const getRandomThreeDigitInt = () => {
        return Math.floor(Math.random() * 9000) + 1000;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { Name, Phoneno, Email, Password } = details;
        const User = Name + getRandomThreeDigitInt();

        try {
            // Check if user with same Phoneno and Email exists
            const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/credentials.json`);
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    const matches = Object.values(data).filter(entry => {
                        return entry.Phoneno === Phoneno && entry.Email === Email;
                    });
                    if (matches.length > 0) {
                        setErrorMessage('User already exists with the same Phone number and Email.');
                        return;
                    }
                }
            } else {
                throw new Error('Failed to fetch data.');
            }

            // If no matching user, proceed with registration
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Name,
                    Username: User,
                    Phoneno,
                    Email,
                    Password,
                    CurrentBalance: 0 // Assuming CurrentBalance starts from 0
                })
            };

            // Perform registration
            const registerResponse = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/credentials.json`, options);
            const userInfoResponse = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${User}.json`, options);
            const currentBalanceResponse = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/currentbalance/${User}.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    CurrentBalance: 0,
                    formattedDate: formatDate(new Date())
                })
            });

            if (registerResponse.ok && userInfoResponse.ok && currentBalanceResponse.ok) {
                setSuccessMessage('SignUp was successful!');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                throw new Error('Failed to store data.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error occurred while registering user.');
        }
    };

    const formatDate = (date) => {
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        const timeString = date.toLocaleTimeString('en-US', options);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `Last updated at ${timeString.toLowerCase()} on ${day} ${month} ${year}`;
    };

    const login = () => {
        router.push('/login');
    };

    return (
        <>
            <button onClick={login} className="absolute w-20 px-4 py-2 mt-6 text-white transition-colors duration-300 bg-transparent border-2 border-white rounded hover:bg-white hover:text-black top-3 right-16">Login</button>
            <div className="flex items-center justify-center w-full min-h-screen p-4 bg-gradient-to-r from-purple-500 to-blue-500">
                <div className="w-full max-w-md p-6 bg-black rounded-lg shadow-lg bg-opacity-80">
                    <div className="mt-2 text-4xl font-normal text-center text-white">SignUp</div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <h4 className="mt-8 text-white">Name</h4>
                            <input
                                name='Name'
                                value={details.Name}
                                className="w-full p-2 mt-2 text-white placeholder-gray-400 bg-white border-none rounded appearance-none focus:outline-none bg-opacity-10"
                                placeholder="Enter your Name"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative mt-5">
                            <h4 className="text-white">Phoneno</h4>
                            <input
                                name='Phoneno'
                                type="number"
                                value={details.Phoneno}
                                className="w-full p-2 mt-2 text-white placeholder-gray-400 bg-white border-none rounded appearance-none focus:outline-none bg-opacity-10"
                                placeholder="Enter your Phoneno"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative mt-5">
                            <h4 className="text-white">Email</h4>
                            <input
                                name='Email'
                                value={details.Email}
                                className="w-full p-2 mt-2 text-white placeholder-gray-400 bg-white border-none rounded appearance-none focus:outline-none bg-opacity-10"
                                placeholder="Enter your Email"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative mt-5">
                            <h4 className="text-white">Password</h4>
                            <input
                                name='Password'
                                type="password"
                                value={details.Password}
                                className="w-full p-2 mt-2 text-white placeholder-gray-400 bg-white border-none rounded appearance-none focus:outline-none bg-opacity-10"
                                placeholder="Enter your password"
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 mt-6 text-white transition-colors duration-300 bg-transparent border-2 border-white rounded hover:bg-white hover:text-black">
                            Submit
                        </button>
                        {successMessage && (
                            <div className="p-4 mt-4 text-green-700 bg-green-100 border border-green-400 rounded">
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="p-4 mt-4 text-red-700 bg-red-100 border border-red-400 rounded">
                                {errorMessage}
                            </div>
                        )}
                    </form>
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

export default SignUp;
