import React, { useState, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import AdminWrapper from "./ui/AdminWrapper";
import { AdminHeader, FormInput, UserAvatar } from "./ui";
import { IoSearch } from "react-icons/io5";
import { AdminSidebar } from "./ui/AdminSidebar";



const AppLayout = React.memo(({ children,
  title
 }) => {
  const name = title
  console.log('title:',name);
  
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return (
    <>
        <AdminWrapper>
            <div className="lg:m-10 flex  rounded-xl min-h-screen bg-gray-100">
                <AdminSidebar/>
                <div className="w-full">
                    <AdminHeader
                title = {title}
                >
                <UserAvatar
                user
                size="sm"
                />
                </AdminHeader>
                  {children}
                </div>
                
            </div>
        
        </AdminWrapper>
        
    </>
  )
});

export default AppLayout;
