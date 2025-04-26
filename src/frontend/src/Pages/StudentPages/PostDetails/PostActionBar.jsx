import React, { useContext } from "react";
import { FaRegComment } from "react-icons/fa6";
import numbro from "numbro";
import { PiShareFat } from "react-icons/pi";
import { toast } from "react-toastify";
import LikeButton from "./LikeButton";
import { UserContext } from "../../../store/UserContextProvider";

export default function PostActionBar({
  postId,
  likes,
  comments,
  setcommentOn,
}) {
  const {
    userState: { accountType },
  } = useContext(UserContext);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://campusconnect-frontend-3crd.onrender.com/${accountType.toLowerCase()}/post/${postId}`
      );
      toast.success("Link Copied");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  function handleComment() {
    setcommentOn(true);
  }

  return (
    <div className="flex mt-4">
      {/* like button */}
      <LikeButton postId={postId} likes={likes} />

      {/* comment button */}
      <div className={` flex ml-2  items-center justify-center `}>
        <button
          onClick={handleComment}
          type="button"
          className={`min-w-16  my-0.5 ml-1 mb-1 mt-1  rounded-full h-8 font-medium text-xs text-center inline-flex items-center justify-center hover:text-blue-600 disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:text-slate-300 bg-slate-200    `}
        >
          <FaRegComment className="text-base rounded-full m-1" />
          <div className="text-xs mr-1  text-center font-medium">
            {numbro(comments).format({ average: true }).toUpperCase()}
          </div>
        </button>
      </div>

      {/* share button */}
      <div className={` flex ml-2  items-center justify-center `}>
        <button
          onClick={handleCopy}
          type="button"
          className={`min-w-16 px-1 pr-2  my-0.5 ml-1 mb-1 mt-1  rounded-full h-8 font-medium text-xs text-center inline-flex items-center justify-center hover:text-blue-600 disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:text-slate-300 bg-slate-200    `}
        >
          <PiShareFat className="text-lg rounded-full m-1" />
          <div className="text-xs mr-1  text-center font-medium">Share</div>
        </button>
      </div>
    </div>
  );
}
