/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import connectImg from "../utils/pics/about.svg";
import imgOne from "../utils/pics/about.svg";
import imgTwo from "../utils/pics/eventmanagement.svg";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ScrollReveal from "../utils/ScrollReveal";
import ScrollX from "../utils/ScrollX";

function Sectionodd({ val }) {
  var dataOne = {
    name: "About Campus Connect",
    img: imgOne,
    para: "Our platform enables seamless event organization and committee formation to enhance campus engagement and networking.",
  };

  var dataTwo = {
    name: "Event Management",
    img: imgTwo,
    para: "Plan, organize, and participate in campus events effortlessly with our user-friendly tools.Create event pages and share event highlights",
  };
  return (
    <div className="mt-20 flex items-center flex-col justify-center m-3 w-full text-blue-dark rounded-xl bg-white shadow-xl">
      <ScrollX>
        <motion.h1 className="text-lg mt-4 font-bold sm:text-xl  md:text-2xl sm:hidden">
          {val ? dataOne.name : dataTwo.name}
        </motion.h1>
      </ScrollX>

      <ScrollX>
        <motion.div className="sm:flex flex-row-reverse justify-around items-center md:gap-3 ">
          <motion.div className="my-10 mx-2 object-contain sm:w-1/3 md:w-2/3 lg:w-1/3 xl:w-2/6 h-auto">
            {val ? <img src={imgOne} alt="" /> : <img src={imgTwo} alt="" />}
          </motion.div>

          <div className="hidden sm:flex flex-col w-1/2 items-center sm:gap-3 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-10">
            <h1 className="w-full text-center text-lg mt-4 font-bold sm:text-xl  md:text-3xl hidden sm:block">
              {val ? dataOne.name : dataTwo.name}
            </h1>
            <p
              className="text-center tracking-tighter text-sm m-2 font-medium px-2 sm:text-lg 
         md:text-xl
        "
            >
              {val ? dataOne.para : dataTwo.para}
            </p>
          </div>
          <p
            className="text-center tracking-tighter text-sm m-2 font-medium px-2 sm:text-lg 
        md:w-1/2 md:text-xl sm:hidden
        "
          >
            {val ? dataOne.para : dataTwo.para}
          </p>
        </motion.div>
      </ScrollX>
    </div>
  );
}

export default Sectionodd;
