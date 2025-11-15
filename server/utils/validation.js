const Joi = require('joi')

const commonPatterns = {
    name: Joi.string().min(2).max(100).trim().required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(8).max(128).required(),
    objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    status: Joi.string().valid(['active', 'banned', 'inactive']),
    role: Joi.string().valid(['user', 'admin'])
}

const customMessages = {
    'string.min': '{#label} must be at least {#limit} characters long',
    'string.max': '{#label} cannot exceed {#limit} characters',
    'string.email': 'please provide a valid email address',
    'any.required': '{#label} is required',
    'any.only': '{#label} must be one of {#valids}',
    'string.pattern.base': '{#label} format is invalid'
}

const strongPasswordValidation = Joi.string()
.min(8)
.max(128)
.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
.messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
})

const registerValidation = Joi.object({
    name: commonPatterns.name.messages(customMessages),
    email: commonPatterns.email.messages(customMessages),
    password: commonPatterns.password.messages(customMessages),
})

const loginValidation = Joi.object({
    email: commonPatterns.email.messages(customMessages),
    password: commonPatterns.password.messages(customMessages)
})