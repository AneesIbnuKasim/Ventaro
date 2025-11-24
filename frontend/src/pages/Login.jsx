import '../styles/animations.css'
import React, { useState, useCallback, useMemo, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {  Formik, Form, Field, ErrorMessage } from 'formik'
import AuthLayout from '../components/ui/AuthLayout'
import FormInput from '../components/ui/FormInput'
import Button from '../components/ui/Button'
import ButtonGroup from '../components/ui/ButtonGroup'
import { FaLongArrowAltRight } from "react-icons/fa"
import { FaUserPlus } from "react-icons/fa6"
import { MdEmail } from "react-icons/md"
import { FaLock } from "react-icons/fa6"
import { FaSignInAlt } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

// import { toast } from 'react-toastify'
// import { useAuth } from '../context/AuthContext'

const Register = memo(() => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  })

  const onSubmit = useCallback(async (data) => {
    console.log('registered');
    
})
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <FormInput
          label="Email Address"
          type="email"
          icon= {<MdEmail />}
          placeholder="Enter your email"
          {...register('email')}
          required
        />

        <FormInput
          label="Password"
          type="password"
          icon={<FaLock />}
          placeholder="Create password"
          {...register('password')}
          required
        />

        {/* Remember me Checkbox */}
        <div className='flex justify-between items-center'>
          <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            className="h-5 w-5 rounded border-gray-300 focus:ring-primary"
            {...register('agreeToTerms')}
            required
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
          {false ? "Creating Account..." : "Sign In"}
        </Button>
      </form>

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

Register.displayName = 'Register'

export default Register