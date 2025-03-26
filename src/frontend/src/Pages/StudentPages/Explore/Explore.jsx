import React from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import AllCommitteeItem from "./AllCommitteeItem";
import ExploreSkeleton from "./ExploreSkeleton";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ApiError from "../../../Components/Errors/ApiError";
import EmptyComment from "../PostDetails/Comment/EmptyComment";

const fetchData = async () => {
  const response = await axiosInstance.post("/committee/getAllCommittees", {});
  return response.data;
};

export default function Explore() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["allcommittees"],
    queryFn: fetchData,
  });

  if (isLoading) {
    return (
      <>
        <ExploreSkeleton />
      </>
    );
  }

  if (isError) {
    toast.error("Error fetching data");
    return (
      <>
        <div className="w-full h-96 flex justify-center items-center">
          <ApiError isError={isError} error={error} />
        </div>
      </>
    );
  }

  return (
    <div className="mx-2">
      <p className="mb-6 text-3xl font-bold">Explore Committees</p>
      <div className=" grid grid-cols-3  gap-4">
        {data?.data?.length == 0 && <EmptyComment type="Committees" />}
        {data?.data?.map((item) =>
          item?.status === "ACCEPTED" ? (
            <AllCommitteeItem key={item._id} item={item} />
          ) : (
            ""
          )
        )}
      </div>
    </div>
  );
}
