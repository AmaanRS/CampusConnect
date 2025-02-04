import { Textarea } from "flowbite-react";
import React, { useState } from "react";
import CommentInput from "./CommentInput";

export default function CommentInputLayout() {
  const [commentOn, setCommentOn] = useState(false);
  return (
    <>
      <div className=" mt-4 mb-8  ">
        {!commentOn && (
          <div
            onClick={() => setCommentOn(true)}
            className="border py-2.5 cursor-text px-4 rounded-3xl  border-slate-300 text-sm text-slate-700  w-full"
          >
            Add a comment
          </div>
        )}
        {commentOn && <CommentInput setCommentOn={setCommentOn} />}
      </div>
    </>
  );
}
