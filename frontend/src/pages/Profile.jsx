

import React, { useEffect, useState, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ChevronRight } from "lucide-react";
import { Button, FormInput } from "../components/ui";
import { MdEmail } from "react-icons/md";
import { useUser } from "../context/UserContext";
import { API_CONFIG } from "../config/app";
import { useLocation, useNavigate } from "react-router-dom";

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
                  size='md'
                  className="bg-blue-600 text-white px-6 rounded-lg"
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
                      size='md'
                      disabled={isSubmitting}
                      className="bg-green-600 text-white px-8 mt-3 "
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


  














// import React, { useEffect, useState, useRef } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { ChevronRight } from "lucide-react";
// import { Button, FormInput } from "../components/ui";
// import { MdEmail } from "react-icons/md";
// import { useUser } from "../context/UserContext";
// import { API_CONFIG } from "../config/app";
// import { useLocation, useNavigate } from "react-router-dom";

// const ProfileSchema = Yup.object({
//   fName: Yup.string().required("First name is required"),
//   lName: Yup.string().required("Last name is required"),
//   phone: Yup.string(),
// });

// export default function ProfilePage({children}) {
//   const { user, getProfile, updateProfile, updateAvatar } = useUser();
//   const [isEdit, setIsEdit] = useState(false);
//   const isEditingRef = useRef(false);
//   const [avatarPreview, setAvatarPreview] = useState(null);
//   const [avatarFile, setAvatarFile] = useState(null);

//   const menuItems = [
//   { label: "Account info", path: "/auth/profile" },
//   { label: "My orders", path: "/auth/profile/orders" },
//   { label: "My address", path: "address" },
//   { label: "Change password", path: "/auth/profile/password" },
//   { label: "Wallet", path: "/auth/profile/wallet" },
// ];
  
//   const navigate = useNavigate()
//   const location = useLocation()

//   const userData = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     if (userData?.id) {
//       getProfile(userData.id);
//     }
//   }, []);

//   const { name = "", email = "", phone = "" } = user ?? {};

//   const parts = name.split(" ");
//   const firstName = parts[0] || "";
//   const lastName = parts.slice(1).join(" ") || "";

//   //HANDLE AVATAR PREVIEW WHEN SELECTED
//   const handleAvatarSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setAvatarFile(file);
//     setAvatarPreview(URL.createObjectURL(file));
//   };

//   // HANDLE SAVING AVATAR TO BACKEND
//   const handleAvatarSave = async () => {
//     if (!avatarFile) return;

//     const res = await updateAvatar(avatarFile);
//     if (res?.success) {
//       setAvatarFile(null);
//       setAvatarPreview(null);
//     }
//   };

//   //CANCELLING AVATAR CHANGE
//   const handleAvatarCancel = () => {
//     setAvatarFile(null);
//     setAvatarPreview(null);
//   };

//   //CLEAN UP AVATAR PREVIEW
//   useEffect(() => {
//   return () => {
//     if (avatarPreview) {
//       URL.revokeObjectURL(avatarPreview);
//     }
//   };
// }, [avatarPreview]);

//   return (
//     <div className="min-h-[70vh] bg-slate-100 flex flex-col">
//       <div className="max-w-7xl w-full mx-auto p-6">
//         <div className="bg-white rounded-2xl h-[65vh] shadow-sm flex overflow-hidden">
//           {/* SIDEBAR */}
//           <aside className="w-64 border-r bg-white p-6">

//             {/* AVATAR PREVIEW AND EDIT SAVE SECTION */}
//             <div className="flex flex-col items-center gap-5 mb-5">
//               <div className="relative">
//                 <img
//                   src={
//                     avatarPreview || `${API_CONFIG.imageURL}${user.avatar}`
//                   }
//                   alt="avatar"
//                   className="w-30 h-30 rounded-xl object-cover  cursor-pointer border"
//                   onClick={() => document.getElementById("avatarInput").click()}
//                 />
                
//                 <input
//                   id="avatarInput"
//                   type="file"
//                   accept="image/*"
//                   hidden
//                   onChange={handleAvatarSelect}
//                 />
//               </div>
//               {/* AVATAR PREVIEW */}
//               {avatarPreview && (
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleAvatarSave}
//                     className="bg-green-600 text-white px-4 py-1 rounded-md"
//                   >
//                     SAVE
//                   </button>

//                   <button
//                     onClick={handleAvatarCancel}
//                     className="bg-gray-300 px-4 py-1 rounded-md"
//                   >
//                     CANCEL
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* NAVIGATION MENU SECTION */}
//             <nav className="space-y-2">
//               {menuItems.map(({ label, path}) => {
//                 const isActive = location.pathname === path
//                 return (<button
//                   key={label}
//                   onClick={() => navigate(path)}
//                   className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium ${
//                     isActive
//                       ? "bg-violet-600 text-white"
//                       : "hover:bg-gray-100 text-gray-700"
//                   }`}
//                 >
//                   {label}
//                   <ChevronRight size={16} />
//                 </button>)
// })}
//             </nav>
//           </aside>
//           {children}
//           {/* MAIN */}
//           <main className="flex-1 p-10">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold">Account Info</h2>

//               {/* EDIT BUTTON */}
//               {!isEdit && (
//                 <Button
//                   type="button"
//                   onClick={() => {
//                     isEditingRef.current = true;
//                     setIsEdit(true);
//                   }}
//                   size='md'
//                   className="bg-blue-600 text-white px-6 rounded-lg"
//                 >
//                   EDIT
//                 </Button>
//               )}
//             </div>

//             <Formik
//               enableReinitialize={!isEditingRef.current}
//               initialValues={{
//                 fName: firstName,
//                 lName: lastName,
//                 phone: phone,
//               }}
//               validationSchema={ProfileSchema}
//               onSubmit={async (values) => {
//                 const res = await updateProfile({
//                   name: `${values.fName} ${values.lName}`,
//                   phone: values.phone,
//                 });

//                 if (res?.success) {
//                   isEditingRef.current = false;
//                   setIsEdit(false);
//                 }
//               }}
//             >
//               {({
//                 values,
//                 errors,
//                 touched,
//                 handleChange,
//                 handleBlur,
//                 isSubmitting,
//               }) => (
//                 <Form className="space-y-6 max-w-2xl">
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <FormInput
//                       label="First Name"
//                       name="fName"
//                       value={values.fName}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={touched.fName && errors.fName}
//                       disabled={!isEdit}
//                     />

//                     <FormInput
//                       label="Last Name"
//                       name="lName"
//                       value={values.lName}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={touched.lName && errors.lName}
//                       disabled={!isEdit}
//                     />
//                   </div>

//                   <FormInput
//                     label="Email Address"
//                     type="email"
//                     icon={<MdEmail />}
//                     value={email}
//                     disabled
//                   />

//                   <FormInput
//                     label="Mobile Number"
//                     name="phone"
//                     value={values.phone}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     error={touched.phone && errors.phone}
//                     disabled={!isEdit}
//                   />

//                   {/* SAVE ONLY */}
//                   {isEdit && (
//                     <Button
//                       type="submit"
//                       size='md'
//                       disabled={isSubmitting}
//                       className="bg-green-600 text-white px-8 mt-3 "
//                     >
//                       SAVE
//                     </Button>
//                   )}
//                 </Form>
//               )}
//             </Formik>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }
