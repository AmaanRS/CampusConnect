import React from "react";
import CommentInputLayout from "./CommentInputLayout";
import EmptyComment from "./EmptyComment";

export default function PostComment({
  postId,
  commentList,
  commentOn,
  setCommentOn,
}) {
  console.log("post comments", commentList);
  return (
    <div id="comment">
      <CommentInputLayout
        commentOn={commentOn}
        setCommentOn={setCommentOn}
        postId={postId}
      />
      {commentList?.length == 0 && <EmptyComment />}

      {commentList?.length > 0 && (
        <div>
          {commentList.map((comment) => {
            return (
              <>
                <br />
                <p>{comment?.comment}</p>
                <p> {comment?.userId?.email} </p>
                <br />
              </>
            );
          })}
        </div>
      )}
    </div>
  );
}
