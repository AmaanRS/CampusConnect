/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Button from "./Button";
import { RxCross2 } from "react-icons/rx";
import logo from "../utils/logo.png";
import Buttonone from "./Buttonone";
import Buttonborder from "./Buttonborder";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const togglebtn = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  console.log(isMenuOpen);
  return (
    <>
      {/* Humburger Menu Div */}
      <div
        className={`relative menuopen bg-blue-lightone h-screen flex flex-col items-center justify-center ${
          isMenuOpen === false ? "hidden" : "top-0"
        }  sm:hidden transition-all ease-out-expo`}
      >
        <div className="absolute right-0 top-0 p-3">
          <RxCross2 className="text-blue-dark text-2xl" onClick={togglebtn} />
        </div>
        <div className="links flex flex-col items-center justify-center gap-4 text-blue-dark font-semibold">
          <a href="#">About</a>
          <a href="#">Home</a>
          <a href="#">Contact</a>
        </div>
        <div className="buttons border-blue-dark mt-10 flex flex-col gap-4 ">
          <Buttonborder name={"Log In"} />
          <Buttonone name={"Sign Up"} />
        </div>
      </div>
      {/* Actual Navbar */}
      <nav
        className={`relative flex items-center justify-between px-4 py-2 bg-white border border-b-blue-light 
        ${isMenuOpen === false ? "" : "hidden"}
        sm:border-none sm:bg-transparent sm:text-sm md:mb-0
        `}
      >
        <div className="logo ">
          {/* <img src={logo} alt="" className="w-24 h-9" /> */}
          <h1 className="tracking-tighter text-lg font-semibold text-blue-dark">
            CampusConnect
          </h1>
        </div>
        <GiHamburgerMenu onClick={togglebtn} className="sm:hidden" />
        <div
          className=" hidden sm:flex gap-5 items-center text-blue-dark font-semibold md:text-lg md:gap-24
        lg:text-xl"
        >
          <div className="flex gap-5 items-center justify-center">
            <a href="#">About</a>
            <a href="#">Home</a>
            <a href="#">Contact</a>
          </div>

          <div
            className="button flex gap-5 items-center sm:hidden sm:text-lg md:flex justify-between
          lg:text-xl"
          >
            <a href="#">Login</a>
            <Buttonone name={"Sign Up"} />
          </div>
        </div>
      </nav>
    </>
  );
}

export default Nav;
