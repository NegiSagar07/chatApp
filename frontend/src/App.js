import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Messages from './components/Messages';
import Signup from './components/Signup';
import Login from './components/Login';
import ProvideRoute from './components/ProvideRoute';


const App = () => {

  const router = createBrowserRouter([
    {
      path : '/',
      element : <ProvideRoute/>
    },
    {
      path : '/signup',
      element : <Signup/>
    },
    {
      path : '/login',
      element : <Login/>
    },{
      path : '/messages',
      element : <Messages/>
    }
  ]);

  return (
    <>
      <RouterProvider router={router}>
        <ProvideRoute/>
      </RouterProvider>
    </>
  )
}

export default App