const { createServer } = require('node:http');
const { Server } = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SignUp = require('./models/signup.models');

const app = express();
app.use(cors());
app.use(express.json());
const server = createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const dburi = "mongodb+srv://sagarnegi926:UuDO4kMGzVffjD0u@cluster0.4lefr.mongodb.net/";
const connectDb = async () => {
  try {
    await mongoose.connect(dburi);
    console.log("Connected successfully");
  } catch (error) {
    console.error("Error: ", error);
  }
};

connectDb();

// Signup route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newuser = new SignUp({ name, email, password });
    await newuser.save();
    res.status(201).json({ message: "User created successfully" });
    console.log({ name, email, password });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

// Socket.io connection and events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for chat messages from clients
  socket.on('chat message', (msg) => {
    console.log('Message received from client:', msg);

    // Broadcast the message to all other connected clients
    socket.broadcast.emit('receive message', {
      user: msg.user,  // Pass the username or 'from'
      text: msg.text,  // Pass the actual message content
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const port = 5000;
server.listen(port, () => {
  console.log(`App running on port ${port}`);
});
