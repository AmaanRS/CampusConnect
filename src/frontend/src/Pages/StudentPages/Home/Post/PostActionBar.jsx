import React from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import numbro from "numbro";
import { PiShareFat } from "react-icons/pi";

export default function PostActionBar() {
  return (
    <div className="flex">
      <div className="min-w-16  bg-slate-200 rounded-full flex  items-center justify-center py-0.5 pl-1 pr-3 mb-1 mt-1">
        <button
          type="button"
          className="text-black bg-slate-200  rounded-full font-medium text-xs text-center inline-flex items-center hover:text-blue-500"
        >
          <AiOutlineLike className="text-lg rounded-full m-1" />
        </button>
        <div className="text-xs font-medium">
          {numbro(1000).format({ average: true }).toUpperCase()}
        </div>
      </div>
      <div className="min-w-16 ml-3  bg-slate-200 rounded-full flex  items-center justify-center py-0.5 pl-1 pr-3 mb-1 mt-1">
        <button
          type="button"
          className="text-black bg-slate-200  rounded-full font-medium text-xs text-center inline-flex items-center"
        >
          <FaRegComment className="text-base rounded-full m-1" />
        </button>
        <div className="text-xs font-medium">
          {numbro(1).format({ average: true }).toUpperCase()}
        </div>
      </div>
      <div className="min-w-16 ml-3  bg-slate-200 rounded-full flex  items-center justify-center py-0.5 pl-1 pr-3 mb-1 mt-1">
        <button
          type="button"
          className="text-black bg-slate-200  rounded-full font-medium text-xs text-center inline-flex items-center"
        >
          <PiShareFat className="text-lg rounded-full m-1" />
        </button>
        <div className=" font-medium text-xs">Share</div>
      </div>
    </div>
  );
}
