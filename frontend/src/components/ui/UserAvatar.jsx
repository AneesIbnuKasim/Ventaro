import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const UserAvatar = ({ 
  user, 
  size = 'md', // xs, sm, md, lg, xl
  variant = 'circle', // circle, rounded, square
  showName = false,
  showEmail = false,
  className = ''
}) => {
  const getSizeClasses = () => {
    const sizes = {
      xs: { width: '32px', height: '32px', fontSize: '0.75rem' },
      sm: { width: '40px', height: '40px', fontSize: '1rem' },
      md: { width: '60px', height: '60px', fontSize: '1.5rem' },
      lg: { width: '80px', height: '80px', fontSize: '2rem' },
      xl: { width: '120px', height: '120px', fontSize: '3rem' }
    };
    return sizes[size] || sizes.md;
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'rounded': return 'rounded';
      case 'square': return 'rounded-0';
      default: return 'rounded-circle';
    }
  };

  const sizeStyle = getSizeClasses();
  const variantClass = getVariantClass();
  
  const avatarElement = user?.avatar ? (
    <img
      src={user.avatar || '../public/LOGO.png'}
      alt={user?.name || 'User'}
      className={`${variantClass} ${className}`}
      style={sizeStyle}
    />
  ) : (
    <div
      className={`bg-primary flex items-center justify-center rounded-full text-white ${variantClass} ${className}`}
      style={sizeStyle}
    >
      <span style={{ fontSize: sizeStyle.fontSize }}>
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </span>
    </div>
  );

  if (!showName && !showEmail) {
    return avatarElement;
  }

  return (
    <div className="flex items-center">
      {avatarElement}
      {(showName || showEmail) && (
        <div className="ms-3 relative">
          {showName && user?.name && <h6 className="mb-0">{user.name}</h6>}
          {showEmail && user?.email && (
            <p className="text-muted mb-0 small">{user.email}</p>
          )}
          <div className="absolute hidden w-25 text-center group-hover:block bg-violet-300 top-4 right-1 rounded z-100">
                <NavLink className="flex flex-col w-full ">
                  <Link
                    to={"/profile/account"}
                    className="hover:bg-violet-400 rounded p-1 "
                  >
                    Profile
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                  >
                    Logout
                  </Link>
                </NavLink>
              </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;