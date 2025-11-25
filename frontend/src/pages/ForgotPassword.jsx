import React, { memo, useCallback, useMemo, useRef } from 'react'
import AuthLayout from '../components/ui/AuthLayout'
import AdminWrapper from '../components/ui/AdminWrapper'
import { AuthInnerBox } from '../components/ui/AuthInnerBox'
import FormInput from '../components/ui/FormInput'
import Button from '../components/ui/Button'
import { IoMdSend } from "react-icons/io";


export const ForgotPassword = memo(() => {

    const inputRef = useRef()

    const sendLink = useCallback(async() => {
        
        
    })

    const content = useMemo(() => (
        <div >
            <form action={sendLink} >
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
                Send reset link
            </Button>
            </form>
        </div>
    ))

    return (
    <AdminWrapper>
        <AuthInnerBox
        title= 'Forgot your password'
        subtitle= {`Please enter the E-mail address, associated with your
                    account. We will sent a password reset link.`}
        content= {content}
        >
            <p className='helper mt-5 cursor-pointer' to >BACK TO LOGIN</p>

        </AuthInnerBox>
    </AdminWrapper>
  )
}) 

export default ForgotPassword
