/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/Axios/AxiosInstance";
import { UserContext } from "../../store/UserContextProvider";
import { useMutation } from "@tanstack/react-query";
import { Department } from "../../utils/enum";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const schema = yup.object({
  year: yup
    .number()
    .typeError("Year must be a number")
    .required("Year is required")
    .min(1, "Year must be at least 1")
    .max(4, "Year must be at most 4"),
});

const StudentForm = () => {
  const navigate = useNavigate();
  const { setUserState, userState, logOutUser } = useContext(UserContext);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ department, year }) => {
      return axiosInstance.post("/student/createStudent", { department, year });
    },

    onSuccess: (data) => {
      const decodedToken = jwtDecode(data.data.token);
      Cookies.set("token", data.data.token);
      setUserState(decodedToken);
      navigate("/student");
    },

    onError: (error) => console.log("an error occured", error),
  });

  const { handleSubmit, register, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const formSubmit = async (dataObj) => {
    const { year, department } = dataObj;
    mutate({ year, department });
  };

  // console.log(data, error);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full overflow-y-hidden">
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
          value={userState.email || ""}
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
          min={1}
          max={4}
          id="year"
          className="rounded-md px-3  py-1 md:py-2 border-[1px] border-blue-dark xl:text-xl text-blue-light focus:border-red-600"
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
          <option value={Department.IT} className="p-3">
            IT (Information Technology)
          </option>
          <option value={Department.COMS} className="p-3">
            COMS (Computer Science)
          </option>
          <option value={Department.AIDS} className="p-3">
            AIDS (Artificial Intelligence & Data Science)
          </option>
        </select>

        <div className="btn flex gap-4 items-center justify-center mt-12">
          <NavLink
            onClick={() => logOutUser()}
            className="px-10 py-2 border border-blue-dark text-blue-dark rounded-lg font-semibold
            lg:text-xl lg:px-10 lg:py-3 hover:animate-shift-up active:animate-shift-down"
          >
            Back
          </NavLink>
          <button
            disabled={isPending}
            className={`px-10 py-2 border rounded-lg font-semibold lg:text-xl lg:px-10 lg:py-3
              ${
                isPending
                  ? "border-blue-lightone text-blue-light cursor-not-allowed"
                  : "border-blue-dark text-blue-dark hover:animate-shift-up active:animate-shift-down"
              }`}
          >
            {isPending ? "Confirming" : "Confirm"}
          </button>
        </div>
      </form>
      {isError && <p className="text-red-600">{error.message}</p>}
    </div>
  );
};

export default StudentForm;
