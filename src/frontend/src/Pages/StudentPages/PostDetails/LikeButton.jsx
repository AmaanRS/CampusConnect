import numbro from "numbro";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UserContext } from "../../../store/UserContextProvider";

const postData = async (data) => {
  const response = await axiosInstance.post("/post/togglePostLike", data);
  return response.data;
};

export default function LikeButton({ active, likes, postId }) {
  const queryClient = useQueryClient();

  const {
    userState: { email },
  } = useContext(UserContext);
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [cuurLike, setCurrLike] = useState(likes?.length);

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      console.log("Data posted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });

      setAlreadyLiked((prev) => !prev);
      if (alreadyLiked) {
        setCurrLike((prev) => prev - 1);
      }
      if (!alreadyLiked) {
        setCurrLike((prev) => prev + 1);
      }
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

  useEffect(() => {
    if (likes?.length > 0) {
      const emailExists = likes.some((like) => like.email === email);
      setAlreadyLiked(emailExists);
    }
  }, [likes]);

  return (
    <div className={` flex  items-center justify-center `}>
      <button
        disabled={mutation.isPending}
        onClick={handleLike}
        type="button"
        className={`min-w-16  my-0.5 ml-1 mb-1 mt-1  rounded-full h-8 font-medium text-xs text-center inline-flex items-center justify-center hover:text-blue-600 disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:text-slate-300  ${
          alreadyLiked
            ? "text-white bg-blue-600 hover:text-white hover:bg-blue-600"
            : "text-black bg-slate-200"
        } `}
      >
        <AiOutlineLike className="text-lg rounded-full m-1" />
        <div className="text-xs mr-1  text-center font-medium">
          {numbro(cuurLike).format({ average: true }).toUpperCase()}
        </div>
      </button>
    </div>
  );
}
