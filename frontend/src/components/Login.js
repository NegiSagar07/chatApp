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
    <div className='h-screen flex justify-center items-center bg-gradient-to-r from-[#451952] to-[#AE445A]'>
      <form onSubmit={handleSubmit} className='h-1/2 w-1/4 flex flex-col  text-white font-serif text-2xl'>
        <div className='flex flex-col rounded-3xl shadow-2xl mb-4'>
          <span className='text-center mt-4 text-3xl'>Login page </span>
          <label className='ml-4 mt-4'>Name</label>
          <input type='text' value={username} onChange={(e) => setusername(e.target.value)}
          className='text-black rounded-md m-4'/>
          <label className='mt-4 ml-4'>Password</label>
          <input type='password' value={password} onChange={(e) => setpassword(e.target.value)}
          className='text-black rounded-md m-4 mb-12'/>
        </div>
        <div className='h-16 mt-4 text-center content-center hover:bg-[#451952] rounded-3xl shadow-2xl '>
          <button>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default Login