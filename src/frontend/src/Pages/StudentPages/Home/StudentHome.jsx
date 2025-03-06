import React from "react";
import StudentPost from "../Components/PostPreview/Post/StudentPost";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import PostPreviewSkeleton from "../Components/PostPreview/skeletons/PostPreviewSkeleton";
import ApiError from "../../../Components/Errors/ApiError";

const fetchData = async () => {
  const response = await axiosInstance.post("/post/getAllPosts", {});
  return response.data;
};

export default function StudentHome() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["allPosts"],
    queryFn: fetchData,
  });

  if (isLoading)
    return (
      <>
        <PostPreviewSkeleton />
        <PostPreviewSkeleton />
        <PostPreviewSkeleton />
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
      {/* <hr className="mb-2 mx-1" /> */}
      {data?.data?.map((post) => {
        return <StudentPost key={post?.postId} postData={post} />;
      })}
    </div>
  );
}
