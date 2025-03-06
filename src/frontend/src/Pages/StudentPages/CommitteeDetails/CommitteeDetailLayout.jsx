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
import CommitteeDetailSkeleton from "./CommitteeDetailSkeleton";

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

  if (isLoading) return <CommitteeDetailSkeleton />;
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
    <>
      <CentreMainContent>
        <CommitteeList
          posts={data?.data?.posts}
          name={data?.data?.name}
          events={data?.data?.events}
        />
      </CentreMainContent>
      <RightSidebar>
        <CommitteeSidebar committeeData={data.data} />
      </RightSidebar>
    </>
  );
}
