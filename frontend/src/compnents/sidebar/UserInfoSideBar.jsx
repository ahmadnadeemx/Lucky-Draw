import React from "react";

const UserInfoSideBar = () => {
  return (
    <div>
      <div className="space-y-2 font-medium pb-4 flex-shrink-0">
        <div className="flex justify-center items-center">
          <div className="bg-black rounded-full borderflex justify-center items-center border-none">
            <img
              src="/images/logo.png"
              alt="User avatar"
              className="w-[60px] h-[60px] rounded-full border-none"
            />
          </div>
        </div>
        <p className="w-full text-[20px] font-bold text-center">Admin</p>
        <p className="font-normal text-[15px] text-center">Manage your system data</p>
      </div>
    </div>
  );
};

export default UserInfoSideBar;
