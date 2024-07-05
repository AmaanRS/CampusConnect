/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import imgTwo from "../utils/pics/alumni_network.svg";
import Subsections from "./Subsections";
import { motion } from "framer-motion";
import ScrollReveal from "../utils/ScrollReveal";
import ScrollXMinus from "../utils/ScrollXMinus";

function Sectioneven({ val }) {
  var dataOne = {
    name: "Alumni Network",
    para: "Stay connected with fellow alumni, share updates, and relive campus memories.",
  };

  var dataTwo = {
    name: "How Campus Connect Works",
  };
  return (
    <div className="flex items-center flex-col justify-center m-3 w-full bg-blue-light rounded-xl text-white shadow-xl">
      <ScrollXMinus>
        <motion.h1
          className={`ext-lg mt-4 font-bold sm:text-xl  md:text-2xl  ${
            val ? "sm:hidden" : "sm:block"
          }`}
        >
          {val ? dataOne.name : dataTwo.name}
        </motion.h1>
      </ScrollXMinus>
      <ScrollXMinus>
        <motion.div className="sm:flex justify-around items-center">
          <div className="my-10 mx-2 object-contain sm:w-1/3 md:w-2/3 lg:w-1/3 xl:w-2/6 h-auto">
            {val ? <img src={imgTwo} alt="" /> : null}
          </div>
          <div className="hidden sm:flex flex-col w-1/2 items-center sm:gap-3 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-10">
            <h1
              className={`w-full text-center text-lg mt-4 font-bold sm:text-xl  md:text-3xl ${
                val ? "" : "hidden"
              }`}
            >
              {val ? dataOne.name : dataTwo.name}
            </h1>
            <p
              className="text-center tracking-tighter text-sm m-2 font-medium px-2 sm:text-lg 
         md:text-xl
        "
            >
              {val ? dataOne.para : null}
            </p>
          </div>
          <p
            className="text-center tracking-tighter text-sm m-2 font-medium px-2 sm:text-lg 
        md:w-1/2 md:text-xl sm:hidden
        "
          >
            {val ? dataOne.para : null}
          </p>
        </motion.div>
      </ScrollXMinus>

      {val ? null : (
        <ScrollReveal>
          <motion.div className="mx-6 lg:flex gap-5 ">
            <Subsections val={1} />
            <Subsections val={2} />
            <Subsections val={3} />
          </motion.div>
        </ScrollReveal>
      )}
    </div>
  );
}

export default Sectioneven;
