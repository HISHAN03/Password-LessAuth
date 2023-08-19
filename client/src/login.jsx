import React, { useState } from 'react';
import './app.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red p-8 rounded shadow-md w-80 text-center">
        <h2 className="text-lg font-bold mb-4">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <form>
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-2 border rounded mb-4"
            required
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