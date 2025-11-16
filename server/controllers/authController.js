const BaseController = require("./baseController")
const { registerValidation, loginValidation, strongPasswordValidation } = require('../utils/validation')

class AuthController extends BaseController {
    static register = BaseController.asyncHandler(async(req, res)=>{
        const validated = BaseController.validateRequest(registerValidation, req.body)
        
    })
}