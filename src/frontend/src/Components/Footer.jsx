/* eslint-disable no-unused-vars */
import React from "react";
import { FaLinkedin } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import ScrollReveal from "../utils/ScrollReveal";
import ScrollXMinus from "../utils/ScrollXMinus";
import ScrollX from "../utils/ScrollX";

function Footer() {
  return (
    <div className="flex items-center flex-col sm:flex-row sm:gap-10 lg:gap-40 sm:justify-around justify-center mx-5 bg-blue-dark rounded-xl text-white shadow-xl mb-5 md:py-10 overflow-hidden">
      <ScrollXMinus>
        <motion.div className="heading font-semibold text-2xl my-3 md:text-3xl lg:text-4xl xl:text-6xl">
          <h1 className="pr-6 md:pr-10 lg:pr-0 tracking-tighter">Campus</h1>
          <h1 className="pl-4 lg:pr-2 tracking-tighter">Connect.</h1>
        </motion.div>
      </ScrollXMinus>
      <ScrollReveal>
        <motion.div className="text-center socials sm:my-5 xl:flex items-center justify-center xl:gap-10">
          <p className="text-sm py-3 font-semibold lg:text-xl">Socials</p>
          <div className="flex gap-5 items-center justify-center">
            <FaLinkedin size={"30px"} /> <BsInstagram size={"30px"} />{" "}
            <FaGithub size={"30px"} />
          </div>
        </motion.div>
      </ScrollReveal>

      <ScrollX>
        <motion.div className="links flex text-sm flex-col my-5 items-center sm:gap-3 font-medium">
          <a href="#">Privacy & Policy</a>
          <a href="#">FAQ</a>
        </motion.div>
      </ScrollX>
    </div>
  );
}

export default Footer;
