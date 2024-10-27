import React from "react";
import { List } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import ApiError from "../../../Components/Errors/ApiError";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import StudentItem from "./StudentItem";

export default function AllTeachers() {
  const students = useQuery({
    queryKey: ["students"],
    queryFn: () => axiosInstance.post("/student/getAllStudents"),
  });

  if (students.isError) {
    console.log(students.error);

    return <ApiError error={students.error} isError={students.isError} />;
  }

  return (
    <div className="max-w-xl mx-6 my-6 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        All Students
      </h2>
      {students.isLoading && (
        <>
          <p>Loading...</p>
        </>
      )}
      {!students.isLoading && (
        <List
          unstyled
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {students?.data?.data?.data.map((item) => (
            <StudentItem key={item._id} email={item.email} />
          ))}
        </List>
      )}
    </div>
  );
}
