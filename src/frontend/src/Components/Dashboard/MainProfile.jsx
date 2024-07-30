/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { AuthContext } from "../Auth & Authorization/AuthContext";
import { FaPlus } from "react-icons/fa6";
import Buttonborder from "../Buttons/Buttonborder";
import Cookie from "js-cookie";

import { RiShareForwardLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";

const MainProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookie.remove("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    return navigate("/login");
  };
  return (
    <div className="w-full h-full bg-blue-extralight flex flex-col md:flex-row md:mt-16 ">
      <div className="wrapper flex mx-auto mt-5 lg:mt-10 flex-col items-center gap-5 w-full ">
        <div className="relative prof_photo w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] bg-blue-lightone rounded-full">
          <span className="w-5 h-5 sm:w-7 sm:h-7 bg-blue-dark rounded-full absolute bottom-2 sm:right-3 right-2 flex items-center justify-center text-white cursor-pointer">
            <FaPlus />
          </span>
        </div>
        <div className="md:mt-6">
          <Buttonborder val={"Edit"} name={"Edit Profile"} />
          <div className="options text-2xl flex items-center justify-center gap-5 mt-6 ">
            <div
              onClick={handleLogout}
              className="flex items-center justify-center p-2 transition-colors cursor-pointer
              w-10 h-10 bg-blue-dark text-white rounded-full"
            >
              <TbLogout2 />
            </div>
            <div
              className="flex items-center justify-center p-2 transition-colors cursor-pointer
              w-10 h-10 bg-blue-dark text-white rounded-full"
            >
              <RiShareForwardLine />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 md:mt-10 text-center mx-auto flex flex-col items-center justify-center md:justify-normal md:items-start w-full">
        <div className="headings md:text-left">
          <h1 className="text-3xl font-bold text-blue-dark md:text-5xl">
            User Name
          </h1>
          <h4 className="text-sm md:text-xl font-medium text-blue-light my-2">
            {user?.email}
          </h4>
        </div>
        <div className="details mt-5 flex flex-col gap-3 md:text-left">
          <h4>
            {user?.department ? (
              <span className="text-blue-dark">
                Department:{" "}
                <span className="bg-blue-light py-1 px-4 rounded-md text-blue-dark font-bold bg-opacity-70  ml-4">
                  {user.department}
                </span>
              </span>
            ) : null}
          </h4>
          <h4>
            {user?.year ? (
              <span className="text-blue-dark">
                Year:{" "}
                <span className="bg-blue-light py-1 px-4 rounded-md text-blue-dark font-bold bg-opacity-70 ml-4">
                  {user.year}
                </span>
              </span>
            ) : null}
          </h4>
          <h4>
            {user?.position || user?.year ? (
              <span className="text-blue-dark">
                Position:{" "}
                <span className="bg-blue-light py-1 px-4 rounded-md text-blue-dark font-bold bg-opacity-70 ml-4">
                  {user.position || "Student"}
                </span>
              </span>
            ) : null}
          </h4>
          <h4>
            {user?.studentid ? (
              <span className="text-blue-dark">
                Student ID:{" "}
                <span className="bg-blue-light py-1 px-4 rounded-md text-blue-dark font-bold bg-opacity-70 ml-4">
                  {user.studentid}
                </span>
              </span>
            ) : null}
          </h4>
          <h4></h4>
        </div>
      </div>
    </div>
  );
};

export default MainProfile;
