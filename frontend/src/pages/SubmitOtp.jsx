import React, { memo, useCallback, useMemo } from 'react'
import AdminWrapper from '../components/ui/AdminWrapper'
import { AuthInnerBox } from '../components/ui/AuthInnerBox'
import FormInput from '../components/ui/FormInput'
import Button from '../components/ui/Button'
import { useRef } from 'react'
import { MdOutlineDone } from "react-icons/md";
import { authAPI } from '../services'
import { useNavigate, useSearchParams } from "react-router-dom"

const SubmitOtp = memo(() => {

    const [ params ] = useSearchParams()
    const navigate = useNavigate()

    const userId = params.get('userId')
    const purpose = params.get('purpose')

    const inputRef = useRef()

    const submitOtp = useCallback(async(e)=>{
        e.preventDefault()
        const otp = inputRef.current.value
        
        const response = await authAPI.verifyOtp({
            userId,
            purpose,
            otp
        })

        console.log(response.data.resetToken);
        
        navigate(`/reset-password?resetToken=${response.data.resetToken}&userId=${response.data.userId}`)

    })
    

    const content = useMemo(() => (
            <>
                <form onSubmit={(e)=>submitOtp(e)} >
                <FormInput
                type= 'text'
                placeholder= 'Enter otp'
                fieldClassName= 'text-black text-lg py-3'
                ref={inputRef}
                required
                />
                <Button
                type= 'submit'
                block
                size= 'lg'
                className= 'mt-2'
                icon= {<MdOutlineDone />}
                >
                    SUBMIT OTP
                </Button>
                </form>
            </>
        ))
  return (
    <AdminWrapper>
        <AuthInnerBox
        title= 'Submit otp'
        subtitle= {`Enter  the 6-digit code sent to you E-mail, this code is 
                    valid only upto 10 minutes`}
        content= {content}
        >

        </AuthInnerBox>
    </AdminWrapper>
  )
})

export default SubmitOtp
