/* eslint-disable no-unused-vars */
import React from "react";
// import Button from "./Button";
import agreementSvg from "../utils/pics/agreement2.svg";
import Buttonone from "./Buttonone";
import Buttonborder from "./Buttonborder";
import { animate, motion, transform } from "framer-motion";
import ScrollX from "../utils/ScrollX";
import ScrollXMinus from "../utils/ScrollXMinus";
import ScrollReveal from "../utils/ScrollReveal";

function Mainsection() {
  return (
    <>
      <div className="  md:flex justify-between h-full overflow-x-hidden">
        <div className="md:w-[50%] my-32 md:mt-0 left mx-2">
          <motion.div
            className=" left heading text-center  text-blue-dark font-bold text-5xl 
          sm:mt-44 sm:text-7xl 
          lg:text-8xl 2xl:text-9xl"
          >
            <ScrollXMinus>
              <motion.h1 className="pr-10 md:pr-16 tracking-tighter">
                Campus
              </motion.h1>
            </ScrollXMinus>
            <ScrollX>
              <motion.h1 className="pl-8 tracking-tighter text-blue-medium">
                Connect
              </motion.h1>
            </ScrollX>
            <ScrollReveal>
              <motion.h3 className="text-blue-lightone text-sm font-semibold pl-20 pt-1 sm:text-xl lg:pl-56 2xl:text-3xl tracking-tight">
                A Platform to Reunite.
              </motion.h3>
            </ScrollReveal>
          </motion.div>
          <div className="buttons flex items-center justify-center gap-5 mt-20">
            <ScrollXMinus>
              <motion.div
                className="transition transform
                         hover:animate-shift-up active:animate-shift-down"
              >
                <Buttonone name={"Log In"} val={"login"} />
              </motion.div>
            </ScrollXMinus>
            <ScrollX>
              <motion.div
                className="transition transform
                         hover:animate-shift-up active:animate-shift-down"
              >
                <Buttonborder name={"Sign Up"} val={"signup"} />
              </motion.div>
            </ScrollX>
          </div>
        </div>
        <div className="relative hidden md:flex items-center justify-center w-[40%] mr-10 overflow-x-hidden">
          <motion.img
            src={agreementSvg}
            alt=""
            className=" text-center absolute top-44 2xl:top-28"
            initial={{ x: 300 }}
            animate={{ x: 0 }}
          />
        </div>
      </div>
    </>
  );
}

export default Mainsection;
