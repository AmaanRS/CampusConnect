import React from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import numbro from "numbro";
import { PiShareFat } from "react-icons/pi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostActionBar({ postId, likes }) {
  let active = false;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `http://localhost:5173/student/post/${postId}`
      );
      toast.success("Link Copied");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex">
      {/* like button */}
      <Link to={`/student/post/${postId}`}>
        <div
          className={`min-w-16   rounded-full flex  items-center justify-center py-0.5 pl-1 pr-3 mb-1 mt-1 ${
            active ? "text-white bg-blue-600 " : "bg-slate-200"
          }`}
        >
          <button
            type="button"
            className={`  rounded-full font-medium text-xs text-center inline-flex items-center hover:text-blue-600 ${
              active
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
      </Link>

      {/* comment button */}
      <Link to={`/student/post/${postId}`}>
        <div className={` flex ml-2  items-center justify-center `}>
          <button
            type="button"
            className={`min-w-16  my-0.5 ml-1 mb-1 mt-1  rounded-full h-8 font-medium text-xs text-center inline-flex items-center justify-center hover:text-blue-600 disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:text-slate-300 bg-slate-200    `}
          >
            <FaRegComment className="text-base rounded-full m-1" />
            <div className="text-xs mr-1  text-center font-medium">
              {numbro(10000).format({ average: true }).toUpperCase()}
            </div>
          </button>
        </div>
      </Link>

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
