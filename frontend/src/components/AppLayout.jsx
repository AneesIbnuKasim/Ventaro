import React, { memo, useEffect } from 'react'
import Navbar from './ui/NavBar'
import Footer from './ui/Footer'
import { useDispatch } from 'react-redux'
import { getAuthToken } from '../utils/apiClient'
import { fetchCartThunk } from '../redux/slices/cartSlice'
import { useAuth } from '../context/AuthContext'

const AppLayout = memo(({
    children
}) => {
    const dispatch = useDispatch()
    const { isAuthenticated, token } = useAuth()
    useEffect(() => {
      if (token) {
        
        dispatch(fetchCartThunk())
      }
    }, [token, dispatch])
  return (
    <>
      <Navbar/>
      <div>
        {children}
      </div>
      <Footer/>
    </>
  )
})

export default AppLayout
