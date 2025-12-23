import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashoboard from "./pages/Dashoboard";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import SubmitOtp from "./pages/SubmitOtp";
import NotFound from "./pages/NotFound";
import {
  AdminRoute,
  ProtectedRoute,
  PublicRoute,
} from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext.jsx";
import { AdminProvider } from "./context/AdminContext";
import { ProductProvider } from "./context/ProductContext.jsx";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { lazy } from "react";

const Login = lazy(() => import("./pages/Login.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Users = lazy(() => import("./pages/Users.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));
const Categories = lazy(() => import("./pages/Categories.jsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
const ProductList = lazy(() => import("./pages/ProductList.jsx"));
const AddressCard = lazy(() => import("./components/ui/AddressCard.jsx"));
const ProfileLayout = lazy(() => import("./components/ProfileLayout.jsx"));
const SearchPage = lazy(() => import("./pages/SearchPage.jsx"));
const AppLayout = lazy(() => import("./components/AppLayout.jsx"));
const AdminLayout = lazy(() => import("./components/AdminLayout.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Coupons = lazy(() => import("./pages/Coupons.jsx"));
const CheckOut = lazy(() => import("./pages/CheckOut.jsx"));

const App = () => (
  <BrowserRouter>
    <UserProvider>
      <AdminProvider>
        <AuthProvider>
          <ProductProvider>
            <Routes>
              {/* Public User Routes */}
              {/* <Route
              path="/test"
              element={
                <PublicRoute>
                  <Test />
                </PublicRoute>
              }
            /> */}

              
                <Route path="/products/:category" element={<AppLayout><ProductList /></AppLayout>} />
                <Route path="/search" element={<AppLayout><SearchPage /></AppLayout>} />
                <Route path="/product/:id" element={<AppLayout><ProductDetails /></AppLayout>} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/auth/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                }
              />
              <Route
                path="/verify-otp"
                element={
                  <PublicRoute>
                    <SubmitOtp />
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <PublicRoute>
                    <ResetPassword />
                  </PublicRoute>
                }
              />

              

              {/*         protected user routes        */}
              {/* <Route 
              path="/"
              >

              </Route> */}
              <Route path="/cart" element={<AppLayout>
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              </AppLayout>} />
              <Route path="/checkout" element={<AppLayout>
                <ProtectedRoute>
                  <CheckOut />
                </ProtectedRoute>
              </AppLayout>} />


              {/*         protected user profile routes        */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ProfileLayout />
                    </AppLayout>
                  </ProtectedRoute>
                }
              >
                {/* DEFAULT TAB */}
                <Route index element={<Navigate to="account" replace />} />

                <Route path="account" element={<Profile />} />
                <Route path="address" element={<AddressCard />} />
                
              </Route>

              {/*         ADMIN PUBLIC ROUTE              */}
              <Route
                path="/admin/login"
                element={
                  <PublicRoute>
                    <AdminLogin />
                  </PublicRoute>
                }
              />
              {/*       ADMIN PROTECTED ROUTE       */}
              <Route
                path="/admin"
                element={
                  <CategoryProvider>
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  </CategoryProvider>
                }
              >
                <Route index element={<Dashoboard />} />
                <Route path="dashboard" element={<Dashoboard />} />
                <Route path="users" element={<Users />} />
                <Route path="categories" element={<Categories />} />
                <Route path="products" element={<Products />} />
                <Route path="coupons" element={<Coupons />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={1000} />
          </ProductProvider>
        </AuthProvider>
      </AdminProvider>
    </UserProvider>
  </BrowserRouter>
);

export default App;
