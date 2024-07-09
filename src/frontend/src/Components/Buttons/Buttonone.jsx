/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { NavLink } from "react-router-dom";

function Buttonone({ name, val, burger = false, togglebtn }) {
  return (
    <>
      {val === "login" ? (
        <NavLink
          className={`px-8 py-2 bg-blue-dark text-white rounded-lg font-semibold 
  lg:text-xl lg:px-10 lg:py-3`}
          to="/login"
        >
          {name}
        </NavLink>
      ) : (
        <NavLink
          className={`px-8 py-2 bg-blue-dark text-white rounded-lg font-semibold 
  lg:text-xl lg:px-10 lg:py-3`}
          to="/signup"
          onClick={burger ? togglebtn : null}
        >
          {name}
        </NavLink>
      )}
    </>
  );
}

export default Buttonone;
