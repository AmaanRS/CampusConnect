import React, { useContext, useEffect } from "react";
import PopularCommiteeItem from "./PopularCommiteeItem";
import axiosInstance from "../../../../utils/Axios/AxiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ApiError from "../../../../Components/Errors/ApiError";
import { UserContext } from "../../../../store/UserContextProvider";

export default function PopularCommittees() {
  const queryClient = useQueryClient();
  const {
    userState: { accountType },
  } = useContext(UserContext);
  const cachedPosts = queryClient.getQueryData([
    `${accountType.toLowerCase()}Data`,
  ]);

  const fetchData = async () => {
    const response = await axiosInstance.post(
      "/committee/fetchPopularCommittees",
      { tags: cachedPosts?.data?.tags }
    );
    return response.data;
  };

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["popularCommittees"],
    queryFn: fetchData,
  });

  if (isLoading) {
    return <></>;
  }

  if (data?.data && data?.data?.length === 0) {
    return <></>;
  }

  return (
    <div className="bg-slate-50 py-3 mt-4  pl-2 rounded-lg">
      <h1 className="font-semibold text-sm mb-6 text-gray-700">
        Popular Committees
      </h1>
      <ul>
        {data?.data?.map((item) => (
          <PopularCommiteeItem
            committeeId={item?.committeeId}
            name={item?.name}
            total={item?.followers?.length}
            key={item?._id}
          />
        ))}
      </ul>
    </div>
  );
}
