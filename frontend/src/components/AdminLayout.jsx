import React, { useState, useCallback, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import AdminWrapper from "./ui/AdminWrapper";
import { AdminHeader, FormInput, UserAvatar } from "./ui";
import { AdminSidebar } from "./ui/AdminSidebar";
import { useAdmin } from "../context/AdminContext";



const AdminLayout = React.memo(({ 
 }) => {
  
  
  const { admin, logout } = useAdmin();
  const user = admin
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = useCallback(() => {
    logout();
    navigate("/admin/login");
  }, [logout, navigate]);

  return (
    <>
        <AdminWrapper>
            <div className="lg:m-10 flex text-black  rounded-xl min-h-screen bg-gray-100">
                <AdminSidebar/>
                <div className="w-full">
                    <AdminHeader
                // title = {title}
                >
                <UserAvatar
                user
                showName= {true}
                size="sm"
                />
                </AdminHeader>
                <div className="m-5" >
                  <Outlet />
                </div>
                </div>
                
            </div>
        
        </AdminWrapper>
        
    </>
  )
});

export default AdminLayout;
