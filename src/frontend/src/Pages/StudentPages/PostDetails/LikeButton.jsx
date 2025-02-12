import numbro from "numbro";
import React from "react";
import { AiOutlineLike } from "react-icons/ai";

export default function LikeButton({ active, likes }) {
  function handleLike() {
    console.log("clicked");
  }

  return (
    <div
      className={`min-w-16    rounded-full flex  items-center justify-center py-0.5 pl-1 pr-3 mb-1 mt-1 ${
        active ? "text-white bg-blue-600 " : "bg-slate-200"
      }`}
    >
      <button
        onClick={handleLike}
        type="button"
        className={`  rounded-full h-7 font-medium text-xs text-center inline-flex items-center hover:text-blue-600 ${
          active
            ? "text-white bg-blue-600 hover:text-white hover:bg-blue-600"
            : "text-black bg-slate-200"
        } `}
      >
        <AiOutlineLike className="text-lg rounded-full m-1" />
        <div className="text-xs font-medium">
          {numbro(likes).format({ average: true }).toUpperCase()}
        </div>
      </button>
    </div>
  );
}
