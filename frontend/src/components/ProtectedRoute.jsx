import { memo } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from './ui/Loading'
import { useAdmin } from "../context/AdminContext";


export const ProtectedRoute = memo(({
    children,
    redirectTo='/login'
})=>{
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    console.log("ProtectedRoute auth:", isAuthenticated, loading);
    

    if (loading) {
    return <Loading fullScreen text="Authenticating..." />
    }

    if (!isAuthenticated) {
        console.log('redirecting to login');
        
        return <Navigate to={redirectTo} state={{from: location}} replace />
    }

    return children
})

export const PublicRoute = memo(({ children }) => {
  const { isAuthenticated, user } = useAuth()
  const { admin } = useAdmin()

  console.log('admin in public:', admin);
  

  if (isAuthenticated) {
    if (admin?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/" replace />
  }

  return children
})

export const AdminRoute = memo(({
    children,
    redirectTo='/admin/login'
})=>{
    const { isAuthenticated, loading, admin } = useAdmin()
    console.log('in adminroute', isAuthenticated);
    const location = useLocation()

    console.log('isauth', isAuthenticated);
    
    console.log('admin', admin);
    
    if (loading) {
    return <Loading fullScreen text="Verifying admin access..." />
  }

  
  

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (admin?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
})