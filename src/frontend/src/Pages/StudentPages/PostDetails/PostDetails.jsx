import React from "react";
import PostTop from "./PostTop";
import PostTitle from "./PostTitle";
import PostBody from "./PostBody";
import PostImage from "./PostImage";
import PostActionBar from "./PostActionBar";
import PostComment from "./Comment/PostComment";

export default function PostDetails({ postData }) {
  let isImage = postData?.image.length > 0;
  console.log(postData);

  return (
    <>
      <div className="  max-w-3xl m-auto">
        <div className="mx-4">
          <PostTop
            subname={postData?.committeeObjId?.name}
            createdAt={postData?.createdAt}
            username={postData?.postedBy?.email.split(".")[0]}
          />
          <PostTitle title={postData?.title} />
          <PostBody content={postData?.content} />
          {isImage && <PostImage images={[postData?.image[0]?.imageUrl]} />}
          <PostActionBar postId={postData?.postId} />
          <PostComment postId={postData?.postId} />
        </div>
      </div>
    </>
  );
}
