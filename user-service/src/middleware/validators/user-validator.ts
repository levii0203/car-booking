import { body } from 'express-validator'


export const RegisterValidator = [
    body('email').isEmail().withMessage('invalid email'),
    body('password').isAlphanumeric().isLength({min:8}).withMessage('invalid password'),
    body('name').isAlpha().isLength({min:3}).withMessage('invalid username'),
    body('phone').isDecimal().isLength({min:3}).withMessage('invalid phone')
]

export const LoginValidator = [
    body('email').isEmail().withMessage('invalid email'),
    body('password').isAlphanumeric().isLength({min:8}).withMessage('invalid password'),
]