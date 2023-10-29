<div align="center">
  <h1>Passwordless Login Web App 🚀</h1>
  <p>
    A secure and hassle-free passwordless login system built with Express, Node.js, React, MongoDB.
  </p>
</div>

## Overview

Eliminate the need for traditional passwords with this passwordless login web app. Users register with their email, and when they log in, a unique link is sent to their email for automatic access to the home page.

## Features

-✉️ **Passwordless Login**: Say goodbye to passwords.
-📝 **User Registration**: Quick and easy registration with just an email.
-💌 **Email Authentication**: Secure authentication via email links.
-🏠 **Home Page Access**: Automatically redirected to the home page upon verification.

## Packages  Used

- Nodemailer(to send emails)
- jsonwebtoken(to set cookies)

## Installation

To run the app locally, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/HISHAN03/passwordless-login-webapp.git
   cd PasswordLess-login

2. **Install Dependencies::**
   ```sh
   # Server
     cd server
     npm install
   # Client
     cd ../client
     npm install
3. **Install Dependencies:**
   Create a .env file in the server directory with the following content:
   ```sh
    MONGO_URI=your_mongodb_uri
    SMTP_EMAIL=your_email_for_sending_links
    SMTP_PASSWORD=your_email_password
4. **Install Dependencies::**
   ```sh
   In one terminal, run the server:
   cd server
   node server
   In another terminal, run the client:
   cd client
   npm start
5. **Access the app**
   ```sh
     Open your browser and go to http://localhost:3000.

## Open to Contribute

We welcome contributions from the community. If you'd like to contribute to the development of this project, please follow these steps:

1. **Fork the Repository:**

   Click the "Fork" button on the top right of this repository.

2. **Clone Your Fork:**

   ```sh
   git clone https://github.com/HISHAN03/PasswordLess-login.git
   cd PasswordLess-login
