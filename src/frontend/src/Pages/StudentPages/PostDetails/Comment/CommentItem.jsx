import React from "react";
import { Avatar } from "flowbite-react";

export default function CommentItem({ comment }) {
  console.log(comment);
  return (
    <div
      key={comment?._id}
      className="bg-white  rounded-lg p-2 mb-3 border border-slate-200"
    >
      <div className="flex items-center gap-2">
        <Avatar size={"xs"} rounded />
        <div>
          <p className="font-semibold text-gray-900">
            {comment?.userId?.email?.split(".")[0]}
          </p>
          {/* <p className="text-sm text-gray-500">
            {"date"}
          </p> */}
        </div>
      </div>
      <p className="mt-2 text-gray-800">{comment?.comment}</p>
    </div>
  );
}
