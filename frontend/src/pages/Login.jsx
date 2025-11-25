import '../styles/animations.css'
import React, { useState, useCallback, useMemo, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {  Formik, Form } from 'formik'
import AuthLayout from '../components/ui/AuthLayout'
import FormInput from '../components/ui/FormInput'
import Button from '../components/ui/Button'
import { FaLongArrowAltRight } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { FaLock } from "react-icons/fa6"
import { FaSignInAlt } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { loginSchema } from '../validation/userSchema'
import { authAPI } from '../services/authService'
import { adminAPI } from '../services/adminService'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const Login = memo(() => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const submitLogin = useCallback(async (values) => {
    try {
      const { setAuthToken, setAdminToken } = await import('../utils/apiClient')

      const isAdminAttempt = values.email.includes('admin') || values.email === 'admin@gmail.com'

      let response
      if (isAdminAttempt) {
        response = await adminAPI.login(values)
        setAdminToken(response?.data?.token) 
      }
      else {
        response = await authAPI.login(values)
        setAuthToken(response?.data?.token)
      }
      
      const userData = response?.data.user || response?.data.admin

      const user = {
        id: userData.id || userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role || (isAdminAttempt ? 'admin' : 'user'),
          avatar: userData.avatar || null
        }
      
      login(user)
      toast.success(`Welcome back ${user.name || 'User'}!`)

      setTimeout(()=>{
        if (user.role === 'admin' || isAdminAttempt) navigate('/admin',{replace: true})
        else navigate('/', {replace: true})
      },100)

    } catch (error) {
      console.error({status: error.statusCode , message: error.message})
    }
}, [navigate])
  const leftContent = useMemo(() => (
      <div className="text-white p-6 space-y-3 h-full flex justify-center ">
      <img className='absolute bottom-0 right-30 w-15' src="../public/Ellipse_1.svg" alt="ellipse" />
      <img className='absolute bottom-50 right-10  w-18' src="../public/Ellipse_1.svg" alt="ellipse" />
      <img className='absolute top-0 right-10 w-14' src="../public/Ellipse_5.svg" alt="ellipse" />
      <img className='absolute bottom-50 left-30 w-24' src="../public/Ellipse_6.svg" alt="ellipse" />
      <img className='absolute top-30 left-40 w-20' src="../public/Ellipse_6.svg" alt="ellipse" />
      <div className="text-white flex items-center justify-center">
  <div className="flex flex-col gap-6 ">
    <h2 className="text-3xl font-bold">Ventaro</h2>
    <h3 className="text-xl opacity-80">Exceptional Quality.</h3>
    <h4 className="text-lg font-medium">Thoughtfully Selected.</h4>
    <h4 className="text-lg font-medium z-1">Elevate your shopping experience.</h4>
    <div className='z-1 flex  items-center gap-3'>
    <p className=" text-lg tracking-wide">Login Now</p>
    <FaLongArrowAltRight className='text-4xl text-yellow-200' />
    </div>
  </div>
</div>
    </div>
  ), [])

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Please sign in to continue"
      leftContent={leftContent}
    >
<Formik
initialValues={{
  email:'',
  password:''
}}
validationSchema={loginSchema}
onSubmit={submitLogin}
>
{({values, errors, touched, handleBlur, handleChange, isSubmitting }) => (
  <Form className="space-y-4">
        
        <FormInput
          label="Email Address"
          type="email"
          icon= {<MdEmail />}
          name= 'email'
          value= {values.email}
          onChange= {handleChange}
          onBlur= {handleBlur}
          error= {touched.email && errors.email}
          placeholder="Enter your email"
          required
        />

        <FormInput
          label="Password"
          type="password"
          icon={<FaLock />}
          name= 'password'
          value= {values.password}
          onChange= {handleChange}
          onBlur= {handleBlur}
          error= {touched.password && errors.password}
          placeholder="Create password"
          required
        />

        {/* Remember me Checkbox */}
        <div className='flex justify-between items-center'>
          <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            className="h-5 w-5 rounded border-gray-300 focus:ring-primary"
          />
          <label htmlFor="agreeToTerms" className="text-sm text-gray-600 flex gap-3">
            Remember Me
          </label>
        </div>
        <Link to="/terms" className=" text-primary font-medium no-underline">Forgot Password?</Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          block
          loading={false}
          icon={<FaSignInAlt />}
          disabled={false}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </Form>
)}

</Formik>
      

      <div className="text-center mt-6 text-gray-500 ">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-bold no-underline">
          Sign up for free
        </Link>
          <div className='small-muted m-6'>Or Continue with</div>
      </div >
    <div className='flex gap-3'>
        <Button
      type= 'button'
      variant= 'outline-secondary'
      size= 'sm'
      icon= {<FaGoogle />}
      block
      >
        {'Google'}
      </Button>
      <Button
      type= 'button'
      variant= 'outline-secondary'
      size= 'sm'
      icon= {<FaGithub />}
      block
      >
        {'Google'}
      </Button>
    </div>

    </AuthLayout>
  )
})

Login.displayName = 'Login'

export default Login