import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'

const Login = () => {

  const navigate = useNavigate();

  const[username, setusername] = useState("");
  const [password, setpassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      name : username,
      password : password
    }

    try {
      const response = await fetch('/api/auth/login',{
        method : 'POST',
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify(user)
      })

      if(!response.ok) {
        throw new Error("login response is not ok");
      } 
      const result = await response.json();
      console.log(result.message);
      navigate('/messages', { state: { username } });

    } catch (error) {
      console.error("Error = ",error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='username' value={username} onChange={(e) => setusername(e.target.value)}/>
        <input type='password' placeholder='password' value={password} onChange={(e) => setpassword(e.target.value)}/>

        <button>Submit</button>
      </form>
    </div>
  )
}

export default Login