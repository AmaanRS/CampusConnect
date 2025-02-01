import React from "react";

export default function PostImage() {
  return (
    <div className="w-full my-1 rounded-lg bg-white  h-96 ">
      <img
        className="rounded-2xl object-cover w-full h-full"
        src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
      />
    </div>
  );
}
