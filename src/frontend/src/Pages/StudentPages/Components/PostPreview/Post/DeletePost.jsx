import React from "react";
import { MdDelete } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../utils/Axios/AxiosInstance";

const postData = async (data) => {
  const response = await axiosInstance.post("/post/deletePost", data);
  return response.data;
};

export default function DeletePost({ committeeId, postId }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      toast.success("Post removed successfully!");
      queryClient.invalidateQueries({
        queryKey: ["committee", committeeId],
      });
      //   navigate("/student");
    },
    onError: (error) => {
      toast.error("Error Deleting Post");
    },
  });

  function handleSubmit() {
    const data = { postId };
    mutation.mutate(data);
  }

  return (
    <button
      disabled={mutation.isPending}
      onClick={handleSubmit}
      className="w-full flex items-center justify-center text-left py-2 px-5 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MdDelete className="mr-2 text-lg" />
      <span className="font-medium">Delete</span>
    </button>
  );
}
