import React, { memo } from "react";

const  Login = memo(()=>{


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
      <div className="bg-white rounded-3xl shadow-xl flex w-full max-w-5xl overflow-hidden">
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center items-start w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-12 rounded-r-[4rem]">
          <h1 className="text-4xl font-bold mb-4">welcome to Ventaro</h1>
          <p className="text-lg opacity-90">where quality finds you</p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
              <span className="text-blue-600 text-3xl">🛍️</span>
            </div>
            <p className="text-gray-600">Please sign in to continue</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 justify-center mb-6">
            <button className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition text-sm font-medium">
              User Login
            </button>
            <button className="px-5 py-2 rounded-lg text-orange-600 border border-orange-400 hover:bg-orange-50 transition text-sm font-medium">
              Admin Login
            </button>
          </div>

          <p className="text-center text-gray-500 mb-4 text-sm">Or sign in with your account</p>

          {/* Form */}
          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email Address *</label>
              <div className="flex items-center gap-2 mt-1 border rounded-lg px-3 py-2 bg-gray-50">
                <span>📧</span>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium">Password *</label>
              <div className="flex items-center gap-2 mt-1 border rounded-lg px-3 py-2 bg-gray-50">
                <span>🔒</span>
                <input
                  type="password"
                  placeholder="Enter your password..."
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Remember me
              </label>
              <button className="text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Sign In */}
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2">
              <span>↪️</span> Sign In
            </button>
          </form>

          {/* Signup */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <button className="text-blue-600 hover:underline">Signup for free</button>
          </p>

          {/* Social */}
          <p className="text-center text-sm text-gray-500 mt-6 mb-3">
            Or continue with
          </p>
          <div className="flex gap-3 justify-center">
            <button className="w-32 py-2 border rounded-lg flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition">
              <span>🔍</span> Google
            </button>
            <button className="w-32 py-2 border rounded-lg flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition">
              <span>🐱</span> Github
            </button>
          </div>
        </div>
      </div>
    </div>
  );
})

export default Login

