const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000", // Corrected origin value
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    }
});
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json()); 


io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

const USERS =[{
	email:"moidinhishan@gmail.com",
	name:"kyle",
}]



var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: process.env.EMAIL,
	  pass: process.env.PASS
	}
  });

app.post("/login", (req, res) => {
	const user = USERS.find(u => u.email === req.body.Mail);
  
	if (user) {
	  try {
		var mailOptions = {
			from: 'Fullstacktest353@gmail.com',
			to: user.email,
			subject: 'Sending Email using Node.js',
			text: 'That was easy!'
		  };
		  transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			  console.log(error);
			} else {
			  console.log('Email sent: ' + info.response);
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
  });
  

  app.post("/register", (req, res) => {
	const email = req.body.Mail;
	console.log(email)
	res.send("register route working")
	}
  );

  app.get((req,res)=>
  {
	res.send("hello")
  })




server.listen(5000, () => console.log("server is running on port 5000"))