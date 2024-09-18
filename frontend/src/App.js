import { useState } from 'react';
import './App.css';

function App() {

  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const handleSubmit = async(e) => {
    e.preventDefault();

    const user = {
      name : username,
      email : email,
      password : password
    }

    try {
      const response = await fetch('/signup', {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(user)
      })

      if(!response.ok) {
        throw new Error("response is not ok");
      }    
      const message = await response.json();
      console.log(message);

    } catch (error) {
      console.error("Error : ",error);
    }

  } 

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='username' value={username} onChange={(e) => setusername(e.target.value)} />
        <input type='text' placeholder='email' value={email} onChange={(e) => setemail(e.target.value)} />
        <input type='text' placeholder='password' value={password} onChange={(e)=> setpassword(e.target.value)} />

        <button>submit</button>
      </form>
    </div>
  );
}

export default App;
