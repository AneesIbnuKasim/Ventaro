import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { applyCouponThunk } from "@/store/cart/cartThunks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CouponSchema = Yup.object({
  code: Yup.string()
    .trim()
    .required("Enter coupon code")
    .min(3, "Invalid coupon")
});

const ApplyCouponForm = () => {
  const dispatch = useDispatch();
  const { subTotal, applyingCoupon, couponError, appliedCoupon } =
    useSelector(state => state.cart);

  return (
    <Formik
      initialValues={{ code: "" }}
      validationSchema={CouponSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        dispatch(
          applyCouponThunk({
            code: values.code.toUpperCase(),
            cartTotal: subTotal
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
        <Form className="flex gap-2 items-start">
          <div className="flex-1">
            <Field
              name="code"
              as={Input}
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
            type="submit"
            disabled={isSubmitting || applyingCoupon}
          >
            {applyingCoupon ? "Applying..." : "Apply"}
          </Button>

          {/* API Error */}
          {couponError && (
            <p className="text-sm text-red-500 mt-1">
              {couponError}
            </p>
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