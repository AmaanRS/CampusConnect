import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import ApiError from "../../../Components/Errors/ApiError";
import AllCommitteeCard from "./AllCommitteeCard";
import AllCommitteesCardSkeleton from "./AllCommitteesCardSkeleton";

export default function AllCommittees() {
  const committeRequest = useQuery({
    queryKey: ["allCommittee"],
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
      <div className=" px-2 ">
        {(committeRequest.isLoading ||
          committeRequest?.data?.data?.data.length !== 0) && (
          <p className="mb-3 md:text-2xl text-center font-bold text-xl ">
            All Committees
          </p>
        )}
        {committeRequest.isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 m-auto max-w-xl mb-4">
              <AllCommitteesCardSkeleton />
              <AllCommitteesCardSkeleton />
              <AllCommitteesCardSkeleton />
            </div>
          </>
        )}
        {committeRequest?.data?.data?.data.length !== 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1  gap-4">
              {committeRequest?.data?.data?.data.map((item) => {
                return <AllCommitteeCard key={item.committeeId} item={item} />;
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
