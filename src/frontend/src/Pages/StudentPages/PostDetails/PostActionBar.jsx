import React from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import numbro from "numbro";
import { PiShareFat } from "react-icons/pi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostActionBar() {
  let active = false;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("testing copy function");
      toast.success("Link Copied");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex mt-4">
      {/* like button */}
      <div
        className={`min-w-16    rounded-full flex  items-center justify-center py-0.5 pl-1 pr-3 mb-1 mt-1 ${
          active ? "text-white bg-blue-600 " : "bg-slate-200"
        }`}
      >
        <button
          type="button"
          className={`  rounded-full h-7 font-medium text-xs text-center inline-flex items-center hover:text-blue-600 ${
            active
              ? "text-white bg-blue-600 hover:text-white hover:bg-blue-600"
              : "text-black bg-slate-200"
          } `}
        >
          <AiOutlineLike className="text-lg rounded-full m-1" />
          <div className="text-xs font-medium">
            {numbro(1000).format({ average: true }).toUpperCase()}
          </div>
        </button>
      </div>

      {/* comment button */}
      {/* <div className="min-w-16 ml-3  bg-slate-200 rounded-full flex  items-center justify-center py-0.5 pl-1 pr-3 mb-1 mt-1">
        <button
          type="button"
          className="text-black bg-slate-200 hover:text-blue-600  rounded-full font-medium text-xs text-center inline-flex items-center"
        >
          <FaRegComment className="text-base rounded-full m-1" />
          <div className="text-xs font-medium">
            {numbro(10000000).format({ average: true }).toUpperCase()}
          </div>
        </button>
      </div> */}

      {/* share button */}
      <div
        onClick={handleCopy}
        className="min-w-16 ml-3  bg-slate-200 rounded-full flex  items-center justify-center py-0.5 pl-1 pr-3 mb-1 mt-1 "
      >
        <button
          type="button"
          className="text-black bg-slate-200  rounded-full font-medium text-xs text-center inline-flex items-center hover:text-blue-600"
        >
          <PiShareFat className="text-lg rounded-full m-1" />
          <div className=" font-medium text-xs">Share</div>
        </button>
      </div>
    </div>
  );
}
