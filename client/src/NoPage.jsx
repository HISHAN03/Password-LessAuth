import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white-100">
      <div className="bg-red-200 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Page Not Found 😔</h1>
        <p className="text-gray-600">
          The page you are looking for does not exist. 🕵️‍♂️
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
