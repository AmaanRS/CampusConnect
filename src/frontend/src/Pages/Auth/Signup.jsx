/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { NavLink, useLoaderData, useNavigate } from "react-router-dom";
import signupImg from "../../assets/pics/signupwhite.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/Axios/AxiosInstance";
import AccCreated from "../../Components/Alerts & animations/AccCreated";
import CustomAlert from "../../Components/Alerts & animations/Alert";
import ErrorPage from "../../Components/Alerts & animations/ErrorPage";
import { getToken } from "../../utils/getToken";
import PasswordInput from "../../Components/Inputs/PasswordInput";

// schema
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
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/,
      "Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 8 to 10 characters long"
    ),
  // /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ high complexity Password must be at least 8 characters long, include letters, numbers, and special characters
});

function Signup() {
  const { isLoggedIn } = getToken();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn]);

  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, register, formState, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const formSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/user/signup", {
        email: data.email,
        password: data.password,
      });

      res.data.success
        ? (setShowPopup(true),
          setTimeout(() => {
            setShowPopup(false);
            navigate("/login");
          }, 2000))
        : (setAlertMessage("Email Already Exists !"),
          setIsAlertOpen(true),
          navigate("/signup"),
          setShowPopup(false));

      reset();
      console.log(res);
      console.log(res.data.success);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      let errorMsg = "An error occurred";
      if (error.response) {
        errorMsg =
          error.response.data?.message ||
          error.message ||
          errorMsg ||
          error.response.message;
      } else {
        errorMsg = error.message || errorMsg;
      }
      // setErrorMessage(errorMsg);
      // setIsError(true);
      setIsLoading(false);
      setIsAlertOpen(true);
      setAlertMessage(errorMsg);
      console.log(errorMsg, "Inside Catch");
    } finally {
      // reset();
    }

    // pop up
    setTimeout(() => {
      setShowPopup(false);
    }, 2000),
      reset();
  };

  return (
    <div className="relative bg-blue-lightone w-full h-screen flex items-center justify-center text-blue-dark">
      <CustomAlert
        isOpen={isAlertOpen}
        onRequestClose={() => setIsAlertOpen(false)}
        message={alertMessage}
      />
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
          <PasswordInput register={register} name={"password"} />

          <span className="text-red-500 text-sm mt-1 lg:mt-2">
            {formState.errors.password?.message}
          </span>
          <div className="btn flex flex-col items-center justify-center mt-12 ">
            <motion.button
              disabled={isLoading}
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              transition={{ ease: [0.12, 0, 0.39, 0], duration: 0.4 }}
              className={`px-10 py-2 border rounded-lg font-semibold lg:text-xl lg:px-10 lg:py-3
                ${
                  isLoading
                    ? "border-blue-lightone text-blue-light cursor-not-allowed"
                    : "border-blue-dark text-blue-dark hover:animate-shift-up active:animate-shift-down"
                }`}
            >
              Creat{isLoading ? "ing" : "e"} Account
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
