const BaseController = require('../controllers/baseController')
const AdminService = require('../services/AdminService')
const { adminLoginValidation, updateProfileValidation } = require('../utils/validation')

class AdminController extends BaseController {
    static login = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(adminLoginValidation, req.body)
        const adminData = await AdminService.login(validatedData)
        BaseController.logAction('ADMIN_LOGIN',adminData.admin)
        BaseController.sendSuccess(res, 'Admin has been logged in successfully', adminData)
    })

    static getProfile = BaseController.asyncHandler(async(req, res)=>{
        const adminData = await AdminService.getProfile(req.admin._id)
        BaseController.logAction('GET_PROFILE',adminData.admin)
        BaseController.sendSuccess(res, 'Admin profile fetched successfully', adminData)
    })

    static updateProfile = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(updateProfileValidation, req.body)
        const admin = await AdminService.updateProfile(req.admin._id, validatedData)
        console.log('admin in controller', admin);
        
        BaseController.logAction('PROFILE_UPDATE', admin)
        BaseController.sendSuccess(res, 'Profile updated successfully', admin,200)
    })
}

module.exports = AdminController