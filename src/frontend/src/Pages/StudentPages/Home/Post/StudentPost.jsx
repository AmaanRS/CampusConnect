import { Avatar, Button, HR } from "flowbite-react";
import React from "react";
import parse from "html-react-parser";
import "./post.scss";
import PostTop from "./PostTop";
import PostTitle from "./PostTitle";
import PostActionBar from "./PostActionBar";
import PostBody from "./PostBody";
import PostImage from "./PostImage";

export default function StudentPost() {
  return (
    <>
      <div className="mx-1 hover:bg-slate-100 cursor-pointer rounded-2xl py-1 px-3 transition-colors duration-100 ">
        <PostTop />
        <PostTitle />

        <PostBody />
        <PostImage />

        <PostActionBar />
      </div>
      <div className="border-b-[1.3px] mx-1 border-slate-200 mt-1 mb-1"></div>
    </>
  );
}
