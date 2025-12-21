import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").min(2).required(),
  password: Yup.string().min(8, "Password must be at least 8 characters"),
});

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const registerSchema = Yup.object().shape({
  fName: Yup.string()
    .min(2, "At least 2 characters")
    .required("First name required"),
  lName: Yup.string()
    .min(2, "At least 2 characters")
    .required("Last name required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password required")
    .matches(
      passwordPattern,
      "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords not match")
    .required("Confirm password required"),
  agreeTerms: Yup.boolean().oneOf([true], "Must accept terms"),
});

export const productAddSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  categoryId: Yup.string().required("Select a category"),
  stock: Yup.number("Stock must be a Number")
    .positive("Stock must be greater than 0")
    .integer("Stock must be a whole number")
    .required("Stock is required"),
  basePrice: Yup.number("basebasePrice must be a number")
    .positive("basePrice must be greater than 0")
    .integer("basePrice must be a whole number")
    .required("basePrice required"),
  brandName: Yup.string().required("Brand name is required"),
  description: Yup.string()
    .min(8, "Description must be at least 8 characters")
    .required("Description is required"),
  discount: Yup.number("Discount must be a Number").min(0).max(100).optional(),
});

// USER SECTION

// ADD ADDRESS VALIDATION
export const addressValidationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter valid 10 digit phone number")
    .required("Phone number is required"),
  pinCode: Yup.string()
    .matches(/^[0-9]{6}$/, "Enter valid pincode")
    .required("Pincode is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  addressLine: Yup.string().required("Address is required"),
  label: Yup.string()
    .oneOf(["Home", "Work", "Other"])
    .required("Label is required"),
  isDefault: Yup.boolean(),
});

//COUPON FORM VALIDATION SCHEMA
export const couponValidation = Yup.object({
  code: Yup.string().required("Coupon code required"),
  discountType: Yup.string().oneOf(["PERCENT", "FLAT"]).required(),
  discountValue: Yup.number().positive().required(),
  maxDiscountAmount: Yup.number().when("discountType", {
    is: "PERCENT",
    then: s => s.positive().nullable(),
  }),
  minOrderAmount: Yup.number().min(0),
  startDate: Yup.date().required(),
  endDate: Yup.date().required().min(Yup.ref("startDate"), "End date must be after start date"),
});