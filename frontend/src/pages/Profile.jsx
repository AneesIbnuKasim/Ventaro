// import React, { useState, useCallback, useMemo } from 'react'
// import { toast } from 'react-toastify'
// import { useAuth } from '../context/AuthContext'
// import { PageHeader, Card, FormInput, Button } from '../components/ui'
// import '../styles/animations.css'

// const Profile = React.memo(() => {
//   const { user, logout } = useAuth()
//   const [activeTab, setActiveTab] = useState('profile')
//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     company: '',
//     phone: '',
//     bio: '',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   })

//   const handleInputChange = useCallback((e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }))
//   }, [])

//   const handleProfileUpdate = useCallback((e) => {
//     e.preventDefault()
//     toast.success('Profile updated successfully!')
//   }, [])

//   const handlePasswordChange = useCallback((e) => {
//     e.preventDefault()
//     if (formData.newPassword !== formData.confirmPassword) {
//       toast.error('New passwords do not match')
//       return
//     }
//     toast.success('Password changed successfully!')
//     setFormData(prev => ({
//       ...prev,
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: ''
//     }))
//   }, [formData.newPassword, formData.confirmPassword])

//   const tabItems = useMemo(() => [
//     { id: 'profile', label: 'Profile Information', icon: 'bi bi-person' },
//     { id: 'security', label: 'Security', icon: 'bi bi-shield-lock' },
//     { id: 'notifications', label: 'Notifications', icon: 'bi bi-bell' }
//   ], [])

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12">
//           <PageHeader
//             title="Profile Settings"
//             subtitle="Manage your account settings and preferences"
//             icon="bi bi-person-gear"
//           />

//           <div className="row">
//             <div className="col-md-3">
//               <div className="card">
//                 <div className="card-body text-center">
//                   <div className="avatar-lg mx-auto mb-3">
//                     <div
//                       className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
//                       style={{ width: '80px', height: '80px', fontSize: '2rem' }}
//                     >
//                       {user?.name?.charAt(0)?.toUpperCase() || 'U'}
//                     </div>
//                   </div>
//                   <h5 className="mb-1">{user?.name}</h5>
//                   <p className="text-muted">{user?.email}</p>
//                 </div>
//               </div>

//               <div className="card mt-3">
//                 <div className="card-body p-0">
//                   <div className="list-group list-group-flush">
//                     {tabItems.map(tab => (
//                       <button
//                         key={tab.id}
//                         className={`list-group-item list-group-item-action ${activeTab === tab.id ? 'active' : ''}`}
//                         onClick={() => setActiveTab(tab.id)}
//                       >
//                         <i className={`${tab.icon} me-2`}></i>
//                         {tab.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-md-9">
//               {activeTab === 'profile' && (
//                 <div className="card">
//                   <div className="card-header">
//                     <h5 className="mb-0">Profile Information</h5>
//                   </div>
//                   <div className="card-body">
//                     <form onSubmit={handleProfileUpdate}>
//                       <div className="row g-3">
//                         <div className="col-md-6">
//                           <label className="form-label">Full Name</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             required
//                           />
//                         </div>
//                         <div className="col-md-6">
//                           <label className="form-label">Email Address</label>
//                           <input
//                             type="email"
//                             className="form-control"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleInputChange}
//                             required
//                           />
//                         </div>
//                         <div className="col-md-6">
//                           <label className="form-label">Company</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             name="company"
//                             value={formData.company}
//                             onChange={handleInputChange}
//                           />
//                         </div>
//                         <div className="col-md-6">
//                           <label className="form-label">Phone Number</label>
//                           <input
//                             type="tel"
//                             className="form-control"
//                             name="phone"
//                             value={formData.phone}
//                             onChange={handleInputChange}
//                           />
//                         </div>
//                         <div className="col-12">
//                           <label className="form-label">Bio</label>
//                           <textarea
//                             className="form-control"
//                             name="bio"
//                             rows="3"
//                             value={formData.bio}
//                             onChange={handleInputChange}
//                             placeholder="Tell us about yourself..."
//                           ></textarea>
//                         </div>
//                         <div className="col-12">
//                           <button type="submit" className="btn btn-primary">
//                             Save Changes
//                           </button>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'security' && (
//                 <div className="card">
//                   <div className="card-header">
//                     <h5 className="mb-0">Change Password</h5>
//                   </div>
//                   <div className="card-body">
//                     <form onSubmit={handlePasswordChange}>
//                       <div className="row g-3">
//                         <div className="col-12">
//                           <label className="form-label">Current Password</label>
//                           <input
//                             type="password"
//                             className="form-control"
//                             name="currentPassword"
//                             value={formData.currentPassword}
//                             onChange={handleInputChange}
//                             required
//                           />
//                         </div>
//                         <div className="col-12">
//                           <label className="form-label">New Password</label>
//                           <input
//                             type="password"
//                             className="form-control"
//                             name="newPassword"
//                             value={formData.newPassword}
//                             onChange={handleInputChange}
//                             required
//                           />
//                         </div>
//                         <div className="col-12">
//                           <label className="form-label">Confirm New Password</label>
//                           <input
//                             type="password"
//                             className="form-control"
//                             name="confirmPassword"
//                             value={formData.confirmPassword}
//                             onChange={handleInputChange}
//                             required
//                           />
//                         </div>
//                         <div className="col-12">
//                           <button type="submit" className="btn btn-primary">
//                             Change Password
//                           </button>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'notifications' && (
//                 <div className="card">
//                   <div className="card-header">
//                     <h5 className="mb-0">Notification Preferences</h5>
//                   </div>
//                   <div className="card-body">
//                     <div className="form-check mb-3">
//                       <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
//                       <label className="form-check-label" htmlFor="emailNotifications">
//                         Email notifications
//                       </label>
//                     </div>
//                     <div className="form-check mb-3">
//                       <input className="form-check-input" type="checkbox" id="taskDeadlines" defaultChecked />
//                       <label className="form-check-label" htmlFor="taskDeadlines">
//                         Task deadline reminders
//                       </label>
//                     </div>
//                     <div className="form-check mb-3">
//                       <input className="form-check-input" type="checkbox" id="projectUpdates" defaultChecked />
//                       <label className="form-check-label" htmlFor="projectUpdates">
//                         Project updates
//                       </label>
//                     </div>
//                     <div className="form-check mb-3">
//                       <input className="form-check-input" type="checkbox" id="teamInvites" defaultChecked />
//                       <label className="form-check-label" htmlFor="teamInvites">
//                         Team invitations
//                       </label>
//                     </div>
//                     <button className="btn btn-primary">Save Preferences</button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// })

