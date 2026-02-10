

import React, { useState, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, FormInput } from "../components/ui";
import { MdEmail } from "react-icons/md";
import { useUser } from "../context/UserContext";

const ProfileSchema = Yup.object({
  fName: Yup.string().required("First name is required"),
  lName: Yup.string().required("Last name is required"),
  phone: Yup.string()
  .required("Phone number is required")
  .matches(/^[6-9]\d{9}$/, "Enter a valid 10 digit mobile number"),
});

export default function AccountInfo() {
      const { user, updateProfile, loading } = useUser();
  const { name = "", email = "", phone = "" } = user ?? {};

  const parts = name.split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";


  const [isEdit, setIsEdit] = useState(false);
  const isEditingRef = useRef(false);

  return (
          <main className="flex-1 p-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Account Info</h2>

              {/* EDIT BUTTON */}
              {!isEdit && (
                <Button
                  type="button"
                  onClick={() => {
                    isEditingRef.current = true;
                    setIsEdit(true);
                  }}
                  size='sm'
                  variant='custom'
                  className=" text-white px-6 rounded-lg"
                >
                  EDIT
                </Button>
              )}
            </div>

            <Formik
              enableReinitialize={!isEditingRef.current}
              initialValues={{
                fName: firstName,
                lName: lastName,
                phone: phone,
              }}
              validationSchema={ProfileSchema}
              onSubmit={async (values) => {
                const res = await updateProfile({
                  name: `${values.fName} ${values.lName}`,
                  phone: values.phone,
                });

                if (res?.success) {
                  isEditingRef.current = false;
                  setIsEdit(false);
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
              }) => (
                <Form className="space-y-6 max-w-2xl text">
                  <div className="grid md:grid-cols-2 sm:gap-6">
                    <FormInput
                      label="First Name"
                      name="fName"
                      value={values.fName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.fName && errors.fName}
                      disabled={!isEdit}
                    />

                    <FormInput
                      label="Last Name"
                      name="lName"
                      value={values.lName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lName && errors.lName}
                      disabled={!isEdit}
                    />
                  </div>

                  <FormInput
                    label="Email Address"
                    type="email"
                    icon={<MdEmail />}
                    value={email}
                    className='input:disabled input::placeholder'
                    fieldClassName='text-white'
                    inputGroupClassName='input input:disabled input::placeholder'
                    disabled
                  />

                  <FormInput
                    label="Mobile Number"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && errors.phone}
                    disabled={!isEdit}
                  />

                  {/* SAVE ONLY */}
                  {isEdit && (
                    <Button
                      type="submit"
                      size='md'
                      disabled={isSubmitting}
                      variant={'success'}
                    >
                      SAVE
                    </Button>
                  )}
                </Form>
              )}
            </Formik>
          </main>
  )
}