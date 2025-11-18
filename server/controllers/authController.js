const BaseController = require("./baseController")
const { registerValidation, loginValidation, changePasswordValidation, emailValidation, resetPasswordValidation } = require('../utils/validation')
const AuthService = require("../services/AuthService")

class AuthController extends BaseController {
    static register = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(registerValidation, req.body)
        const result = await AuthService.register(validatedData)
        BaseController.logAction('USER_REGISTER',result.user)
        BaseController.sendSuccess(res, 'User registered successfully', result, 201)
    })

    static login = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(loginValidation, req.body)
        const result = await AuthService.login(validatedData)
        BaseController.logAction('USER_LOGIN',result.user)
        BaseController.sendSuccess(res, 'Login successful', result)
    })

    static verifyOtp = BaseController.asyncHandler(async(req, res)=>{
        const result = await AuthService.verifyOtp(req.query, req.body)
        BaseController.logAction(result.user ? 'EMAIL_VERIFICATION' : 'PASSWORD_RESET_VERIFICATION',result)
        BaseController.sendSuccess(res, result.message , result.user ? result.user : result.resetToken)
    })

    static changePassword = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(changePasswordValidation, req.body)
        await AuthService.changePassword(req.user._id, validatedData)
        BaseController.logAction('PASSWORD-CHANGE',req.user)
        BaseController.sendSuccess(res, 'Password changed successfully')
    })

    static requestPasswordReset = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(emailValidation, req.body)
        const email = await AuthService.requestPasswordReset(validatedData)
        BaseController.logAction('PASSWORD-RESET-OTP', email)
        BaseController.sendSuccess(res, 'Otp has been send to email successfully')
    })

    static resetPassword = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(resetPasswordValidation, req.body)
        const user = await AuthService.resetPassword(validatedData)
        BaseController.logAction('PASSWORD-RESET', user)
        BaseController.sendSuccess(res, 'Password has been reset successfully')
    })


}

module.exports = AuthController