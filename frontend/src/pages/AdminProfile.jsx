import React, { useEffect, useState, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ChevronRight } from "lucide-react";
import { Button, FormInput } from "../components/ui";
import { MdEmail } from "react-icons/md";
import { useUser } from "../context/UserContext";
import { API_CONFIG } from "../config/app";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const ProfileSchema = Yup.object({
  fName: Yup.string().required("First name is required"),
  lName: Yup.string().required("Last name is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10 digit mobile number"),
});

export default function AdminProfile() {
  const { admin, getProfile, updateProfile, updateAvatar, debouncedSearch, loading } =
    useAdmin();
  const { name = "", email = "", phone = "" } = admin ?? {};

  const parts = name.split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  const [isEdit, setIsEdit] = useState(false);
  const isEditingRef = useRef(false);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  //   const userData = JSON.parse(localStorage.getItem("user"));

  //   useEffect(() => {
  //     if (!user?.id && userData?.id) {
  //       getProfile(userData.id);
  //     }
  //   }, [user?.id]);

  //HANDLE AVATAR PREVIEW WHEN SELECTED
  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // HANDLE SAVING AVATAR TO BACKEND
  const handleAvatarSave = async () => {
    if (!avatarFile) return;

    const res = await updateAvatar(avatarFile);
    if (res?.success) {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  //CANCELLING AVATAR CHANGE
  const handleAvatarCancel = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  //CLEAN UP AVATAR PREVIEW
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  //   useEffect(() => {
  //     if (!admin) {
  //         const load = async () => {
  //         await getProfile()
  //     }
  //     load()
  //     }
  //   }, [])

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
            size="sm"
            variant="custom"
            className=" text-white px-6 rounded-lg"
          >
            EDIT
          </Button>
        )}
      </div>

      {/* AVATAR PREVIEW AND EDIT SAVE SECTION */}
      <div className="flex flex-col gap-5 mb-5">
        <div className="relative">
          <img
            src={avatarPreview || `${API_CONFIG.imageURL}${admin.avatar}`}
            alt="avatar"
            className="w-30 h-30 rounded-xl object-cover  cursor-pointer border border-gray-300"
            onClick={() => document.getElementById("avatarInput").click()}
          />

          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarSelect}
          />
        </div>
        {/* AVATAR PREVIEW */}
        {avatarPreview && (
          <div className="flex gap-3">
            <Button onClick={handleAvatarSave} variant={"success"}>
              SAVE
            </Button>

            <button
              onClick={handleAvatarCancel}
              className="bg-gray-300 px-4 py-1 rounded-md"
            >
              CANCEL
            </button>
          </div>
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
          <Form className="space-y-6 max-w-2xl">
            <div className="grid md:grid-cols-2 gap-6">
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
                size="md"
                disabled={isSubmitting}
                variant={"success"}
              >
                SAVE
              </Button>
            )}
          </Form>
        )}
      </Formik>
    </main>
  );
}
