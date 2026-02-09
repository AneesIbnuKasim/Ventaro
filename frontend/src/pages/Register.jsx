import '../styles/animations.css'
import React, { useCallback, useMemo, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/ui/AuthLayout'
import FormInput from '../components/ui/FormInput'
import Button from '../components/ui/Button'
import { Formik, Form } from "formik";
import { FaLongArrowAltRight } from "react-icons/fa"
import { FaUserPlus } from "react-icons/fa6"
import { MdEmail } from "react-icons/md"
import { FaLock } from "react-icons/fa6"
import { registerSchema } from '../validation/userSchema'
import { authAPI } from '../services'
import { toast } from 'react-toastify'
import { setAuthToken } from '../utils/apiClient'
import { useAuth } from '../context/AuthContext'


const Register = memo(() => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = useCallback(async(values) => {
    
try {
      const response = await authAPI.register({
      name: `${values.fName} ${values.lName}`,
      email: values.email,
      password: values.password
    })
    
    setAuthToken(response.data.token)

    const user = {
        id: response.data.user.id || response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role || 'user',
        avatar: response.data.user.avatar || null
      }

    login(user)
    toast.success('Registration successful! Welcome to Ventaro.')

    setTimeout(() => {
        navigate('/', { replace: true });
      }, 100)
    
} catch (err) {
  console.error('Registration error:', err)
}
}, [login, navigate])
  const leftContent = useMemo(() => (
      <div className="text-white p-6 space-y-3 h-full flex justify-center ">
      <img className='absolute top-20 right-50 w-50' src="/ecommerce.png" alt="ellipse" />
      <img className='absolute bottom-0 right-30 w-15' src="/Ellipse_1.svg" alt="ellipse" />
      <img className='absolute bottom-50 right-10  w-18' src="/Ellipse_1.svg" alt="ellipse" />
      <img className='absolute top-0 right-10 w-14' src="/Ellipse_5.svg" alt="ellipse" />
      <img className='absolute bottom-50 left-30 w-24' src="/Ellipse_6.svg" alt="ellipse" />
      <img className='absolute top-30 left-20 w-20' src="/Ellipse_6.svg" alt="ellipse" />
      <div className="text-white flex items-center justify-center">
  <div className="flex flex-col gap-6 mt-30">
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
      page= 'registerPage'
    >
      <Formik 
      initialValues={{
        fName:'',
        lName:'',
        email:'',
        password:'',
        confirmPassword:'',
        agreeTerms:false
      }}
      validationSchema={registerSchema}
      onSubmit={onSubmit}>
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting })=>(

          <Form
          className="space-y-4"
          >
        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 mb-0 gap-3">
          <FormInput
            label="First Name"
            placeholder="First name"
            name='fName'
            value={values.fName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.fName && errors.fName}
            required
            />

          <FormInput
            label="Last Name"
            placeholder="Last name"
            name='lName'
            value={values.lName}
            onBlur={handleBlur}
            error={touched.lName && errors.lName}
            onChange={handleChange}
            required
            />
        </div>

        <FormInput
          label="Email Address"
          type="email"
          icon= {<MdEmail />}
          placeholder="Enter your email"
          name='email'
          value={values.email}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          onChange={handleChange}
          required
          />

        <FormInput
          label="Password"
          type="password"
          icon={<FaLock />}
          name='password'
          value={values.password}
          onBlur={handleBlur}
          error={touched.password && errors.password}
          onChange={handleChange}
          placeholder="Create password"
          helpText="Must be at least 6 characters"
          required
          />

        <FormInput
          label="Confirm Password"
          type="password"
          icon={<FaLock />}
          name='confirmPassword'
          value={values.confirmPassword}
          onBlur={handleBlur}
          error={touched.confirmPassword && errors.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          required
          />

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            name='agreeTerms'
            value={values.agreeTerms}
            onBlur={handleBlur}
            error={touched.agreeTerms && errors.agreeTerms}
            onChange={handleChange}
            className="h-5 w-5 rounded border-gray-300 focus:ring-primary"
            required
            />
          <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
            I agree to the{" "}
            <Link to="/terms" className="no-underline text-primary">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy" className="no-underline text-primary">Privacy Policy</Link>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          loading={isSubmitting}
          icon={<FaUserPlus/>}
          disabled={isSubmitting}
          >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
        </Form>
    )}
      </Formik>

      <div className="text-center mt-6 mb-5 text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-bold no-underline">
          Sign in here
        </Link>
      </div>
    </AuthLayout>
  )
})

Register.displayName = 'Register'

export default Register