// export default Profile

// import React, { useEffect, useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { ChevronRight } from "lucide-react";
// import { FormInput } from "../components/ui";
// import { MdEmail } from "react-icons/md";
// import { useUser } from "../context/UserContext";

// const ProfileSchema = Yup.object({
//   fName: Yup.string().required("First name is required"),
//   lName: Yup.string().required("Last name is required"),
//   phone: Yup.string()
// });

// export default function ProfilePage() {

//   const [isEdit, setIsEdit] = useState(true)
//   const { user, getProfile, updateProfile, loading } = useUser()

//   const userData = JSON.parse(localStorage.getItem('user'))

//   useEffect(() => {
//     const load = async() => {
//       await getProfile(userData.id)
//     }
//     load()
//   }, [])
//   console.log('id', user);

//   const { name='', email='', phone=''} = user ?? userData
//   const [firstName, lastName] = name.split(' ')

//   const handleButton = () => {
//     setIsEdit(prev => ! prev)
//   }

//   return (

//       (<div className="min-h-screen bg-slate-100 flex flex-col">
//       {/* CONTENT */}
//       <div className="max-w-6xl w-full mx-auto p-6">
//         <div className="bg-white rounded-2xl shadow-sm flex overflow-hidden">
//           {/* SIDEBAR */}
//           <aside className="w-64 border-r bg-white p-6">
//             <div className="flex flex-col items-center text-center mb-6">
//               <img
//                 src="https://i.pravatar.cc/150?img=12"
//                 alt="avatar"
//                 className="w-24 h-24 rounded-xl mb-3"
//               />
//               <h3 className="font-semibold">{name}</h3>
//               <p className="text-sm text-gray-500">{email}</p>
//             </div>

//             <nav className="space-y-2">
//               {[
//                 "Account info",
//                 "My orders",
//                 "My address",
//                 "Change password",
//                 "Wallet",
//               ].map((item, i) => (
//                 <button
//                   key={item}
//                   className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium ${
//                     i === 0
//                       ? "bg-violet-600 text-white"
//                       : "hover:bg-gray-100 text-gray-700"
//                   }`}
//                 >
//                   {item}
//                   <ChevronRight size={16} />
//                 </button>
//               ))}
//             </nav>
//           </aside>

//           {/* MAIN FORM */}
//           <main className="flex-1 p-10">
//             <h2 className="text-xl font-semibold mb-6">Account Info</h2>

