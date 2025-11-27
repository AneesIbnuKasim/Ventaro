import React, { memo, useCallback, useMemo } from 'react'
import AdminWrapper from '../components/ui/AdminWrapper'
import { AuthInnerBox } from '../components/ui/AuthInnerBox'
import FormInput from '../components/ui/FormInput'
import Button from '../components/ui/Button'
import { MdOutlineDone } from "react-icons/md";
import { authAPI } from '../services'
import { useSearchParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { FaLock } from "react-icons/fa6"
import { toast } from 'react-toastify'

const ResetPassword = memo(() => {

    const [ params ] = useSearchParams()
    const navigate = useNavigate()

    const userId = params.get('userId')
    const resetToken = params.get('resetToken')

    const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const password = watch('password')

    const onSubmit = useCallback(async(data)=>{
        
      console.log('data on form::', data);
      let response
        try {
          response = await authAPI.resetPassword({
            userId,
            resetToken,
            newPassword: data.password
        })

        toast.success(response.data)

                setTimeout(() => {
          navigate('/login')
        }, 500);

        } catch (error) {
          console.log('error:',error);
          return 
        }

        console.log('res:',response)

    })
    

    const content = useMemo(() => (
            <>
                <form onSubmit={handleSubmit(onSubmit)} >
                <FormInput
                          label="Password"
                          labelColor= 'white'
                          type="password"
                          icon={<FaLock />}
                          placeholder="Enter password"
                          {...register("password", {
                          required: "Password is required",
                          pattern: {
                          value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                          message:
                         "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
                         }
                         })}
                          helpText="Must be at least 8 characters"
                          required
                          />
                          {errors.password && (
  <p style={{ color: "red" }}>{errors.password.message}</p>
)}
                
                        <FormInput
                          label="Confirm Password"
                          labelColor= 'white'
                          type="password"
                          icon={<FaLock />}
                          {...register("confirmPassword", {
                          required: "Confirm Password required",
                          validate: (value) =>
                          value === password || "Passwords do not match",
                          })} 
                          placeholder="Confirm password"
                          required
                          />
                          {errors.confirmPassword && (
                            <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
                            )}
                <Button
                type= 'submit'
                block
                size= 'lg'
                className= 'mt-2'
                icon= {<MdOutlineDone />}
                >
                    RESET PASSWORD
                </Button>
                </form>
            </>
        ))
  return (
    <AdminWrapper>
        <AuthInnerBox
        title= 'Reset Password'
        textPosition=''
        content= {content}
        >
        </AuthInnerBox>
    </AdminWrapper>
  )
})

export default ResetPassword
