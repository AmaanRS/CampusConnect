import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import ApiError from "../../../Components/Errors/ApiError";
import NewCommitteeRequestCard from "./NewCommitteeRequestCard";
import NewCommitteeRequestCardSkeleton from "./NewCommitteeRequestCardSkeleton";

export default function NewRequest() {
  const committeRequest = useQuery({
    queryKey: ["committeRequest"],
    queryFn: () => axiosInstance.post("/getAllPendingCommittees"),
  });

  if (committeRequest.isError) {
    console.log(committeRequest.error);

    return (
      <ApiError
        error={committeRequest.error}
        isError={committeRequest.isError}
      />
    );
  }

  return (
    <>
      <div className=" py-4 px-4 ">
        {(committeRequest.isLoading ||
          committeRequest?.data?.data?.data.length !== 0) && (
          <p className="mb-3 md:text-2xl text-center font-bold text-xl ">
            New Committee Requests
          </p>
        )}
        {committeRequest.isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-4  gap-4">
              <NewCommitteeRequestCardSkeleton />
              <NewCommitteeRequestCardSkeleton />
              <NewCommitteeRequestCardSkeleton />
            </div>
          </>
        )}
        {committeRequest?.data?.data?.data.length !== 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-4">
              {committeRequest?.data?.data?.data.map((item) => {
                return (
                  <NewCommitteeRequestCard key={item.committeeId} item={item} />
                );
              })}
            </div>
          </>
        )}
        {committeRequest?.data?.data?.data.length === 0 && (
          <p className="text-2xl font-bold text-center  border-2   w-fit m-auto p-4 rounded-md border-slate-400">
            There are no Pending Requests for New Committee
          </p>
        )}
      </div>
    </>
  );
}
