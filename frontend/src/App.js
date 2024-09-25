import React, { useState, useEffect } from 'react';
import './App.css';
import { io } from 'socket.io-client';

// Initialize the socket connection to the backend
const socket = io('http://localhost:5000');

function App() {
  // States to hold form inputs and messages
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]); // For storing chat history
  const [currentUser, setCurrentUser] = useState(null);  // To track the logged-in user

  // Handle form submission to register a new user
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      name: username,
      email: email,
      password: password
    };

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw new Error("Response is not ok");
      }

      const message = await response.json();
      console.log(message);
      alert(message.message);
      setCurrentUser(user.name); // Store the current username after signup

    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle chat message submission
  const sendMessage = (e) => {
    e.preventDefault();

    if (message.trim() === '') return;  // Prevent sending empty messages

    const messageData = {
      user: currentUser,
      text: message
    };

    // Emit the 'chat message' event with the message data
    socket.emit('chat message', messageData);
    setMessageHistory(prevHistory => [...prevHistory, messageData]); // Add own message to history
    setMessage("");  // Clear the input field after sending
  };

  // Listen for incoming messages from the server
  useEffect(() => {
    socket.on('receive message', (msg) => {
      console.log('Received from server:', msg);
      setMessageHistory(prevHistory => [...prevHistory, msg]);  // Append the new message to history
    });

    // Cleanup the event listener when the component unmounts
    return () => {
      socket.off('receive message');  // Use the correct event name for cleanup
    };
  }, []);

  return (
    <div className="app-container">
      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      {/* Chat Section */}
      <form onSubmit={sendMessage} className="chat-form">
        <input
          type='text'
          placeholder='Write message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send Message</button>
      </form>

      {/* Display received chat message history */}
      <div className="message-history">
        <h3>Message History:</h3>
        <div className="message-history-container">
          {messageHistory.map((msg, index) => (
            <div
              key={index}
              className={`message-item ${msg.user === currentUser ? 'sent' : 'received'}`}
            >
              <strong>{msg.user === currentUser ? 'You' : msg.user}:</strong> {msg.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
