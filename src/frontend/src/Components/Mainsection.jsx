/* eslint-disable no-unused-vars */
import React from "react";
import Button from "./Button";
import agreementSvg from "../utils/agreement2.svg";
import Buttonone from "./Buttonone";
import Buttonborder from "./Buttonborder";

function Mainsection() {
  return (
    <>
      <div className="  md:flex justify-between h-screen">
        <div className="md:w-[50%] mt-32 md:mt-0 left mx-2">
          <div
            className=" left heading text-center  text-blue-dark font-bold text-5xl 
          sm:mt-44 sm:text-7xl 
          lg:text-8xl 2xl:text-9xl"
          >
            <h1 className="pr-10 md:pr-16">Campus</h1>
            <h1 className="pl-8">Connect</h1>
            <h3 className="text-blue-light text-sm font-semibold pl-20 pt-1 sm:text-xl lg:pl-56 2xl:text-3xl">
              A Platform to Reunite.
            </h3>
          </div>
          <div className="buttons flex items-center justify-center gap-5 mt-20">
            <Buttonone name={"Log In"} textlg={"3xl"} />
            <Buttonborder name={"Sign Up"} />
          </div>
        </div>
        <div className="relative hidden md:flex items-center justify-center w-[40%] mr-10">
          <img
            src={agreementSvg}
            alt=""
            className=" text-center absolute top-44 2xl:top-28"
          />
        </div>
      </div>
    </>
  );
}

export default Mainsection;
