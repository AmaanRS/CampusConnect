import React from "react";
import PostTop from "./PostTop";
import PostTitle from "./PostTitle";

export default function PostDetails() {
  return (
    <>
      <div className=" h-screen max-w-3xl m-auto">
        <PostTop />
        <PostTitle />
      </div>
    </>
  );
}
