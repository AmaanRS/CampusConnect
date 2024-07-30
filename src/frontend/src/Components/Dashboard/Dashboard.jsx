/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from "react";
import Cookie from "js-cookie";
import { NavLink, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth & Authorization/AuthContext";
import { TbLogout2 } from "react-icons/tb";
import { IoSearchSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { GoHome } from "react-icons/go";
import { IoMdNotificationsOutline } from "react-icons/io";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const isLoggedIn = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/login", { replace: false });
    }
  }, [isLoggedIn]);

  return (
    <div className="w-full h-full bg-blue-extralight ">
      <div className="nav bg-white p-4 flex justify-between items-center shadow-md ">
        <div className="logo">
          <h1 className="tracking-tighter text-lg font-semibold text-blue-dark">
            Campus<span className="text-blue-light">Connect</span>
          </h1>
        </div>
        <div>
          <IoMdNotificationsOutline className="text-2xl text-blue-dark" />
        </div>
      </div>
      <div className="w-full h-screen bg-blue-extralight">
        <Outlet />
      </div>

      <div
        className="fixed bottom-0 left-0 text-2xl p-3 sm:p-5 cursor-pointer flex border-t-[.2px] border-t-blue-dark
        justify-evenly gap-10 w-full bg-blue-extralight"
      >
        <NavLink
          to="/dashboard/home"
          className={({ isActive }) =>
            `w-full h-full flex items-center justify-center p-2 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-dark text-white"
                : "text-blue-dark hover:bg-gray-300"
            }`
          }
        >
          <GoHome />
        </NavLink>
        <NavLink
          to="searchprof"
          className={({ isActive }) =>
            `w-full h-full flex items-center justify-center p-2 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-dark text-white"
                : "text-blue-dark hover:bg-gray-300"
            }`
          }
        >
          <IoSearchSharp />
        </NavLink>
        <NavLink
          to="/dashboard/userprof"
          className={({ isActive }) =>
            `w-full h-full flex items-center justify-center p-2 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-dark text-white"
                : "text-blue-dark hover:bg-gray-300"
            }`
          }
        >
          <CgProfile />
        </NavLink>
      </div>
    </div>
  );
};

export const dashboardLoader = () => {
  const token = Cookie.get("token");
  return !!token;
};

export default Dashboard;
