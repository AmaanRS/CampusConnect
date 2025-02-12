import React from "react";
import CommentInputLayout from "./CommentInputLayout";
import EmptyComment from "./EmptyComment";

export default function PostComment({ postId, commentList }) {
  console.log(commentList);
  return (
    <div>
      <CommentInputLayout postId={postId} />
      {commentList?.length == 0 && <EmptyComment />}
    </div>
  );
}
