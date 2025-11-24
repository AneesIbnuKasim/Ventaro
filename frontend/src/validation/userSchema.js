import * as yup from 'Yup'

export const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').min(2).required(),
    password: yup.string().min(8, 'Password must be at least 8 characters').max()
})

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const registerSchema = yup.object().shape({
  fName: yup.string().min(2, 'At least 2 characters').required('First name required'),
  lName: yup.string().min(2, 'At least 2 characters').required('Last name required'),
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password required')
  .matches(
      passwordPattern,
      "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character"
    ),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords not match')
    .required('Confirm password required'),
  agreeTerms: yup.boolean().oneOf([true], "Must accept terms")
});