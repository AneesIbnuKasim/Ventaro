import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "../components/ui";
import { useUser } from "../context/UserContext";
import { passwordChangeSchema } from "../validation/userSchema";


function PasswordChange() {
    const { changePassword } = useUser()

    
  const handleSubmit = async(values, { resetForm }) => {
    const { currentPassword, newPassword} = values
    
    await changePassword({currentPassword, newPassword})
    resetForm();
  };

  return (
    <div className="max-w-md mx-auto bg-inner-card p-6 rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Change Password</h2>

      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={passwordChangeSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm  font-medium mb-1">
                Current Password
              </label>
              <Field
                type="password"
                name="currentPassword"
                className="w-full rounded-md input input-border px-3 py-2"
              />
              <ErrorMessage
                name="currentPassword"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Field
                type="password"
                name="newPassword"
                className="w-full rounded-md input input-border px-3 py-2"
              />
              <ErrorMessage
                name="newPassword"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <Field
                type="password"
                name="confirmPassword"
                className="w-full rounded-md input input-border px-3 py-2"
              />
              <ErrorMessage
                name="confirmPassword"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            <Button
              type="submit"
            //   disabled={isSubmitting}
              variant='custom'
              className={'w-full'}
              size='sm'
            >
              Update Password
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default PasswordChange;