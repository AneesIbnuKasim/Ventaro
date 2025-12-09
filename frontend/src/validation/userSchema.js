import * as Yup from 'yup'

export const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').min(2).required(),
    password: Yup.string().min(8, 'Password must be at least 8 characters')
})

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const registerSchema = Yup.object().shape({
  fName: Yup.string().min(2, 'At least 2 characters').required('First name required'),
  lName: Yup.string().min(2, 'At least 2 characters').required('Last name required'),
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password required')
  .matches(
      passwordPattern,
      "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords not match')
    .required('Confirm password required'),
  agreeTerms: Yup.boolean().oneOf([true], "Must accept terms")
});

  export const productAddSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    category: Yup.string().required("Select a category"),
    stock: Yup.number()
  .typeError("Stock must be a number")
  .positive("Stock must be greater than 0")
  .integer("Stock must be a whole number")
  .required("Stock is required"),
    brand: Yup.string().required("Brand name is required"),
    description: Yup.string().required("Description is required"),
  });