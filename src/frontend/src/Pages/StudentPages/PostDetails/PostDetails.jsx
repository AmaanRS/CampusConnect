import React from "react";
import PostTop from "./PostTop";
import PostTitle from "./PostTitle";
import PostBody from "./PostBody";
import PostImage from "./PostImage";
import PostActionBar from "./PostActionBar";
import PostComment from "./Comment/PostComment";

export default function PostDetails({ postData }) {
  console.log(postData);
  let isImage = postData?.image.length > 0;
  console.log(isImage);
  return (
    <>
      <div className="  max-w-3xl m-auto">
        <div className="mx-4">
          <PostTop
            subname={postData?.committeeDocId?.name}
            createdAt={postData?.createdAt}
          />
          <PostTitle title={postData?.title} />
          <PostBody content={postData?.content} />
          {isImage && <PostImage images={[postData?.image[0]?.imageUrl]} />}
          <PostActionBar postId={postData?.postId} />
          <PostComment />
        </div>
      </div>
    </>
  );
}
