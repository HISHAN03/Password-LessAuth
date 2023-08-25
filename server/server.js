const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const Email = require("./UserModel")
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();
const jwt =require("jsonwebtoken")
const server = http.createServer(app);
const io = require("socket.io")(server,{
  cors:
  {
    origin:"http://localhost:3000"
  }

})

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
   next();
  });
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log("mongodb-connected");});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());



io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});


var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});
app.get("/wwe",(req,res)=>{
  res.send("hellllo")
})
app.post("/login", (req, res) => {
  const umail = req.body.gmail;
  console.log(umail);

  Email.find({ email: umail })
    .then(users => {
      if (users.length > 0) {
        const user = users[0];
        console.log(user);

        try {
          const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
          var mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Sending Email using Node.js",
            html: `<a href="http://localhost:5000/verify?token=${token}">Log in</a>`,
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
	} catch (error) {
	  console.error("Error registering user:", error);
	  res.status(500).send("Error registering user");
	}
  });


  app.get("/verify",(req,res)=>
  {
    const token=req.query.token
    if(token==null)return res.sendStatus(401)
   
    try
    {
    const declaredToken=jwt.verify(token,process.env.JWT_SECRET)
    const user=Email.find(u=>u.id==declaredToken.userId)
    res.send(`AUthed as ${user.name}`)
    }
    catch(e)
    {
    res.sendStatus(401)
    }
  
  
  })




server.listen(5000, () => console.log("server is running on port 5000"));
