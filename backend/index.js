import { createServer } from 'node:http';
import { Server } from 'socket.io';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';  // Ensure the .js extension is added for local imports
import socketHandler from './controller/msg.controller.js';   // Import the socket handler



const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
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




// Use the auth routes
app.use("/api/auth", authRoutes);

// Pass the Socket.io instance to the handler
socketHandler(io);  // Modularized socket handling




const port = 5000;
server.listen(port, () => {
  console.log(`App running on port ${port}`);
});
