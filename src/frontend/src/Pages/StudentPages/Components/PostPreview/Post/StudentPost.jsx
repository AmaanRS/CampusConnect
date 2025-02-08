import { Avatar, Button, HR } from "flowbite-react";
import React from "react";
import "./post.scss";
import PostTop from "./PostTop";
import PostTitle from "./PostTitle";
import PostActionBar from "./PostActionBar";
import PostBody from "./PostBody";
import PostImage from "./PostImage";
import { Link } from "react-router-dom";

export default function StudentPost({ mode = "home", postData }) {
  console.log(postData);
  let isImage = postData?.image?.length > 0;
  return (
    <>
      <div className="mx-2 my-2  hover:bg-slate-50 cursor-pointer rounded-2xl py-1 px-3 transition-colors duration-100 ">
        <PostTop
          mode={mode}
          committeeId={postData?.committeeDocId?.committeeId}
          createdAt={postData?.createdAt}
          subname={postData?.committeeDocId?.name}
        />
        <Link to={`/student/post/${postData?.postId}`}>
          <PostTitle title={postData?.title} />
          <PostBody isImage={isImage} content={postData?.content} />
        </Link>
        {isImage && <PostImage images={[postData?.image[0]?.imageUrl]} />}

        <PostActionBar postId={postData?.postId} />
      </div>
      <div className="border-b-[1.3px] mx-1 border-slate-200 mt-1 mb-1"></div>
    </>
  );
}
