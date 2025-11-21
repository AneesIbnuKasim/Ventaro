const UserService = require("../services/UserService");
const { updateProfileValidation } = require("../utils/validation");
const BaseController = require("./baseController");

class UserController extends BaseController {
    static getProfile = BaseController.asyncHandler(async(req, res)=>{
        const user = BaseController.sanitizeUser(req.user)
        BaseController.logAction('PROFAIL', user)
        BaseController.sendSuccess(res, 'Profile retrival successful', user, 200)
    })

    static updateProfile = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(updateProfileValidation, req.body)
        const user = await UserService.updateProfile(req.user.id, req.body)
        BaseController.logAction('PROFILE_UPDATE', user)
        BaseController.sendSuccess(res, 'Profile updated successfully', 200)
    })

}

module.exports = UserController