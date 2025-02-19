import React from "react";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import CommitteeSidebar from "../Components/CommitteeSidebar/CommitteeSidebar";
import CommitteeList from "./CommitteeList";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import ApiError from "../../../Components/Errors/ApiError";
import { toast } from "react-toastify";
import PostDetailSkeleton from "../PostDetails/Skeletons/PostDetailSkeleton";
import SidebarSkeleton from "../Components/CommitteeSidebar/skeletons/SidebarSkeleton";

const fetchData = async ({ committeeId }) => {
  const response = await axiosInstance.post(`/committee/getCommitteeById`, {
    committeeId,
  });
  return response.data;
};

export default function CommitteeDetailLayout() {
  const { committeeId } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["committee", committeeId], // Unique query key
    queryFn: () => fetchData({ committeeId }), // Function to fetch data
  });

  if (isLoading)
    return (
      <>
        <CentreMainContent>
          <div className="flex animate-pulse bg-slate-100 py-2 rounded-lg items-center mb-4 px-4 ">
            <div className="  rounded-full bg-slate-200 h-16 w-16 "></div>

            <p className="ml-6 rounded-md h-6 w-40 bg-slate-200"> </p>
          </div>

          <PostDetailSkeleton />
        </CentreMainContent>
        <RightSidebar>
          <SidebarSkeleton />
        </RightSidebar>
      </>
    );
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

  console.log(data?.data);

  return (
    <>
      <CentreMainContent>
        <CommitteeList posts={data?.data?.posts} name={data?.data?.name} />
      </CentreMainContent>
      <RightSidebar>
        <CommitteeSidebar committeeData={data.data} />
      </RightSidebar>
    </>
  );
}
