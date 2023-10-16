const express = require("express");
const mongoose = require("mongoose");
const Email = require("./UserModel")
const cors = require('cors');
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();
const jwt =require("jsonwebtoken")
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
}));

const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log("mongodb-connected");});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

app.post("/login", (req, res) => {
  const umail = req.body.gmail;
  Email.find({ email: umail })
    .then(users => {
      if (users.length > 0) {
        const user = users[0];
        console.log(user);
        try {
          console.log("USER"+user)
          const token = jwt.sign({ userID: user.email}, process.env.JWT_SECRET, { expiresIn: "1h" });
          res.cookie('accessToken', token, {
            httpOnly: true, 
            sameSite: 'None', 
            secure: true, 
            maxAge: 3600000, 
          });
          var mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Sending Email using Node.js",
            html: `<a href="http://localhost:3000/login">Log in</a>`,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          res.send("Login successful");
        } catch (e) {
          console.error("Error sending email:", e);
          res.status(500).send("Error sending email");
        }
      } else {
        console.log("Email not found");
        res.status(404).send("Email not found");
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Error retrieving user data");
    });
});


app.post("/register", async (req, res) => {
	const email = req.body.gmail;
  console.log(email)
	try {
	  const newEmail = await Email.create({
		email: email,});
	  console.log("User registered:", newEmail);
	  res.send("User registered successfully");
	  } 
  catch (error) {
	  console.error("Error registering user:", error);
	  res.status(500).send("Error registering user");
	}
  });


  app.get("/verify", async (req, res) => {
    const token = req.query.token;
    if (token == null) return res.sendStatus(401);
    try {
      const declaredToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log(declaredToken);
      console.log('email verified ');
      const user = await Email.findOne({ email: declaredToken.userID }); 
      console.log(user)
      console.log('username found');
      
      if (user) {
       //res.send(`Authenticated as ${user._id}`);
        `<a href="http://localhost:3000/login">Log in</a>`
        //res.redirect('http://localhost:3000/login');
      } else {
        res.sendStatus(401);
      }
    } catch (e) { 
      console.error(e);
      res.sendStatus(401);
    }
  });
  
  

app.listen(5000, () => console.log("server is running on port 5000"));
