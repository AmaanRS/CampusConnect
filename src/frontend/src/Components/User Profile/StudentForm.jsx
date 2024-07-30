/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth & Authorization/AuthContext";

const schema = yup.object({
  year: yup
    .number()
    .typeError("Year must be a number")
    .required("Year is required")
    .min(1, "Year must be at least 1")
    .max(4, "Year must be at most 4"),
  studentid: yup
    .number()
    .typeError("Student ID must be a number")
    .required("Student ID is a required field.")
    .min(100000000, "Student ID must be at least 100000000")
    .max(999999999, "Student ID must be at most 999999999"),
});

const StudentForm = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { handleSubmit, register, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const formSubmit = (data) => {
    console.log(data);
    navigate("/userprofile/profilecompleted");
    const userData = {
      email: data.email,
      year: data.year,
      studentid: data.studentid,
      department: data.department,
    };
    setUser(userData);
  };

  return (
    <div className="mt-14 flex flex-col items-center justify-center w-full h-full overflow-y-hidden">
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
          value={user?.email || ""}
          readOnly
          className="rounded-md px-3 py-1 md:py-2 border-[1px] border-blue-dark xl:text-xl text-blue-light"
          {...register("email")}
        />
        <span className="text-red-500 text-xs md:text-sm mt-1 lg:mt-2"></span>

        {/* Year Input */}
        <label
          htmlFor="year"
          className="my-2 lg:my-3 font-medium text-blue-light text-lg xl:text-xl"
        >
          Year
        </label>
        <input
          type="number"
          name="year"
          id="year"
          className="rounded-md px-3 py-1 md:py-2 border-[1px] border-blue-dark xl:text-xl text-blue-light focus:border-red-600"
          placeholder="Enter Year Eg: 1 for 1st Year"
          {...register("year")}
        />
        <span className="text-red-500 text-xs md:text-sm mt-1 lg:mt-2">
          {formState.errors.year?.message}
        </span>

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

        {/* Student ID Input */}
        <label
          htmlFor="studentid"
          className="my-2 lg:my-5 font-medium text-blue-light text-lg xl:text-xl"
        >
          Student ID
        </label>
        <input
          type="number"
          name="studentid"
          id="studentid"
          className="rounded-md px-3 py-1 md:py-2 border-[1px] border-blue-dark xl:text-xl text-blue-light focus:border-red-600"
          placeholder="Enter Student ID"
          {...register("studentid")}
        />
        <span className="text-red-500 text-xs md:text-sm mt-1 lg:mt-2">
          {formState.errors.studentid?.message}
        </span>

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
