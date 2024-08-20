/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
// import Button from "./Button";
import agreementSvg from "../../assets/pics/agreement2.svg";

import { animate, motion, transform } from "framer-motion";
import ScrollX from "../../Components/Alerts & animations/ScrollX";
import ScrollXMinus from "../../Components/Alerts & animations/ScrollXMinus";
import ScrollReveal from "../../Components/Alerts & animations/ScrollReveal";
import Buttonone from "../../Components/Buttons/Buttonone";
import Buttonborder from "../../Components/Buttons/Buttonborder";
import { getToken } from "../../utils/getToken";
import { Link } from "react-router-dom";
import { UserContext } from "../../store/UserContextProvider";
import { AccountType } from "../../utils/enum";

function Mainsection() {
  const { isLoggedIn } = getToken();
  const { userState } = useContext(UserContext);
  let navRoute;
  switch (userState.accountType) {
    case AccountType.Student:
      navRoute = "/student/home";
      break;
    case AccountType.Teacher:
      navRoute = "/teacher/dashboard";
      break;
    case AccountType.Admin:
      navRoute = "/admin/dashboard";
      break;

    default:
      break;
  }
  return (
    <>
      <div className="  md:flex justify-between h-full overflow-x-hidden">
        <div className="md:w-[50%] my-32 md:mt-0 left mx-2 ">
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
            {!isLoggedIn ? (
              <>
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
              </>
            ) : (
              <>
                <Link
                  to={navRoute}
                  className="underline text-2xl font-semibold text-blue-800"
                >
                  Go to{" "}
                  {userState.accountType === AccountType.Student
                    ? "Home Page"
                    : "Dashboard"}
                </Link>
              </>
            )}
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
