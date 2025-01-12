import React from "react";
import { List } from "flowbite-react";
import TeacherItem from "./TeacherItem";
import { useQuery } from "@tanstack/react-query";
import ApiError from "../../../Components/Errors/ApiError";
import axiosInstance from "../../../utils/Axios/AxiosInstance";

export default function AllTeachers() {
  const teachers = useQuery({
    queryKey: ["teachers"],
    queryFn: () => axiosInstance.post("/teacher/getAllTeachers"),
  });

  if (teachers.isError) {
    console.log(teachers.error);

    return <ApiError error={teachers.error} isError={teachers.isError} />;
  }

  return (
    <div className="max-w-xl  mx-auto my-6 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        All Teachers
      </h2>
      {teachers.isLoading && (
        <>
          <p>Loading...</p>
        </>
      )}
      {!teachers.isLoading && (
        <List
          unstyled
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {teachers?.data?.data?.data.map((item) => (
            <TeacherItem key={item._id} email={item.email} />
          ))}
        </List>
      )}
    </div>
  );
}
