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
    //state for friend search feature
    const [searchTerm, setSearchTerm] = useState('');
    //state for showing search results 
    const[searchResults, setSearchResult] = useState([]);
    //friends list state
    const[friends, setFriends] = useState([]);
    //state for managing the state of search box of friends    
    const [searchResBox, setSearchResBox] = useState(false);
    // State to store the list of messages
    const [messageHistory, setMessageHistory] = useState([]);
    //state for toggling menu 
    const[isVisible, setIsVisible] = useState( false );

    // Static user for this example.
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
        console.log("message sent !");

        // Add the sent message to the message history
        setMessageHistory((prevHistory) => [...prevHistory, messageData]);

        // Clear the input field
        setMessage("");
    };
    useEffect(()=>{
      friendUpdater();
    }, []);

    useEffect(() => {
      // friendUpdater(); 
      if (chatpartner) {
        const roomId = getroomId();
        // Join the room for the current conversation
        socket.emit('join-room', roomId);
  
        // Listen for messages from the server
        socket.on('receive message', (msg) => {
          console.log("message received: ");
          setMessageHistory((prevHistory) => [...prevHistory, msg]); // Update message history+
        });
  
        // Cleanup when the component unmounts or chat partner changes
        return () => {
          socket.emit('leave-room', roomId); // Leave the room when done
          socket.off('receive message'); // Remove the message listener
        };
      }
    }, [chatpartner, currentUser]);

  const FriendSearch =(e) =>{
      e.preventDefault();
      setSearchTerm(e.target.value);
    }
  
    useEffect(() => {
      // delaying the API call by 300ms
      const delayDebounceFn = setTimeout(() => {
        if (searchTerm.trim() !== '') {
          fetchResults(searchTerm);
        }
      }, 200); //this time can be updated if needed.
      return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchResults = async (searchTerm) => {
    
    try {
      const response = await fetch('/api/auth/searchResults', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm }),
      });
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data.userslist || [])
      }
    } catch (error) {
      console.error('Error fetching search Results:', error);
    }
  };

    const menuToggler =() =>{
      setIsVisible(!isVisible);
    }
    const searchResultToggler =() =>{
      setSearchResBox(!searchResBox);
    }
    
    const friendUpdater = async() =>{
      const currUserId = localStorage.getItem("userId");
      console.log("current users Id is - ", currUserId);
      try {
        const response = await fetch("api/auth/friends", {
          method: 'POST',
          headers: {
            "Content-Type" : "application/json",
          },
          body: JSON.stringify({userId: currUserId })
        });
        const friends = await response.json();
        console.log("name of friends added: ");
        console.log(friends);
        setFriends(friends);
        
      } catch (error) {
        console.log("error while trying to fetch names: "+ error)
        
      }
    }
    const friendAdder = async (friendName)=>{
      const userId = localStorage.getItem("userId");
      const newFriendObj = {
        newFriend: friendName,
        userId: userId,
      };
      try {
        const response = await fetch('api/auth/addFriend',{
          method: "POST",
          headers:{
            "Content-Type" : "application/json",
          },
          body: JSON.stringify(newFriendObj)
        });
        console.log( "added new friend" ,response );
      } catch (error) {
        console.log("error while adding the friend.")
        
      }
      friendUpdater();
    }

  return (
    <div className='border-black border-[2px] h-[100vh] flex flex-row'>
      <div className='border-black border-2 h-full w-[25%]'>
       <div className=' flex h-[50px] border-black w-full mt-1 items-center gap-[5px]' >
          <div className='border-black border-[2px] h-[50px] w-[50px] rounded-[50%] ml-[5px] flex items-center justify-center'>
            Me
          </div>
          <div className="flex border-black border-[2px] rounded-[5px] h-[35px] relative" onClick={searchResultToggler}>
              <div className='h-full pl-[2px] flex items-center '>
                <svg width="19" height="19" viewBox="0 0 19 19" fill="#212529" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.5005 14.5005C9.28843 14.5005 10.0687 14.3453 10.7966 14.0438C11.5246 13.7423 12.186 13.3003 12.7431 12.7431C13.3003 12.186 13.7423 11.5246 14.0438 10.7966C14.3453 10.0687 14.5005 9.28843 14.5005 8.5005C14.5005 7.71257 14.3453 6.93236 14.0438 6.2044C13.7423 5.47645 13.3003 4.81501 12.7431 4.25786C12.186 3.70071 11.5246 3.25875 10.7966 2.95723C10.0687 2.6557 9.28843 2.5005 8.5005 2.5005C6.9092 2.5005 5.38308 3.13264 4.25786 4.25786C3.13264 5.38308 2.5005 6.9092 2.5005 8.5005C2.5005 10.0918 3.13264 11.6179 4.25786 12.7431C5.38308 13.8684 6.9092 14.5005 8.5005 14.5005ZM14.8205 13.4065L18.4005 16.9865C18.4959 17.0788 18.572 17.1892 18.6244 17.3113C18.6767 17.4333 18.7042 17.5645 18.7052 17.6973C18.7063 17.8301 18.6809 17.9618 18.6305 18.0846C18.5802 18.2075 18.5058 18.3191 18.4119 18.4129C18.3179 18.5067 18.2062 18.5809 18.0833 18.6311C17.9604 18.6813 17.8287 18.7065 17.6959 18.7052C17.5631 18.704 17.4319 18.6763 17.3099 18.6238C17.188 18.5713 17.0777 18.4951 16.9855 18.3995L13.4055 14.8195C11.798 16.0674 9.7753 16.6557 7.74926 16.4647C5.72322 16.2737 3.84611 15.3178 2.50005 13.7916C1.154 12.2653 0.440188 10.2834 0.503929 8.24943C0.56767 6.2154 1.40417 4.28213 2.84315 2.84315C4.28213 1.40417 6.2154 0.56767 8.24943 0.503929C10.2834 0.440188 12.2653 1.154 13.7916 2.50005C15.3178 3.84611 16.2737 5.72322 16.4647 7.74926C16.6557 9.7753 16.0674 11.798 14.8195 13.4055L14.8205 13.4065Z" fill="##212529"/>
                </svg>
              </div>
              <input value={searchTerm} onChange={FriendSearch} placeholder='Search for more Friends' className="outline-none"/>
              {searchResBox ? (<>
              <div className='absolute left-0 top-full mt-[2px] border border-black bg-white p-2 shadow-lg z-10 w-full flex flex-col justify-between items-center px-[4px]'>
              {searchResults && searchResults.length > 0 ? (<>
              {searchResults.map(( result )=> (
                <div key={result._id} className='flex h-[40px] w-[100%] border-1 border-black justify-between items-center px-[6px]'>
                   <p>{result.name} </p>
                  <button className='border-[#000097] border-[1px] bg-[#3030ff] text-white font-bold rounded-[6px] h-[30px] w-[60px]' onClick={()=>{ friendAdder(result._id)}}>Add</button>
                </div>
              ))}
              </>):(<>
                <div className="absolute left-0 top-full mt-[2px] border border-black bg-white p-2 shadow-lg z-10 w-full flex justify-between items-center px-[4px]">
                <p>No search results found !</p>
                </div>
                </>
              )}
              </div>
              </>) : (null)
               }
          </div>
        </div>
        {friends && friends.length > 0 ? (
  <>
    {friends.map((friend, index) => (
      <div key={friend._id} // Always use unique keys for mapped elements
        className="border-black border-t h-[50px] w-full flex items-center gap-2 mt-2 hover:bg-gray-300 active:bg-gray-400 transition duration-300"
      >
        <div className="flex border-[2px] border-black h-[35px] w-[35px] items-center justify-center rounded-[50%] ml-[5px]">
          {friend.name.charAt(0).toUpperCase()} { /* Display the first letter of the friend's name */}
        </div>
        <label>{friend.name}</label> 
        {/* Render friend's name */}
      </div>
    ))}
  </>
) : (
  <>
    <p>Search and add friends</p>
  </>
)}

      </div>
       <div className='border-black border-2 h-full w-full'>
       <div className='border-black border-2 h-[10vh] flex items-center pl-[10px] w-full justify-between p-[20px]'>
        <input type='text' placeholder='select chat partner' value={chatpartner} onChange={(e) => setchatpartner(e.target.value)} className='outline-none border-black border-[2px] rounded-[5px] pl-[5px]'/>
        <p>{ chatpartner }</p> 
        <div className="h-[50px] w-[50px] rounded-[50%] flex justify-center items-center hover:bg-gray-300 active:bg-gray-400 transition duration-300 relative" onClick={menuToggler} >
          <svg width="5" height="18" viewBox="0 0 5 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.09161 6.90839C0.941226 6.90839 0 7.84961 0 9C0 10.1504 0.941226 11.0916 2.09161 11.0916C3.242 11.0916 4.18323 10.1504 4.18323 9C4.18323 7.84961 3.242 6.90839 2.09161 6.90839ZM2.09161 0.633545C0.941226 0.633545 0 1.57477 0 2.72516C0 3.87555 0.941226 4.81677 2.09161 4.81677C3.242 4.81677 4.18323 3.87555 4.18323 2.72516C4.18323 1.57477 3.242 0.633545 2.09161 0.633545ZM2.09161 13.1832C0.941226 13.1832 0 14.1245 0 15.2748C0 16.4252 0.941226 17.3665 2.09161 17.3665C3.242 17.3665 4.18323 16.4252 4.18323 15.2748C4.18323 14.1245 3.242 13.1832 2.09161 13.1832Z" fill="#212529"/>
          </svg>
        {isVisible ? (
        <>
          <div className="absolute top-full border-[1px] border-black bg-white p-2 shadow-lg z-10 flex justify-center items-center px-[4px] mr-[100px] h-[150px] w-[130px] rounded-[5px]">    
            <button className='border-[#000097] border-[1px] bg-[#3030ff] text-white font-bold rounded-[6px] h-[30px] w-[100px] '>Log Out</button>
          </div>        
        </>
        ) : (null)}
        </div>
        </div>
        {/* Displaying the message history */}
        <div className="flex flex-col h-[90vh] pt-[10px]" >
        <div className="flex flex-col items-center gap-[10px] max-h-[500px] overflow-y-auto [scrollbar-width:none]">
        <div className="flex border-[1px] border-black rounded-[10px] h-[120px] w-[360px] bg-gray-500 justify-center items-center p-[10px]">
          <p className="text-yellow-400">
            Your messages are not end-to-end encrypted. Outside of the chat, no one can read your messages, except developers. Developers can read messages, so be respectful.
          </p>
        </div>
          {messageHistory.map((msg, index) => {
                return(
                  <div key={index} className='flex flex-col w-full pl-[5px] pr-[5px]'>
                    {msg.user !== currentUser ? (
                      <>
                      <div className='max-w-[550px] text-black-800 border-[1px] border-black rounded-[10px] p-[6px] self-start'>
                      <p>{msg.text}</p>
                      </div>
                      </>
                      ) : (
                      <>
                      <div className='max-w-[550px] text-white bg-green-500 border-[1px] border-green-800 rounded-[10px] p-[6px] self-end'>
                      <p>{msg.text}</p>
                      </div>
                      </>
                      )} 
                </div>
                )
        })}

      </div>
          {/* Input form to send messages */}
        <form onSubmit={sendMessage} className='flex w-full p-[5px] mt-auto justify-around'>
            <input 
                type='text' 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Type your message..."
                className='border-black border-[2px] outline-none w-[90%] rounded-[5px] h-[6vh] align-center pl-[8px]'
            />
            <button type="submit" className='h-[6vh] w-[9%] rounded-[10px] border-2 border-green-900 bg-green-500 text-white '>Send</button>
        </form>
        </div>
       </div>
    </div>
  )
}

export default Messages;
