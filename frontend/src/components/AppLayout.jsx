import React, { memo, useEffect } from 'react'
import Navbar from './ui/NavBar'
import Footer from './ui/Footer'
import { useDispatch } from 'react-redux'
import { getAuthToken } from '../utils/apiClient'
import { fetchCartThunk } from '../redux/slices/cartSlice'
import { useAuth } from '../context/AuthContext'
import { fetchWishlistThunk } from '../redux/slices/wishlistSlice'

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

  useEffect(() => {
    dispatch(fetchWishlistThunk());
  }, [dispatch]);

  //APPLY THEME ON LOAD
  useEffect(() => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
}, []);
  return (
    <div>
      <Navbar/>
      <div>
        {children}
      </div>
      <Footer/>
    </div>
  )
})

export default AppLayout
