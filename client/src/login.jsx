import io from "socket.io-client";
import React, { useState } from 'react';
import './app.css';
const socket = io.connect('http://localhost:5000');

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const [Mail,SetMail]=useState(true);
  const toggleMode = () => 
    {
    setIsLogin(!isLogin);
    };
async function hds()
{
  try{
    console.log("sending request")
    const res= await fetch(`http://localhost:5000/wwe`)
    console.log(res)
    console.log("reached ")
  }catch(e){
    console.log(e)
    
  }
}
async function handleSubmit(ev) {
  try {
    ev.preventDefault();
    const url = isLogin ? 'login' : 'register';
    const email = Mail; // Assuming Mail contains the email
    
    console.log('Request sending');
    
    const dataToSend = {
      gmail: email  // Use the property name "gmail" to match the backend expectation
    };
    
    const response = await fetch(`http://localhost:5000/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend), // Send the JSON object in the body
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('Response received:', responseData);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

    
    
    
    
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red p-8 rounded shadow-md w-80 text-center">
        <h2 className="text-lg font-bold mb-4">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <button on onClick={hds}>wer</button>
        <form onSubmit={handleSubmit} >
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-2 border rounded mb-4"
            required
            onChange={(ev) => SetMail(ev.target.value)} 
          />
          <input
            type="submit"
            value={isLogin ? 'Login' : 'Register'}
            className="w-full bg-red-500 text-white p-2 rounded cursor-pointer hover:bg-red-700 transition duration-300"
          />
        </form>
        <p className="text-gray-600">
          {isLogin
            ? "Don't have an account? "
            : 'Already have an account? '}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={toggleMode}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};


export default Login;