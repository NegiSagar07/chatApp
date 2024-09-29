import React from 'react'
import { Link } from 'react-router-dom'

const ProvideRoute = () => {
  return (
    <div>
        <Link to = '/signup'>Sign Up</Link>
        <Link to = '/login' >Login</Link>
    </div>
  )
}

export default ProvideRoute