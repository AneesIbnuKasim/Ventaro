import React, { memo, useCallback, useMemo, useRef } from 'react'
import AdminWrapper from '../components/ui/AdminWrapper'
import { AuthInnerBox } from '../components/ui/AuthInnerBox'
import FormInput from '../components/ui/FormInput'
import Button from '../components/ui/Button'
import { IoMdSend } from "react-icons/io";
import { authAPI } from '../services/authService'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


export const ForgotPassword = memo(() => {
    const navigate = useNavigate()

    const inputRef = useRef()

    const sendLink = useCallback(async(e) => {
        try {
        e.preventDefault()
        const email = inputRef.current.value
        const res = await authAPI.forgetPassword({email})
        
        toast.success(res.message)

        setTimeout(()=>{
            navigate(`/verify-otp?userId=${res.data.userId}&purpose=${res.data.purpose}`)
        },100)

        } catch (error) {
            console.log(error.message);
        }
    })

    const content = useMemo(() => (
        <>
            <form onSubmit={(e)=>sendLink(e)} >
            <FormInput
            type= 'email'
            placeholder= 'Enter email'
            fieldClassName= 'text-black text-lg py-3'
            ref={inputRef}
            required
            />
            <Button
            type= 'submit'
            block
            size= 'lg'
            className= 'mt-2'
            icon= {<IoMdSend />
}
            >
                SEND RESET OTP
            </Button>
            </form>
        </>
    ))

    return (
    <AdminWrapper>
        <AuthInnerBox
        title= 'Forgot your password'
        subtitle= {`Please enter the E-mail address associated with your
                    account. We will sent a password reset OTP.`}
        content= {content}
        >
            <p className='helper mt-5 cursor-pointer' to >BACK TO LOGIN</p>

        </AuthInnerBox>
    </AdminWrapper>
  )
}) 

export default ForgotPassword
