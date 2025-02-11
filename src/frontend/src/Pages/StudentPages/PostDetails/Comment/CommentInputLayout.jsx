import { Textarea } from "flowbite-react";
import React, { useState } from "react";
import CommentInput from "./CommentInput";
import EmptyComment from "./EmptyComment";

export default function CommentInputLayout({ postId }) {
  const [commentOn, setCommentOn] = useState(false);
  let nocomment = true;
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
        {commentOn && (
          <CommentInput postId={postId} setCommentOn={setCommentOn} />
        )}
        {nocomment && <EmptyComment />}
      </div>
    </>
  );
}
