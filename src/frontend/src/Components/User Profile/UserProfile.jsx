/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import Cookie from "js-cookie";
import TeachingStaffForm from "./TeachingStaffForm";
import { TbLogout2 } from "react-icons/tb";
import axiosInstance from "../Axios/AxiosInstance";
import StudentForm from "./StudentForm";
import { AuthContext } from "../Auth & Authorization/AuthContext";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { FcCollaboration } from "react-icons/fc";
import { PiStudentDuotone } from "react-icons/pi";
import { PiPlugsConnectedDuotone } from "react-icons/pi";
import ProfileCompleted from "./ProfileCompleted";

function UserProfile() {
  const { accType, profCompleted } = useContext(AuthContext);
  // console.log(accType);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Cookie.remove("token");
    localStorage.removeItem("userRole");
    return navigate("/login");
  };

  const token = Cookie.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // const [role, setRole] = useState(localStorage.getItem("userRole") || "");
  // const [position, setPosition] = useState("");

  // useEffect(() => {
  //   if (location.pathname === "/userprofile") {
  //     setRole("");
  //     localStorage.removeItem("userRole");
  //   }
  // }, [location.pathname]);

  // async function getProfileStatus() {
  //   const res = await axiosInstance.post("/getUserProfileStatus");
  //   console.log(res);
  //   let position = res.data.data.position.toString().toUpperCase();
  //   console.log(position);
  //   setPosition(position);
  // }

  // useEffect(() => {
  //   getProfileStatus();
  // });

  return (
    <div className="w-full flex flex-col items-center justify-center h-full md:h-screen bg-custom">
      <div className="absolute bottom-0 m-5 left-0 text-2xl z-10 cursor-pointer">
        <TbLogout2 color="#243DDE" onClick={handleLogout} />
      </div>
      {profCompleted === false ? (
        <div className="overflow-hidden md:rounded-3xl md:w-[95%] lg:w-[80%] w-full h-full md:h-[95%] bg-blue-extralight flex items-center justify-center md:shadow-3xl shadow-lg flex-col md:flex-row">
          <div
            className="left flex flex-col items-center justify-around m-6 p-2 md:m-0 md:w-1/2 h-full bg-custom bg-opacity-50
        rounded-xl md:rounded-none"
          >
            <h1 className="w-[95%] uppercase tracking-tight text-blue-dark text-xl lg:text-3xl lg:mt-5 font-bold text-center ">
              Why Complete Your Profile ?
            </h1>
            <div className="mt-10 md:w-[90%] h-full md:h-2/3 bg-red-5\0 p-10 flex flex-col gap-10 xl:gap-16 justify-center">
              <div className="flex gap-4 text-blue-dark">
                <span className="text-2xl lg:text-4xl flex">
                  <FcCollaboration />
                </span>
                <div className="font-semibold tracking-tight text-base xl:text-xl">
                  <p>
                    Collaborate on projects and initiatives that contribute to
                    the campus community.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 text-blue-dark">
                <span className="text-2xl lg:text-4xl flex">
                  <PiPlugsConnectedDuotone />
                </span>
                <div className="font-semibold tracking-tight text-base xl:text-xl">
                  <p>
                    Easily organize and participate in events on your campus.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 text-blue-dark">
                <span className="text-2xl lg:text-4xl flex">
                  <PiStudentDuotone />
                </span>
                <div className="font-semibold tracking-tight text-base xl:text-xl">
                  <p>
                    Be more visible to others in the community, increasing your
                    chances of collaboration and networking.
                  </p>
                </div>
              </div>
            </div>
            <h1 className="w-[90%] text-center font-medium text-blue-light tracking-tighter text-base">
              Fill out the form on the right to complete your profile and start
              exploring all the features Campus Connect has to offer !
            </h1>
          </div>
          <div className="right w-full md:w-1/2">
            {accType === "HOD" || accType === "TEACHER" ? (
              <TeachingStaffForm />
            ) : accType === "STUDENT" ? (
              <StudentForm />
            ) : (
              // alert("Hii")
              <h1 className="text-3xl text-center text-blue-dark font-medium">
                Loading...
              </h1>
            )}
          </div>
        </div>
      ) : (
        <ProfileCompleted />
      )}
    </div>
  );
}

export default UserProfile;
