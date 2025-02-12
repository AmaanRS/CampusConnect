import React from "react";
import CommentInputLayout from "./CommentInputLayout";
import EmptyComment from "./EmptyComment";

export default function PostComment({ postId, commentList }) {
  return (
    <div>
      <CommentInputLayout postId={postId} />
      {commentList?.length == 0 && <EmptyComment />}
    </div>
  );
}
