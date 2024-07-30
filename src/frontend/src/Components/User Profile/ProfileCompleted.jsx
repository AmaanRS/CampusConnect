/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import imgcom from "../../utils/pics/profilecompleted.svg";
import { useNavigate } from "react-router-dom";

const ProfileCompleted = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center mt-32 flex-col gap-10 m-3 text-center">
      <img src={imgcom} alt="" className="w-[45%]" />
      <h2 className="text-blue-light text-4xl sm:text-6xl font-bold">
        Profile Completed
      </h2>
      <h3 className="text-2xl text-blue-dark font-semibold text-center">
        Redirecting you to your Dashboard...
      </h3>
    </div>
  );
};

export default ProfileCompleted;
