const BaseController = require('../controllers/baseController')

class AdminController extends BaseController {
    static login = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(adminLoginValidation, req.body)
        const result = Admin
    })
}

module.exports = AdminController