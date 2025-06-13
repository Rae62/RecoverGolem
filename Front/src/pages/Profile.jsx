import React from "react";
import UserInfo from "../components/User/Profile/BentoProfile/UserInfo";
import { Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div className="bg-gray-100 flex-1 p-4 flex justify-center items-center min-h-screen">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 w-full max-w-4xl">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
