import React from "react";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/Axios/AxiosInstance";

const fetchData = async () => {
  const response = await axiosInstance.post("/teacher/getTeacher", {});
  return response.data;
};

export default function TeacherDashboard() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["allEvents"],
    queryFn: fetchData,
  });
  console.log(data);

  return (
    <>
      <div>TeacherDashboard</div>
      <RightSidebar></RightSidebar>
    </>
  );
}
