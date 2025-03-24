import React from "react";
import { List } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import ApiError from "../../../Components/Errors/ApiError";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import StudentItem from "./StudentItem";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import { PulseLoader } from "react-spinners";

export default function AllTeachers() {
  const students = useQuery({
    queryKey: ["allstudents"],
    queryFn: () => axiosInstance.post("/student/getAllStudents"),
  });

  if (students.isLoading) {
    return (
      <>
        <div className="h-screen w-full flex items-center justify-center pb-32">
          <PulseLoader
            color="#1a56db"
            size={16}
            speedMultiplier={1}
            className="m-auto"
          />
        </div>
      </>
    );
  }

  if (students.isError) {
    return <ApiError error={students.error} isError={students.isError} />;
  }

  return (
    <>
      <CentreMainContent>
        <p className="mb-3 md:text-2xl text-center font-bold text-xl ">
          All Students
        </p>

        <div className="max-w-xl border mx-auto my-6 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <List
            unstyled
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {students?.data?.data?.data.map((item) => (
              <StudentItem
                key={item._id}
                email={item.email}
                isActive={item?.isAccountActive}
              />
            ))}
          </List>
        </div>
      </CentreMainContent>
    </>
  );
}
