import React from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import ApiError from "../../../Components/Errors/ApiError";

const fetchData = async () => {
  const response = await axiosInstance.post("/event/getAllEvents", {});
  return response.data;
};

export default function AllEvents() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["allEvents"],
    queryFn: fetchData,
  });

  if (isLoading) return <>Loading...</>;
  if (isError)
    return (
      <div className="h-96 w-full flex items-center justify-center  ">
        <ApiError isError={isError} error={error} />
      </div>
    );
  console.log(data);
  return <div>AllEvents</div>;
}
