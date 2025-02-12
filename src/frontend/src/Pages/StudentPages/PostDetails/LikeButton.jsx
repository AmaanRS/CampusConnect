import numbro from "numbro";
import React, { useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const postData = async (data) => {
  const response = await axiosInstance.post("/post/togglePostLike", data);
  return response.data;
};

export default function LikeButton({ active, likes, postId }) {
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [cuurLike, setCurrLike] = useState(likes?.length);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      console.log("Data posted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      setAlreadyLiked((prev) => !prev);
    },
    onError: (error) => {
      console.error("Error posting data:", error);
      toast.error("Failed to Like the post");
    },
  });

  function handleLike() {
    console.log("clicked");
    mutation.mutate({ postId });
  }

  return (
    <div
      className={`min-w-16    rounded-full flex  items-center justify-center py-0.5 pl-1 pr-3 mb-1 mt-1 ${
        alreadyLiked ? "text-white bg-blue-600 " : "bg-slate-200"
      }`}
    >
      <button
        disabled={mutation.isPending}
        onClick={handleLike}
        type="button"
        className={`  rounded-full h-7 font-medium text-xs text-center inline-flex items-center hover:text-blue-600 disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:text-slate-300  ${
          alreadyLiked
            ? "text-white bg-blue-600 hover:text-white hover:bg-blue-600"
            : "text-black bg-slate-200"
        } `}
      >
        <AiOutlineLike className="text-lg rounded-full m-1" />
        <div className="text-xs font-medium">
          {numbro(likes?.length).format({ average: true }).toUpperCase()}
        </div>
      </button>
    </div>
  );
}
