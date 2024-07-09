/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookie.remove("token");
    return navigate("login");
  };

  const token = Cookie.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <div className="m-10">
      <h1 className="mb-3">Hii User</h1>
      <NavLink
        className="mt- px-4 py-2 bg-white border border-blue-dark text-blue-light"
        onClick={handleLogout}
      >
        Log Out
      </NavLink>
    </div>
  );
}

export default Dashboard;
