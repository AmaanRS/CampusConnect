/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import signupImg from "../utils/pics/signupwhite.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import AccCreated from "../utils/AccCreated";

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email is invalid"
    ),
  password: yup
    .string()
    .required("Password is required")
    .matches(/^.{8,}$/, "Password must be at least 8 characters long"),
  // /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ high complexity Password must be at least 8 characters long, include letters, numbers, and special characters
});

function Signup() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const { handleSubmit, register, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const formSubmit = (data) => {
    reset();
    const { email, password } = data;
    // variables set for accessing the input
    const setEmailData = email;
    const setPasswordData = password;

    // pop up
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="relative bg-blue-lightone w-full h-screen flex items-center justify-center text-blue-dark">
      <div className="absolute top-2 text-2xl left-0 p-3 md:text-4xl">
        <FaArrowCircleLeft onClick={() => navigate("/")} />
      </div>

      <div className="bg-white rounded-2xl mx-5 h-[80vh] w-full sm:w-[60vw] md:w-full lg:w-[80%] xl:w-2/3 overflow-hidden shadow-xl md:flex 2xl:w-[80%]">
        {/* Img Div  */}
        <div className="hidden md:flex w-[40%] lg:w-1/2 justify-center bg-blue-light">
          <motion.img
            src={signupImg}
            alt=""
            className="w-[80%] lg:w-2/3 xl:w-1/2"
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            transition={{ ease: [0.12, 0, 0.39, 0], duration: 0.4 }}
          />
        </div>
        {/* Form Div */}
        <form
          className=" p-5 flex flex-col justify-center h-full md:w-[60%] lg:w-1/2"
          onSubmit={handleSubmit(formSubmit)}
        >
          <motion.h1
            className="text-4xl font-semibold mb-4 xl:text-5xl text-center"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            transition={{ ease: [0.12, 0, 0.39, 0], duration: 0.4 }}
          >
            Sign up
          </motion.h1>
          <motion.label
            htmlFor="email"
            className="my-2 lg:my-3 font-medium text-blue-light text-lg xl:text-xl"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            transition={{ ease: [0.12, 0, 0.39, 0], duration: 0.4 }}
          >
            Email
          </motion.label>
          <input
            type="text"
            name="email"
            id="email"
            className="rounded-md px-3 py-1 md:py-2 border-[1px] border-blue-dark xl:text-xl"
            placeholder="Enter Email"
            {...register("email")}
          />
          <span className="text-red-500 text-sm mt-1 lg:mt-2">
            {formState.errors.email?.message}
          </span>
          <motion.label
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            transition={{ ease: [0.12, 0, 0.39, 0], duration: 0.4 }}
            htmlFor="password"
            className="my-2 lg:my-3 font-medium text-blue-light text-lg xl:text-xl"
          >
            Password
          </motion.label>
          <input
            type="password"
            name="password"
            id="password"
            className="rounded-md px-3 py-1 md:py-2 border-[1px] border-blue-dark xl:text-xl"
            placeholder="Enter Password"
            {...register("password")}
          />
          <span className="text-red-500 text-sm mt-1 lg:mt-2">
            {formState.errors.password?.message}
          </span>
          <div className="btn flex flex-col items-center justify-center mt-12 ">
            <motion.button
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              transition={{ ease: [0.12, 0, 0.39, 0], duration: 0.4 }}
              className="px-10 py-2 border border-blue-dark text-blue-dark rounded-lg font-semibold
  lg:text-xl lg:px-10 lg:py-3 hover:animate-shift-up active:animate-shift-down"
            >
              Create Account
            </motion.button>
            <NavLink
              className="underline tracking-tighter text-sm lg:text-base my-4 text-blue-light"
              to="/login"
            >
              Already have an Account ?
            </NavLink>
          </div>
        </form>
      </div>

      {showPopup && <AccCreated />}
    </div>
  );
}

export default Signup;
