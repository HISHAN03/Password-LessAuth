import React, { useState } from "react";
import "./app.css";
import Swal from "sweetalert2";


const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [Mail, SetMail] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  async function handleSubmit(ev) {
    try {
      ev.preventDefault();
      const url = isLogin ? "login" : "register";
      const email = Mail;
      let timerInterval;
      await Swal.fire({
        title: "check your e mail to continue login",
        html: "I will close in 2 seconds.",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          
         
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
        }
      });
      const dataToSend = {
        gmail: email,
      };

      const response = await fetch(`http://localhost:5000/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        if (response.status === 404) {
         
          let timerInterval;
          Swal.fire({
            title: "No email found please register first",
            html: "I will close in 2 seconds.",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            
              
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log("I was closed by the timer");
            }
          });
        } else if (response.status === 500) {
          let timerInterval;
          Swal.fire({
            title: "Error accessing the data!",
            html: "I will close in 2 seconds.",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            
         
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log("I was closed by the timer");
            }
          });
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }

      const responseData = await response.json();
      console.log("Response received:", responseData);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red p-8 rounded shadow-md w-80 text-center">
        <h2 className="text-lg font-bold mb-4">
          {isLogin ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-2 border rounded mb-4"
            required
            onChange={(ev) => SetMail(ev.target.value)}
          />
          <input
            type="submit"
            value={isLogin ? "Login" : "Register"}
            className="w-full bg-red-500 text-white p-2 rounded cursor-pointer hover:bg-red-700 transition duration-300"
          />
        </form>
        <p className="text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="text-blue-500 cursor-pointer" onClick={toggleMode}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
