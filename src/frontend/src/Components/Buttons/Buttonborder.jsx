/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { NavLink } from "react-router-dom";

function Buttonborder({ name, val, burger = false, togglebtn }) {
  return (
    <>
      {val === "login" ? (
        <NavLink
          className={`px-6 py-2 border border-blue-dark text-blue-dark rounded-lg font-semibold
  lg:text-xl lg:px-10 lg:py-3`}
          to="/login"
          onClick={burger ? togglebtn : "null"}
        >
          {name}
        </NavLink>
      ) : val === "signup" ? (
        <NavLink
          className={`px-6 py-2 border border-blue-dark text-blue-dark rounded-lg font-semibold
  lg:text-xl lg:px-10 lg:py-3`}
          to="/signup"
        >
          {name}
        </NavLink>
      ) : val === "Edit" ? (
        <NavLink
          className={`px-6 py-2 border border-blue-dark text-blue-dark rounded-lg font-semibold
  lg:text-xl lg:px-10 lg:py-3 hover:animate-shift-up active:animate-shift-down`}
          to="/editprof"
        >
          {name}
        </NavLink>
      ) : val === "createAcc" ? (
        <NavLink
          className={`px-6 py-2 border border-blue-dark text-blue-dark rounded-lg font-semibold
  lg:text-xl lg:px-10 lg:py-3`}
          to=""
        >
          {name}
        </NavLink>
      ) : (
        console.log("404 Error")
      )}
    </>
  );
}

export default Buttonborder;
