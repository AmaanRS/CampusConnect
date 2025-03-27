import React from "react";
import PopularCommiteeItem from "./PopularCommiteeItem";
import axiosInstance from "../../../../utils/Axios/AxiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchData = async () => {
  const response = await axiosInstance.post("/committee/getAllCommittees", {});
  return response.data;
};

export default function PopularCommittees() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["popularCommittees"],
    queryFn: fetchData,
  });

  if (isLoading) {
    return <></>;
  }

  if (isError) {
    console.error(error);
    return <></>;
  }

  if (data?.data && data?.data?.length === 0) {
    return <></>;
  }

  console.log(data?.data);

  return (
    <div className="bg-slate-50 py-3 mt-4  pl-2 rounded-lg">
      <h1 className="font-semibold text-sm mb-6 text-gray-700">
        Popular Committees
      </h1>
      <ul>
        {data?.data?.map((item) => (
          <PopularCommiteeItem
            name={item?.name}
            total={item?.followers?.length}
            key={item?._id}
          />
        ))}
      </ul>
    </div>
  );
}
