import React from 'react'

function AuthLayout({
    children,
    title,
    subtitle,
    leftContent,
    rightContent,
    showLogo,
    className= ''
}) {

    const defaultLeftContent = (
    <div className="text-center p-5 animate-slide-in-left">
      <div className="mb-4">
        <i className="bi bi-kanban display-1 mb-4"></i>
        <h2 className="display-5 fw-bold mb-4">
          {title}
        </h2>
        <p className="lead mb-4">
          Where Quality Finds You
        </p>
      </div>
      {/* <FeatureList 
        features={defaultFeatures} 
        variant="horizontal" 
        iconBg="white" 
        className="text-start"
      /> */}
    </div>
  )

  return (
    <>
    <div >

    </div>
    </>
  )
}

export default AuthLayout
