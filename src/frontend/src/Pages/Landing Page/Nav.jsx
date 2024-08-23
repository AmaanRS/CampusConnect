/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import { RxCross2 } from "react-icons/rx";

import { animate, motion } from "framer-motion";
import { NavLink, Route, Routes } from "react-router-dom";
import Buttonborder from "../../Components/Buttons/Buttonborder";
import Buttonone from "../../Components/Buttons/Buttonone";
import { getToken } from "../../utils/getToken";
import { UserContext } from "../../store/UserContextProvider";
import { AccountType } from "../../utils/enum";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn } = getToken();
  const { userState, logOutUser } = useContext(UserContext);

  let navTitle;
  let navRoute;
  switch (userState.accountType) {
    case AccountType.Admin:
      navTitle = "Dashboard";
      navRoute = "/dashboard";
      break;
    case AccountType.Teacher:
      navTitle = "Dashboard";
      navRoute = "/dashboard";
      break;
    case AccountType.Student:
      navTitle = "Home";
      navRoute = "/dashboard";
      break;

    default:
      break;
  }

  const togglebtn = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      {/* Humburger Menu Div */}
      <motion.div
        className={`relative menuopen bg-blue-lightone h-screen flex flex-col items-center justify-center ${
          isMenuOpen === false ? "hidden" : "top-0 "
        }  sm:hidden transition-all ease-out-expo duration-500 `}
      >
        <div className="absolute right-0 top-0 p-3">
          <RxCross2 className="text-blue-dark text-2xl" onClick={togglebtn} />
        </div>
        <div className="links flex flex-col items-center justify-center gap-4 text-blue-dark font-semibold">
          <NavLink to="/about" onClick={togglebtn}>
            About
          </NavLink>
          {/* <NavLink to="/" onClick={togglebtn}>
            Home
          </NavLink> */}
          <NavLink to="/contact" onClick={togglebtn}>
            Contact
          </NavLink>
          {isLoggedIn && (
            <NavLink to={navRoute} onClick={togglebtn}>
              {" "}
              {navTitle}{" "}
            </NavLink>
          )}
        </div>
        {!isLoggedIn && (
          <div className="text-center buttons border-blue-dark mt-10 flex flex-col gap-4 ">
            <Buttonborder
              name={"Log In"}
              burger={true}
              togglebtn={togglebtn}
              val={"login"}
            />
            <Buttonone name={"Sign Up"} burger={true} togglebtn={togglebtn} />
          </div>
        )}
        {isLoggedIn && (
          <>
            <button
              className={`px-8 mt-4 py-2 bg-blue-dark text-white rounded-lg font-semibold 
  lg:text-xl lg:px-10 lg:py-3`}
              onClick={() => logOutUser()}
            >
              Logout
            </button>
          </>
        )}
      </motion.div>
      {/* Actual Navbar */}
      <motion.nav
        className={`md:my-4 relative flex items-center justify-between px-4 py-2 bg-white border border-b-blue-light 
        ${isMenuOpen === false ? "" : "hidden"}
        sm:border-none sm:bg-transparent sm:text-sm md:mb-0
        `}
        transition={{ duration: 0.8, ease: [0.12, 0, 0.39, 0] }}
        animate={{ y: 0 }}
        initial={{ y: -100 }}
      >
        <div className="logo ">
          {/* <img src={logo} alt="" className="w-24 h-9" /> */}
          <h1 className="tracking-tighter text-lg font-semibold text-blue-dark">
            Campus<span className="text-blue-light">Connect</span>
          </h1>
        </div>
        <GiHamburgerMenu onClick={togglebtn} className="sm:hidden" />
        <div
          className=" hidden sm:flex gap-5 items-center text-blue-dark font-semibold md:text-lg md:gap-24
        lg:text-xl"
        >
          <div className="flex gap-5 items-center justify-center">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            {isLoggedIn && <NavLink to={navRoute}>{navTitle}</NavLink>}
          </div>

          <div
            className="button flex gap-5 items-center sm:hidden sm:text-lg md:flex justify-between
          lg:text-xl"
          >
            {!isLoggedIn && (
              <>
                <NavLink to="/login">Login</NavLink>
                <motion.div className="transition transform hover:animate-shift-up active:animate-shift-down">
                  <Buttonone name={"Sign Up"} val={"signup"} />
                </motion.div>
              </>
            )}
            {isLoggedIn && (
              <>
                <button
                  className={`px-8 py-2 bg-blue-dark text-white rounded-lg font-semibold 
  lg:text-xl lg:px-10 lg:py-3`}
                  onClick={() => logOutUser()}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </motion.nav>
    </>
  );
}

export default Nav;
