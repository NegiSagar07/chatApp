import React, { useState } from 'react'

const Signup = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
          name: username,
          email: email,
          password: password,
          gender: gender,
        };
    
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          });
          if (!response.ok) {
            throw new Error("Response is not ok");
          }
          const message = await response.json();
          alert(message.message);
        } catch (error) {
          console.error("Error:", error);
        }
      };

  return (
    <div className='h-screen bg-gradient-to-r from-[#3C0753] to-[#910A67] flex justify-center items-center'>
        <form onSubmit={handleSubmit} className="h-3/5 w-1/4 rounded-3xl shadow-2xl flex flex-col text-white text-2xl font-serif">
            <span className='text-center mt-4 text-3xl'>Register yourself !</span>
            <div className='flex flex-col m-4'>
              <label>Name</label>
              <input
                className='h-8 rounded-md mt-2 mb-5 text-black'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label>Email</label>
              <input
                className='h-8 rounded-md mt-2 mb-5 text-black'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Password</label>
              <input
                className='h-8 rounded-md mt-2 mb-5 text-black'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Gender</label>
              <input
                className='h-8 rounded-md mt-2 mb-5 text-black'
                type='text'
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              />
            </div>
            <div className='h-16 mt-6 hover:bg-[#910A67] bg-[#3C0753] rounded-2xl shadow-2xl text-center content-center m-4'>
              <button type="submit" className=''>Sign Up</button>
            </div>
        </form>
    </div>
  )
}

export default Signup