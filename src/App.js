import React from 'react'
import Navbar from './pages/Navbar'
import Home from './pages/Home'
import Bussines from './pages/Bussines'
import MessageGenerator from './pages/MessageGenerator'
import MassageSender from './pages/MassageSender'
import Linkedins from './pages/linkedins'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Home/>
      <Bussines/>
      <MessageGenerator/>
    
      <Linkedins/>
    </div>
  )
}

export default App