import { Textarea } from "flowbite-react";
import React from "react";

export default function CommentInput({ setCommentOn }) {
  return (
    <div className="">
      <Textarea
        autoFocus
        theme={{
          base: "block w-full border text-sm rounded-t-2xl border-b-0 ",
          colors: {
            gray: "border-slate-500 text-gray-900 focus:border-slate-500 focus:ring-0 ",
          },
        }}
      />
      <div className="w-full  border border-t-0  text-right border-slate-500 rounded-b-2xl">
        <button
          type="button"
          onClick={() => setCommentOn(false)}
          className="border border-transparent rounded-full px-2 py-2 mb-1 text-xs font-medium mr-2 bg-slate-200  enabled:hover:bg-slate-300 "
        >
          Cancel
        </button>

        <button
          type="button"
          className="border border-transparent rounded-full px-2 py-2 mb-1 text-xs font-medium mr-2 bg-blue-700 text-white  enabled:hover:bg-blue-800 "
        >
          Comment
        </button>
      </div>
    </div>
  );
}
