/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth & Authorization/AuthContext";
const schema = yup.object({});

const StudentForm = () => {
  const navigate = useNavigate();
  const { handleSubmit, register, formState } = useForm({
    // resolver: yupResolver(schema),
  });

  const formSubmit = (data) => {
    console.log(data);
    navigate("/userprofile/profilecompleted");
    const userData = {
      email: data.email,
      department: data.department,
      position: data.position,
    };
    setUser(userData);
  };
  const { user, setUser } = useContext(AuthContext);
  return (
    <div className="mt-14 flex flex-col items-center justify-center w-full h-full overflow-y-hidden sm:overflow-y-auto">
      <form
        className="p-5 flex flex-col justify-center w-full max-w-lg"
        onSubmit={handleSubmit(formSubmit)}
      >
        {/* Email Input */}
        <label
          htmlFor="email"
          className="my-2 lg:my-3 font-medium text-blue-light text-lg xl:text-xl"
        >
          Email
        </label>
        <input
          type="text"
          name="email"
          id="email"
          value={user?.email}
          readOnly
          className="rounded-md px-3 py-1 md:py-2 border-[1px] border-blue-dark xl:text-xl text-blue-light"
          placeholder="Enter Email"
          {...register("email")}
        />
        <span className="text-red-500 text-xs md:text-sm mt-1 lg:mt-2"></span>

        {/* Department Input */}
        <label
          htmlFor="department"
          className="my-2 lg:my-3 font-medium text-blue-light text-lg xl:text-xl"
        >
          Department
        </label>
        <select
          name="department"
          {...register("department")}
          id="department"
          className="xl:text-xl text-blue-dark custom-select border border-blue-dark rounded-md mt-1 block w-full pl-3 pr-10 py-1 md:py-3 text-base"
        >
          <option value="IT" className="p-3">
            IT (Information Technology)
          </option>
          <option value="COMS" className="p-3">
            COMS (Computer Science)
          </option>
          <option value="AIDS" className="p-3">
            AIDS (Artificial Intelligence & Data Science)
          </option>
        </select>

        {/* Position Input */}
        <label
          htmlFor="position"
          className="my-2 lg:my-3 font-medium text-blue-light text-lg xl:text-xl"
        >
          Position
        </label>
        <select
          name="position"
          {...register("position")}
          id="position"
          className="xl:text-xl text-blue-dark custom-select border border-blue-dark rounded-md mt-1 block w-full pl-3 pr-10 py-1 md:py-3 text-base"
        >
          <option value="PROFESSOR" className="p-3">
            PROFESSOR
          </option>
          <option value="ASSISTANT_PROFESSOR" className="p-3">
            ASSISTANT_PROFESSOR
          </option>
          <option value="HOD" className="p-3">
            HOD
          </option>
        </select>

        <div className="btn flex gap-4 items-center justify-center mt-12">
          <NavLink
            to="/userprofile"
            className="px-10 py-2 border border-blue-dark text-blue-dark rounded-lg font-semibold
            lg:text-xl lg:px-10 lg:py-3 hover:animate-shift-up active:animate-shift-down"
          >
            Back
          </NavLink>
          <button
            className="px-10 py-2 border border-blue-dark text-blue-dark rounded-lg font-semibold
            lg:text-xl lg:px-10 lg:py-3 hover:animate-shift-up active:animate-shift-down"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
