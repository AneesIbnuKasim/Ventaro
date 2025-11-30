import React from "react";

const AdminHeader = ({ 
  title, 
  user, 
  stats, 
  connected, 
  onRefresh,
  children 
}) => {

  console.log('name:',name)
  return (
    <div className="bg-white rounded-tr-xl h-20 w-full shadow-xl backdrop-blur-md bg-opacity-70 transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="p-2">
        <div className="flex justify-between mx-3 items-center">
          {/* Title */}
          <div>
            <h2
              className="text-3xl font-bold mb-1 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
            >
              {title}
            </h2>
          </div>

          {/* Right Controls */}
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;