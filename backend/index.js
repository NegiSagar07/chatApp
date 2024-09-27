import { createServer } from 'node:http';
import { Server } from 'socket.io';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';  // Ensure the .js extension is added for local imports


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


app.use("/api/auth", authRoutes);


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
