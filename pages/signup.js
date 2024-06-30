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

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Check if the Name contains any spaces
        if (name === 'Name' && /\s/.test(value)) {
            // If there are spaces, do not update state
            return;
        }
        
        setDetails({ ...details, [name]: value });
    };

    const getRandomThreeDigitInt = () => {
        return Math.floor(Math.random() * 900) + 100; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        
        const { Name, Phoneno, Email, Password } = details;
        const User = Name + getRandomThreeDigitInt();

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
            })
        };

        try {
            const res = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/credentials.json`, options);
            const response = await fetch(`https://moneylock-dde0a-default-rtdb.firebaseio.com/UserData/userinfo/${User}.json`, options);

            if (res.ok && response.ok) {
                alert('Data stored successfully!');
                router.push('/login'); // Redirect to login page after successful signup
            } else {
                throw new Error('Failed to store data.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error occurred while storing data.');
        }
    };

    const login = () => {
        router.push('/login');
    };

    return (
        <>
            <button onClick={login} className="absolute w-20 px-4 py-2 mt-6 text-white transition-colors duration-300 bg-transparent border-2 border-white rounded hover:bg-white hover:text-black top-3 right-16">Login</button>
            <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
                <div className="p-8 bg-black rounded-lg shadow-lg bg-opacity-80 w-96">
                    <div className="mt-2 text-4xl font-normal text-center text-white">SignUp</div>
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
                            value={details.Password}
                            className="w-full p-2 mt-2 text-white placeholder-gray-400 bg-white border-none rounded appearance-none focus:outline-none bg-opacity-10"
                            placeholder="Enter your password"
                            onChange={handleChange}
                        />
                    </div>
                    <button className="w-full px-4 py-2 mt-6 text-white transition-colors duration-300 bg-transparent border-2 border-white rounded hover:bg-white hover:text-black" onClick={handleSubmit}>
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

export default SignUp;
