/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import Cookie from "js-cookie";
import ProgressBar from "./ProgressBar";
import { PiChalkboardTeacherBold, PiStudentBold } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";

function UserProfile() {
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

  const [role, setRole] = useState(localStorage.getItem("userRole") || "");

  useEffect(() => {
    if (location.pathname === "/userprofile") {
      setRole("");
      localStorage.removeItem("userRole");
    }
  }, [location.pathname]);

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem("userRole", selectedRole);
    navigate(
      `/userprofile/${
        selectedRole === "student"
          ? "sform"
          : selectedRole === "teaching"
          ? "tform"
          : "ntform"
      }`
    );
  };

  const getCurrentStep = (pathname) => {
    if (
      pathname.includes("sform") ||
      pathname.includes("tform") ||
      pathname.includes("ntform")
    ) {
      return 2;
    } else if (pathname.includes("profilecompleted")) {
      return 3;
    } else {
      return 1;
    }
  };
  const currentStep = getCurrentStep(location.pathname);

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen">
      <div className="absolute bottom-0 m-5 left-0 text-2xl z-10 cursor-pointer">
        <TbLogout2 color="#243DDE" onClick={handleLogout} />
      </div>
      <div className="absolute top-1 md:top-4 bg-white p-4 sm:p-3 rounded-xl shadow-md w-full sm:w-[70%]">
        <ProgressBar currentStep={currentStep} totalSteps={3} />
        <div className="mt-4"></div>
      </div>

      {!role && (
        <div className="mt-20 flex items-center flex-col justify-center text-center">
          <h1 className="my-10 text-blue-medium md:text-xl font-semibold text-center m-3">
            Select a role to proceed with setting up your profile.
          </h1>

          <NavLink
            className="bg-blue-light text-blue-extralight font-semibold flex items-center justify-center px-16 p-2 py-3 m-4 rounded-lg w-2/3 text-center hover:bg-blue-dark transition-colors"
            to="#"
            onClick={() => handleRoleSelection("student")}
          >
            <h2 className="text-sm md:text-xl flex items-center justify-center gap-4">
              <PiStudentBold /> <span>Student</span>
            </h2>
          </NavLink>

          <NavLink
            to="#"
            className="bg-blue-light text-blue-extralight font-semibold flex items-center justify-center p-2 py-3 m-4 rounded-lg w-2/3 text-center hover:bg-blue-dark transition-colors"
            onClick={() => handleRoleSelection("teaching")}
          >
            <h2 className="text-sm md:text-xl flex items-center justify-center gap-4">
              <FaChalkboardTeacher /> <span>Teaching Staff</span>
            </h2>
          </NavLink>

          <NavLink
            to="#"
            className="bg-blue-light text-blue-extralight font-semibold flex items-center justify-center p-2 py-3 m-4 rounded-lg w-2/3 text-center hover:bg-blue-dark transition-colors"
            onClick={() => handleRoleSelection("non-teaching")}
          >
            <h2 className="text-sm md:text-xl flex items-center justify-center gap-4">
              <PiChalkboardTeacherBold /> <span>Non-Teaching Staff</span>
            </h2>
          </NavLink>
        </div>
      )}

      <div className="">{role && <Outlet />}</div>
    </div>
  );
}

export default UserProfile;
