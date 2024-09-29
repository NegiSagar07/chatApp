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
    <div>
        <form onSubmit={handleSubmit} className="signup-form">
            <p className='formTitle'>Sign-Up</p>
            <div className='formInputs'>
              <input
                className='credInputs'
                type='text'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                className='credInputs'
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className='credInputs'
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                className='credInputs'
                type='text'
                placeholder='gender'
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              />
            </div>
            <button type="submit" className='signUpBtn'>Sign Up</button>
          </form>
    </div>
  )
}

export default Signup