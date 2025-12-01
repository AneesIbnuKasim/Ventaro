import React, { memo } from 'react'
import Navbar from './ui/NavBar'
import Footer from './ui/Footer'

const AppLayout = memo(({
    children
}) => {
    
  return (
    <>
      <Navbar/>
      {children}
      <Footer/>
    </>
  )
})

export default AppLayout
