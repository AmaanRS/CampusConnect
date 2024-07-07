/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from "react";
import ImgOne from "../utils/pics/undraw_fingerprint_login_re_t71l.svg";
import ImgTwo from "../utils/pics/connect.svg";
import ImgThree from "../utils/pics/participate.svg";
import { animate, motion } from "framer-motion";

var dataOne = {
  head: "Step 1: Sign Up",
  img: ImgOne,
  para: "Create an account to join the Campus Connect community. Whether you're a student or alumni, signing up is quick and easy.",
};
var dataTwo = {
  head: "Step 2: Connect",
  img: ImgTwo,
  para: "Build your network by connecting with fellow students and alumni. Engage in meaningful conversations and stay in touch.",
};
var dataThree = {
  head: "Step 3: Participate",
  img: ImgThree,
  para: "Join events, participate in committees, and contribute to the campus community. Campus Connect makes it simple to get involved.",
};

// eslint-disable-next-line react/prop-types
function Subsections({ val }) {
  return (
    <motion.div className="flex text-center flex-col items-center justify-center bg-white text-blue-dark rounded-3xl mb-5 lg:w-1/2">
      <h1 className="font-bold text-lg m-2 sm:text-xl md:text-2xl">
        {val === 1
          ? dataOne.head
          : val === 2
          ? dataTwo.head
          : val === 3
          ? dataThree.head
          : null}
      </h1>
      <img
        src={
          val === 1
            ? dataOne.img
            : val === 2
            ? dataTwo.img
            : val === 3
            ? dataThree.img
            : null
        }
        alt=""
        className="object-cover w-5/6 m-2 my-10 mx-2 sm:w-1/3 md:w-1/3 lg:w-2/3 xl:w-3/6 h-auto"
      />
      <p
        className="tracking-tighter text-sm m-3 font-medium sm:text-lg lg:mt-4
      md:text-xl"
      >
        {val === 1
          ? dataOne.para
          : val === 2
          ? dataTwo.para
          : val === 3
          ? dataThree.para
          : null}
      </p>
    </motion.div>
  );
}

export default Subsections;
