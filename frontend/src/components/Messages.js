import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const socket = io('http://localhost:5000');

const Messages = () => {

  const location = useLocation(); 
  const currentUser = location.state?.username || 'Guest'; 
  const [chatpartner, setchatpartner] = useState("");
    // State to track current message input
    const [message, setMessage] = useState("");

    // State to store the list of messages
    const [messageHistory, setMessageHistory] = useState([]);

    // Static user for this example
    // You can replace this with dynamic user data

    const getroomId = () => {
      return [currentUser,chatpartner].sort().join('-');
    }

    // Function to handle sending message
    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() === '') return; // Prevent sending empty messages

        const roomId = getroomId();
    
        const messageData = {
          roomId,
          user: currentUser,
          text: message,
        };
    
        // Emit the message to the server via socket
        socket.emit('chat message', messageData);

        // Add the sent message to the message history
        setMessageHistory((prevHistory) => [...prevHistory, messageData]);

        // Clear the input field
        setMessage("");
    };

    useEffect(() => {
      if (chatpartner) {
        const roomId = getroomId();
  
        // Join the room for the current conversation
        socket.emit('join-room', roomId);
  
        // Listen for messages from the server
        socket.on('receive message', (msg) => {
          setMessageHistory((prevHistory) => [...prevHistory, msg]); // Update message history
        });
  
        // Cleanup when the component unmounts or chat partner changes
        return () => {
          socket.emit('leave-room', roomId); // Leave the room when done
          socket.off('receive message'); // Remove the message listener
        };
      }
    }, [chatpartner, currentUser]);

  return (
    <div>
        <input type='text' placeholder='select chat partner' value={chatpartner} onChange={(e) => setchatpartner(e.target.value)}/>
        {/* Displaying the message history */}
        <div className="message-box">
          {messageHistory.map((msg, index) => (
            <div key={index} className={msg.user === currentUser ? "sent-message" : "received-message"}>
            {/* Differentiate messages sent by the user and received from others */}
            <strong>{msg.user === currentUser ? 'You' : msg.user}:</strong> {msg.text}
            </div>
          ))}
        </div>

        {/* Input form to send messages */}
        <form onSubmit={sendMessage}>
            <input 
                type='text' 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Type your message..."
            />
            <button type="submit">Send</button>
        </form>
    </div>
  )
}

export default Messages;