//             <Formik
//               enableReinitialize
//               initialValues={{
//                 fName: firstName,
//                 lName: lastName,
//                 phone: phone
//               }}
//               validationSchema={ProfileSchema}
//               onSubmit={async(values) => {
//                 const data = {
//                   name: `${values.fName} ${values.lName}`,
//                   phone: values.phone
//                 }
//                 if (isEdit) {
//                  const res =  await updateProfile(data)
//                  if (res?.success) setIsEdit(prev=> !prev)
//                 }
//               }}
//             >
//               {({values, errors, handleBlur, handleChange, touched,isSubmitting}) => (
//                 <Form className="space-y-6 max-w-2xl">
//                   <div className="grid grid-cols-2 gap-6">

//                       <FormInput
//                                   label="First Name"
//                                   placeholder="Enter first name"
//                                   name='fName'
//                                   value={values.fName}
//                                   onChange={handleChange}
//                                   onBlur={handleBlur}
//                                   error={touched?.fName && errors.fName}
//                                   disabled= {isEdit}
//                                   required
//                                   />
//                       <FormInput
//                                   label="Last Name"
//                                   placeholder="Enter last name"
//                                   name='lName'
//                                   value={values.lName}
//                                   onBlur={handleBlur}
//                                   error={touched?.lName && errors.lName}
//                                   onChange={handleChange}
//                                   disabled= {isEdit}
//                                   required
//                                   />

//                   </div>

//                   <div>
//                     <FormInput
//                               label="Email Address"
//                               type="email"
//                               icon= {<MdEmail />}
//                               name= 'email'
//                               value= {email}
//                               disabled
//                             />
//                   </div>

//                   <div>
//                     <FormInput
//                                   label="Mobile Number"
//                                   placeholder="Enter Mobile number..."
//                                   name='phone'
//                                   value={values.phone}
//                                   onBlur={handleBlur}
//                                   error={touched?.phone && errors.phone}
//                                   onChange={handleChange}
//                                   disabled= {isEdit}
//                                   />
//                   </div>

//                   <button
//                     type="submit"
//                     onClick={handleButton}
//                     className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700"
//                   >
//                     {!isEdit ? 'SAVE' : 'EDIT'}
//                   </button>
//                 </Form>
//               )}
//             </Formik>
//           </main>
//         </div>
//       </div>
//     </div>)

//   )
// }

import React, { useEffect, useState, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ChevronRight } from "lucide-react";
import { Button, FormInput } from "../components/ui";
import { MdEmail } from "react-icons/md";
import { useUser } from "../context/UserContext";
import { API_CONFIG } from "../config/app";

const ProfileSchema = Yup.object({
  fName: Yup.string().required("First name is required"),
  lName: Yup.string().required("Last name is required"),
  phone: Yup.string(),
});

export default function ProfilePage() {
  const { user, getProfile, updateProfile, updateAvatar } = useUser();
  const [isEdit, setIsEdit] = useState(false);
  const isEditingRef = useRef(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (userData?.id) {
      getProfile(userData.id);
    }
  }, []);

  const { name = "", email = "", phone = "" } = user ?? {};

  const parts = name.split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

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

  return (
    <div className="min-h-[70vh] bg-slate-100 flex flex-col">
      <div className="max-w-7xl w-full mx-auto p-6">
        <div className="bg-white rounded-2xl h-[65vh] shadow-sm flex overflow-hidden">
          {/* SIDEBAR */}
          <aside className="w-64 border-r bg-white p-6">

            {/* AVATAR PREVIEW AND EDIT SAVE SECTION */}
            <div className="flex flex-col items-center gap-5 mb-5">
              <div className="relative">
                <img
                  src={
                    avatarPreview || `${API_CONFIG.imageURL}${user.avatar}`
                  }
                  alt="avatar"
                  className="w-30 h-30 rounded-xl object-cover  cursor-pointer border"
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
                  <button
                    onClick={handleAvatarSave}
                    className="bg-green-600 text-white px-4 py-1 rounded-md"
                  >
                    SAVE
                  </button>

                  <button
                    onClick={handleAvatarCancel}
                    className="bg-gray-300 px-4 py-1 rounded-md"
                  >
                    CANCEL
                  </button>
                </div>
              )}
            </div>

            {/* NAVIGATION MENU SECTION */}
            <nav className="space-y-2">
              {[
                "Account info",
                "My orders",
                "My address",
                "Change password",
                "Wallet",
              ].map((item, i) => (
                <button
                  key={item}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium ${
                    i === 0
                      ? "bg-violet-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {item}
                  <ChevronRight size={16} />
                </button>
              ))}
            </nav>
          </aside>

          {/* MAIN */}
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
        </div>
      </div>
    </div>
  );
}
