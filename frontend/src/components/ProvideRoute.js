import React from 'react'
import { Link } from 'react-router-dom'

const ProvideRoute = () => {
  return (
    <div className="h-screen bg-cover bg-center bg-gradient-to-r from-[#8C3061] to-[#522258] flex flex-col items-center">
      <div className='h-1/2 w-1/3 rounded-3xl shadow-2xl flex flex-col mt-36 '>
        <span className='text-7xl text-white font-serif mb-4  ml-6 mt-6'>Welcome,</span>
        <span className='text-7xl text-white font-serif mb-5  ml-6'> Stay Connected,</span>
        <span className='text-6xl text-white font-serif mb-10 ml-6'>Anytime, Anywhere.</span>
        <p className='text-xl text-white font-serif ml-6 mb-2'>Hey there !</p>
        <p className='text-xl text-white font-serif ml-6 mb-2'>Join the conversation and experience</p>
        <p className='text-xl text-white font-serif ml-6'> seamless communication with friends and family.</p>
      </div>
      <div className='flex flex-row'>
        <div className='h-16 w-80 rounded-3xl shadow-2xl text-center content-center mt-6 hover:bg-[#C63C51]'>
          <Link to = '/signup' className='text-3xl text-white font-serif'>Signup</Link>
        </div>
        <div className='h-16 w-80 rounded-3xl shadow-2xl text-center content-center mt-6 hover:bg-[#C63C51]'>
          <Link to = '/login' className='text-3xl text-white font-serif'>Login</Link>
        </div>
      </div>
    </div>
  )
}

export default ProvideRoute