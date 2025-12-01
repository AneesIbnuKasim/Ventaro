import React, { memo } from 'react'
import Navbar from './ui/NavBar'
import Footer from './ui/Footer'

const AppLayout = memo(({
    children
}) => {
    
  return (
    <>
      <Navbar/>
      <Footer/>
    </>
  )
})

export default AppLayout
