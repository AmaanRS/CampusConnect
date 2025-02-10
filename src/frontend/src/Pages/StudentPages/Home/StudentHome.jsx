import React from "react";
import StudentPost from "../Components/PostPreview/Post/StudentPost";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/Axios/AxiosInstance";

const fetchData = async () => {
  const response = await axiosInstance.post("/post/getAllPosts", {});
  return response.data;
};

export default function StudentHome() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return (
    <div className="mx-1 max-w-2xl m-auto">
      <hr className="mb-2 mx-1" />
      {data?.data?.map((post) => {
        return <StudentPost key={post?.postId} postData={post} />;
      })}
    </div>
  );
}
