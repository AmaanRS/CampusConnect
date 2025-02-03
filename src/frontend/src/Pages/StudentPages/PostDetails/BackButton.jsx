import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <div className="mr-2  h-8 w-8 rounded-full flex items-center justify-center bg-slate-200 hover:bg-slate-300  transition-colors duration-200 cursor-pointer">
      <IoIosArrowRoundBack
        onClick={() => navigate(-1)}
        className=" text-3xl text-slate-700 hover:text-slate-800"
      />
    </div>
  );
}
