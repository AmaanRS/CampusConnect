/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../store/UserContextProvider";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../utils/Axios/AxiosInstance";
import { Department } from "../../utils/enum";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const schema = yup.object({});
const TeachingStaffForm = () => {
  const navigate = useNavigate();
  const { setUserState } = useContext(UserContext);
  // const { user, setUser, profCompleted, setProfCompleted } =
  //   useContext(AuthContext);
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ department }) => {
      return axiosInstance.post("/teacher/createTeacher", { department });
    },
    onSuccess: (data) => {
      console.log(data);

      const decodedToken = jwtDecode(data.data.token);
      Cookies.set("token", data.data.token);
      setUserState(decodedToken);
      navigate("/dashboard");
    },
    onError: (error) => console.log(error),
  });
  const { userState } = useContext(UserContext);

  const { handleSubmit, register, formState } = useForm({
    // resolver: yupResolver(schema),
  });

  const formSubmit = (data) => {
    console.log("submission start");
    mutate({ department: data.department });
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full overflow-y-hidden sm:overflow-y-auto">
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
          value={userState.email}
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

        {/* Position Input */}
        {/* <label
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
          // value={user?.email.includes("hod") ? "HOD" : ""}
        >
          <option value="TEACHER" className="p-3">
            TEACHER
          </option> */}
        {/* <option value="ASSISTANT_PROFESSOR" className="p-3">
            ASSISTANT_PROFESSOR
          </option> */}
        {/* <option value="HOD" className="p-3">
            HOD
          </option>
        </select> */}

        <div className="btn flex gap-4 items-center justify-center mt-12">
          <NavLink
            to="/"
            className="px-10 py-2 border border-blue-dark text-blue-dark rounded-lg font-semibold
            lg:text-xl lg:px-10 lg:py-3 hover:animate-shift-up active:animate-shift-down"
          >
            Back
          </NavLink>
          <button
            disabled={isPending}
            className="px-10 py-2 border border-blue-dark text-blue-dark rounded-lg font-semibold
            lg:text-xl lg:px-10 lg:py-3 hover:animate-shift-up active:animate-shift-down"
          >
            {isPending ? "Confirming" : "Confirm"}
          </button>
        </div>
      </form>
      {isError && <p className="text-red-600"> {error.message} </p>}
    </div>
  );
};

export default TeachingStaffForm;
