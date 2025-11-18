const BaseController = require("./baseController")
const { registerValidation, loginValidation, strongPasswordValidation } = require('../utils/validation')
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
        BaseController.logAction('EMAIL_VERIFICATION',result.user)
        BaseController.sendSuccess(res, 'Email verification successful', result)
    })

    static resetPassword = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(strongPasswordValidation, req.body)
        await AuthService.resetPassword(validatedData)
        BaseController.logAction('PASSWORD-RESET',)
    })

}

module.exports = AuthController