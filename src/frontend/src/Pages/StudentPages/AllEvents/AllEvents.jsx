import React from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import ApiError from "../../../Components/Errors/ApiError";
import EventPost from "./EventPost";
import EventPostSkeleton from "./EventPostSkeleton";
import Promotion from "../Promotion/Promotion";

const fetchData = async () => {
  const response = await axiosInstance.post("/event/getAllEvents", {});
  return response.data;
};

export default function AllEvents() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["allEvents"],
    queryFn: fetchData,
  });

  if (isLoading)
    return (
      <>
        <div className=" max-w-2xl px-2 m-auto">
          <EventPostSkeleton />
          <EventPostSkeleton />
          <EventPostSkeleton />
        </div>
      </>
    );
  if (isError)
    return (
      <div className="h-96 w-full flex items-center justify-center  ">
        <ApiError isError={isError} error={error} />
      </div>
    );
  return (
    <div className=" max-w-2xl px-2 m-auto">
      <Promotion />
      {data?.data?.map((event) => {
        return <EventPost key={event?._id} eventData={event} />;
      })}
    </div>
  );
}
