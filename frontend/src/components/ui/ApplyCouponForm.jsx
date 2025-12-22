import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { applyCouponThunk } from "../../redux/slices/cartSlice";
import Button from "./Button";
import FormInput from "./FormInput";

const CouponSchema = Yup.object({
  code: Yup.string()
    .trim()
    .required("Enter coupon code")
    .min(3, "Invalid coupon"),
});

const ApplyCouponForm = () => {
  const dispatch = useDispatch();
  const { subTotal, applyingCoupon, couponError, appliedCoupon } = useSelector(
    (state) => state.cart
  );

  console.log('applied in form:', appliedCoupon);
  
  return (
    <Formik
      initialValues={{ code: appliedCoupon?.code  }}
      enableReinitialize
      validationSchema={CouponSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        dispatch(
          applyCouponThunk({
            code: values.code.toUpperCase(),
          })
        )
          .unwrap()
          .then(() => {
            resetForm();
          })
          .finally(() => setSubmitting(false));
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex gap-5 items-baseline">
          <div className="flex-1">
            <Field
              name="code"
              as={FormInput}
              // value = {appliedCoupon.code ? appliedCoupon.code: null}
              placeholder="Enter coupon code"
              autoComplete="off"
            />
            <ErrorMessage
              name="code"
              component="p"
              className="text-xs text-red-500 mt-1"
            />
          </div>

          <Button
            className=" bg-purple-600"
            type="submit"
            disabled={isSubmitting || applyingCoupon}
          >
            {applyingCoupon ? "Applying..." : "Apply"}
          </Button>

          {/* API Error */}
          {couponError && (
            <p className="text-sm text-red-500 mt-1">{couponError}</p>
          )}

          {/* Success */}
          {appliedCoupon && (
            <p className="text-sm text-green-600 mt-1">
              Coupon <b>{appliedCoupon.code}</b> applied 🎉
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default ApplyCouponForm;
