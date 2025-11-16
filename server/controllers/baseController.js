const logger = require('../utils/logger')

class BaseController {
    static asyncHandler(fn) {
        Promise.resolve(fn(req, res, next).catch(next))
    }
    static validateRequest(schema, data) {
        const { error, value } = schema.validate(data,{abortEarly: false})

        if(error) {
            throw {
                name: 'Validation error',
                details: error.details
            }
        }
        return value
    }
//     static handleValidationError(res, error) {
        
//     }
}

module.exports = BaseController

