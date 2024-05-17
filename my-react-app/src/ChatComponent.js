import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function ChatComponent() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    // Initialize socket connection to the backend server with custom path
    const newSocket = io('https://chat-application-1-jra3.onrender.com', {
      path: '/pathToConnection'
    });
    setSocket(newSocket);
    // Define event listeners
    newSocket.on('message', (data) => {
      const newMessage = `${data.name}: ${data.message}`;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!name.trim() || !message.trim()) {
      alert('Please enter both your name and a message.');
      return;
    }

    socket.emit('chating-message', { name, message });
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  };

  return (
    <div>
      <h1>Chatting</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
      />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter Message"
      />
      <button onClick={sendMessage}>Send</button>

      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default ChatComponent;