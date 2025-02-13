import { Textarea } from "flowbite-react";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../../utils/Axios/AxiosInstance";
import { toast } from "react-toastify";

const postData = async (data) => {
  const response = await axiosInstance.post("/comment/createComment", data);
  return response.data;
};

export default function CommentInput({ setCommentOn, postId }) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: postData,
    onSuccess: () => {
      console.log("Success");
      toast.success("commented successfully");
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      setCommentOn(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error in commenting");
    },
  });

  function handleComment() {
    console.log("clicked");
    const data = {
      postId: postId,
      comment,
    };
    console.log(data);
    mutate(data);
    if (isSuccess) {
      setComment("");
      setCommentOn(false);
    }
  }

  return (
    <div className="">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isPending}
        autoFocus
        theme={{
          base: "block w-full border text-sm rounded-t-2xl border-b-0 disabled:cursor-not-allowed disabled:opacity-50 ",
          colors: {
            gray: "border-slate-500 text-gray-900 focus:border-slate-500 focus:ring-0 ",
          },
        }}
      />
      <div
        className={`w-full  border border-t-0  text-right border-slate-500 rounded-b-2xl ${
          isPending ? "opacity-50 cursor-not-allowed border-slate-300" : ""
        }`}
      >
        <button
          onClick={() => setCommentOn(false)}
          disabled={isPending}
          type="button"
          className="border border-transparent rounded-full px-2 py-2 mb-1 text-xs font-medium mr-2 bg-slate-200  enabled:hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          onClick={handleComment}
          disabled={isPending}
          type="button"
          className="border border-transparent rounded-full px-2 py-2 mb-1 text-xs font-medium mr-2 bg-blue-700 text-white  enabled:hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Comment
        </button>
      </div>
    </div>
  );
}
