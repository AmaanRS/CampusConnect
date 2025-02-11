import React from "react";
import CommentInputLayout from "./CommentInputLayout";

export default function PostComment({ postId }) {
  return (
    <div>
      <CommentInputLayout postId={postId} />
    </div>
  );
}
