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

    if (loading) {
    return <Loading fullScreen text="Authenticating..." />
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{from: location}} replace />
    }

    return children
})

export const PublicRoute = memo(({
    children,
    redirectTo='/'
})=>{
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
    return <Loading fullScreen text="Loading..." />
    }

    console.log('isAuthin pub route', isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />
    }

    return children
})

export const AdminRoute = memo(({
    children,
    redirectTo='/admin/login'
})=>{
    const { isAuthenticated, loading, admin } = useAdmin()
    const location = useLocation()

    console.log('admin:', admin)
    
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