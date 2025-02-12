import React from "react";
import CommentInputLayout from "./CommentInputLayout";
import EmptyComment from "./EmptyComment";

export default function PostComment({
  postId,
  commentList,
  commentOn,
  setCommentOn,
}) {
  return (
    <div>
      <CommentInputLayout
        commentOn={commentOn}
        setCommentOn={setCommentOn}
        postId={postId}
      />
      {commentList?.length == 0 && <EmptyComment />}
    </div>
  );
}
