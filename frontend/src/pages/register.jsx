import '../styles/animations.css'
import React, { useState, useCallback, useMemo, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import AuthLayout from '../components/ui/AuthLayout'
import FormInput from '../components/ui/FormInput'
import Button from '../components/ui/Button'
import { FaLongArrowAltRight } from "react-icons/fa"
import { FaUserPlus } from "react-icons/fa6"
import { MdEmail } from "react-icons/md"
import { FaLock } from "react-icons/fa6"

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
    <h2 className="text-3xl font-bold">Welcome to Ventaro</h2>
    <h3 className="text-xl opacity-80">Where Quality Finds You</h3>
    <h4 className="text-lg font-medium">Be part of something better</h4>
    <div className='z-100 flex  items-center gap-3'>
    <p className=" text-lg tracking-wide">Join Now</p>
    <FaLongArrowAltRight className='text-4xl text-yellow-200' />
    </div>
  </div>
</div>
    </div>
  ), [])

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join thousands of users who enjoys Ventaro"
      leftContent={leftContent}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormInput
            label="First Name"
            placeholder="First name"
            {...register('firstName')}
            required
          />

          <FormInput
            label="Last Name"
            placeholder="Last name"
            {...register('lastName')}
            required
          />
        </div>

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
          helpText="Must be at least 6 characters"
          {...register('password')}
          required
        />

        <FormInput
          label="Confirm Password"
          type="password"
          icon={<FaLock />}
          placeholder="Confirm password"
          {...register('confirmPassword')}
          required
        />

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            className="h-5 w-5 rounded border-gray-300 focus:ring-primary"
            {...register('agreeToTerms')}
            required
          />
          <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
            I agree to the{" "}
            <Link to="/terms" className="underline text-primary">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline text-primary">Privacy Policy</Link>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          loading={false}
          icon={<FaUserPlus/>}
          disabled={false}
        >
          {false ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center mt-6 text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-primary underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  )
})

Register.displayName = 'Register'

export default Register