import Conversation from "../models/conversation.model.js";

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle room joining
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Listen for chat messages from clients
    socket.on('chat message', async (msg) => {
      console.log('Message received from client:', msg);
      
      const { roomId, user, text } = msg;

      // Save the message to the database
      try {
        // Find or create a conversation for the room
        let conversation = await Conversation.findOne({ roomId });
        
        if (!conversation) {
          conversation = new Conversation({
            participants: [user], // Add more participants as needed
            messages: []
          });
        }

        // Add the new message to the conversation
        conversation.messages.push({
          sender: user,   // Who sent the message
          text: text,     // Message content
          timestamp: new Date(),
        });

        // Save the conversation with the new message
        await conversation.save();
      } catch (error) {
        console.error('Error saving message to DB:', error);
      }

      // Broadcast the message to all clients in the same room, including the sender
      socket.broadcast.to(roomId).emit('receive message', { user, text });
    });

    // Handle room leaving
    socket.on('leave-room', (roomId) => {
      socket.leave(roomId); // Leave the room
      console.log(`User ${socket.id} left room: ${roomId}`);
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default socketHandler;
