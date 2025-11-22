const UserService = require("../services/UserService");
const { updateProfileValidation, addressValidation } = require("../utils/validation");
const BaseController = require("./baseController");

class UserController extends BaseController {
    static getProfile = BaseController.asyncHandler(async(req, res)=>{
        const user = BaseController.sanitizeUser(req.user)
        BaseController.logAction('PROFAIL', user)
        BaseController.sendSuccess(res, 'Profile retrival successful', user, 200)
    })

    static updateProfile = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(updateProfileValidation, req.body)
        const user = await UserService.updateProfile(req.user.id, validatedData)
        BaseController.logAction('PROFILE_UPDATE', user)
        BaseController.sendSuccess(res, 'Profile updated successfully', 200)
    })

    static updateAvatar = BaseController.asyncHandler(async(req, res)=>{
        const user = await UserService.updateAvatar(req)
        BaseController.logAction('AVATAR_UPDATE', 'Avatar updated successfully', user)
        BaseController.sendSuccess(res, 'Avatar updated successfully', user, 200)
    })

    static addAddress = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(addressValidation, req.body)
        const address = await UserService.addAddress(req, validatedData)
        BaseController.logAction('ADDRESS_ADD', address)
        BaseController.sendSuccess(res, 'Address added successfully', address)
    })

}

module.exports = UserController