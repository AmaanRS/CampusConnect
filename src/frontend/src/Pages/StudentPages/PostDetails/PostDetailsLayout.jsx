import React from "react";
import { useParams } from "react-router-dom";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import PostDetails from "./PostDetails";
import CommitteeSidebar from "../Components/CommitteeSidebar/CommitteeSidebar";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import PostDetailSkeleton from "./Skeletons/PostDetailSkeleton";

const fetchData = async ({ postId }) => {
  const response = await axiosInstance.post(`/post/getPostById`, { postId }); // Replace with your API URL
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
      <CentreMainContent>
        <PostDetailSkeleton />;
      </CentreMainContent>
    );
  if (isError) return <p>Error: {error.message}</p>;

  console.log(data);
  return (
    <>
      <CentreMainContent>
        <PostDetailSkeleton />
        <PostDetails postData={data?.data} />
      </CentreMainContent>
      <RightSidebar>
        <CommitteeSidebar committeeData={data?.data.committeeDocId} />
      </RightSidebar>
    </>
  );
}
