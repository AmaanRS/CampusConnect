import React from "react";
import { useParams } from "react-router-dom";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import PostDetails from "./PostDetails";
import CommitteeSidebar from "../Components/CommitteeSidebar/CommitteeSidebar";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import PostDetailSkeleton from "./Skeletons/PostDetailSkeleton";
import SidebarSkeleton from "../Components/CommitteeSidebar/skeletons/SidebarSkeleton";
import { toast } from "react-toastify";
import ApiError from "../../../Components/Errors/ApiError";

const fetchData = async ({ postId }) => {
  const response = await axiosInstance.post(`/post/getPostById`, { postId });
  return response.data;
};

export default function PostDetailsLayout() {
  const { postId } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["post", postId], // Unique query key
    queryFn: () => fetchData({ postId }), // Function to fetch data
  });

  if (isLoading)
    return (
      <>
        <CentreMainContent>
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

  return (
    <>
      <CentreMainContent>
        <PostDetails postData={data?.data} />
      </CentreMainContent>
      <RightSidebar>
        <CommitteeSidebar committeeData={data?.data?.committeeObjId} />
      </RightSidebar>
    </>
  );
}
