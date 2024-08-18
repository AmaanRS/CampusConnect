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

  return <div className="">Dashboard Page</div>;
};

export const dashboardLoader = () => {
  const token = Cookie.get("token");
  return !!token;
};

export default Dashboard;
