const BaseController = require("./baseController")
const { registerValidation, loginValidation, emailValidation, resetPasswordValidation } = require('../utils/validation')
const AuthService = require("../services/authService")

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
        const result = await AuthService.verifyOtp(req.body)
        BaseController.logAction(result.user ? 'EMAIL_VERIFICATION' : 'PASSWORD_RESET_VERIFICATION',result)
        BaseController.sendSuccess(res, result.message , result.user ? result.user : result)
    })

    static requestPasswordReset = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(emailValidation, req.body)
        const resetData = await AuthService.requestPasswordReset(validatedData)
        BaseController.logAction('PASSWORD-RESET-OTP', resetData)
        BaseController.sendSuccess(res, 'Otp has been send to email successfully', resetData)
    })

    static resetPassword = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(resetPasswordValidation, req.body)
        const result = await AuthService.resetPassword(validatedData)
        BaseController.logAction('PASSWORD-RESET', result.user)
        BaseController.sendSuccess(res, 'Password has been reset successfully', result.message )
    })

}

module.exports = AuthController