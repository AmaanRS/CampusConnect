import React from "react";
import CommentInputLayout from "./CommentInputLayout";
import EmptyComment from "./EmptyComment";
import CommentItem from "./CommentItem";

export default function PostComment({
  postId,
  commentList,
  commentOn,
  setCommentOn,
}) {
  return (
    <div id="comment">
      <CommentInputLayout
        commentOn={commentOn}
        setCommentOn={setCommentOn}
        postId={postId}
      />
      {commentList?.length == 0 && <EmptyComment />}

      {commentList?.length > 0 && (
        <>
          {commentList.map((comment) => {
            return (
              <>
                <CommentItem key={comment?._id} comment={comment} />
              </>
            );
          })}
        </>
      )}
    </div>
  );
}
