import React from "react";
import { Link } from "react-router-dom";

const AuthLayout1 = ({
  children,
  title,
  subtitle,
  leftContent,
  icon,
  rightContent,
  showLogo = true,
  className = "",
}) => {
  const defaultLeftContent = (
    <div className="text-center p-6 animate-slide-left">
      <div className="mb-6">
        <i className="bi bi-kanban text-6xl mb-4 block"></i>
        <h2 className="text-4xl font-bold mb-4">Welcome Back to Ventaro</h2>
        <p className="text-lg opacity-90">
          Where quality finds You
        </p>
      </div>
    </div>
  )

  const content = (
    <div className=" w-full">
      <div className="flex w-full lg:w-6/12 items-center">
        <div className="w-full py-3 px-8 max-w-[470px] ">
          <div className="animate-slide-right delay-100">
            {showLogo && (
              <div className="text-center items-center mb-8">
                <Link to="/" >
                <img className="inline-block w-15" src="../public/LOGO.svg" alt="logo" />
                </Link>
                {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
                {subtitle && <p className="text-muted">{subtitle}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (

<>
   <div className="flex bg-amber-400 justify-center h-500">
     <div className="bg-green-400">{content}</div>
    <div>{content}</div>
   </div>


      {/* RIGHT SIDE */}
      {/* <AuthRight/> */}

</>
  )
}

export default AuthLayout1;