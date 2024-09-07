import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dropdown,
  HR,
  Label,
  Textarea,
  TextInput,
} from "flowbite-react";
import { Department } from "../../../utils/enum";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../utils/Axios/AxiosInstance";

const options = [
  { value: Department.IT, label: Department.IT },
  { value: Department.COMS, label: Department.COMS },
  { value: Department.AIDS, label: Department.AIDS },
];

export default function CreateCommittee() {
  const [showMulti, setShowMulti] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [depError, setDepError] = useState("");
  const errorClass = "text-red-600 ml-2 mt-1";

  const mutation = useMutation({
    mutationFn: ({ data }) =>
      axiosInstance.post("/student/createStudent", data),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const schema = yup.object().shape({
    name: yup.string().required("name is required"),
    description: yup
      .string()
      .min(5, "should atleast have 5 characters")
      .required("description is required"),
    studentIncharge: yup
      .string()
      .email("enter a valid email")
      .required("student incharge mail is required"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const animatedComponent = makeAnimated();
  const inputTheme = {
    field: {
      input: {
        colors: {
          gray: "border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
        },
      },
    },
  };

  function onSubmit(data) {
    data.committeeOfDepartment = departments;
    if (departments.length === 0) {
      setDepError("Select atleast one department");
      return;
    } else {
      setDepError("");
    }
    mutation.mutate({ data });
  }

  const handleSelect = (selected) => {
    setDepError("");
    setSelectedOptions(selected);
    const data = selected.map(({ value }) => value);
    setDepartments(data);
  };

  const handleCheckboxClick = () => {
    setDepError("");
    setShowMulti((prev) => {
      const newShowMulti = !prev;
      if (!newShowMulti) {
        setSelectedOptions([]);
        setDepartments(["ALL"]);
      }
      if (newShowMulti) {
        setDepartments([]);
      }
      return newShowMulti;
    });
  };

  return (
    <>
      <div className="my-4  mx-6 lg:mx-10">
        <h1 className="mb-4 text-2xl font-semibold">Create a New Committee</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" flex h-screen max-w-lg flex-col gap-4"
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="committee-name" value="Committee name" />
            </div>
            <TextInput
              theme={inputTheme}
              id="committee-name"
              type="text"
              placeholder="committee"
              required
              {...register("name")}
            />
            {errors.name && (
              <p className={errorClass}> {errors.name.message} </p>
            )}
          </div>
          <div className="max-w-lg">
            <div className="mb-2 block">
              <Label htmlFor="description" value="Description" />
            </div>
            <Textarea
              color={" "}
              className="border-gray-300 bg-gray-50 text-gray-900"
              id="description"
              placeholder="write description about committee"
              required
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className={errorClass}> {errors.description.message} </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="student-incharge"
                value="Student Incharge Email"
              />
            </div>
            <TextInput
              theme={inputTheme}
              id="student-incharge"
              type="email"
              placeholder="write email of student incharge"
              required
              {...register("studentIncharge")}
            />
            {errors.studentIncharge && (
              <p className={errorClass}> {errors.studentIncharge.message} </p>
            )}
          </div>
          <div>
            <div className="mb-2">
              <Checkbox color={""} onClick={handleCheckboxClick} id="check" />
              <Label
                htmlFor="check"
                className="ml-2 text-slate-600"
                value="All Departments "
              />
            </div>
            <p className="mb-2 ml-4">or</p>
            <Select
              onChange={handleSelect}
              isDisabled={!showMulti}
              closeMenuOnSelect={false}
              isClearable
              components={animatedComponent}
              isMulti
              options={options}
              value={selectedOptions}
              styles={{
                input: (base) => ({
                  ...base,
                  "input:focus": {
                    boxShadow: "none",
                  },
                }),
              }}
            />
            {depError && <p className={errorClass}> {depError} </p>}
          </div>

          <Button
            disabled={mutation.isPending}
            color={""}
            className="bg-blue-medium hover:bg-blue-dark active:bg-blue-dark text-white"
            type="submit"
          >
            {mutation.isPending ? "Submitting" : "Submit"}
          </Button>
          {mutation.isError && (
            <p className={errorClass}> {mutation.error.message} </p>
          )}
        </form>
      </div>
    </>
  );
}
