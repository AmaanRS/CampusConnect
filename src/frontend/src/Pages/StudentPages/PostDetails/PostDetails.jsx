import React from "react";
import PostTop from "./PostTop";
import PostTitle from "./PostTitle";
import PostBody from "./PostBody";
import PostImage from "./PostImage";
import PostActionBar from "./PostActionBar";

export default function PostDetails() {
  return (
    <>
      <div className="  max-w-3xl m-auto">
        <PostTop />
        <PostTitle />
        <PostBody />
        <PostImage />
        <PostActionBar />
      </div>
    </>
  );
}
