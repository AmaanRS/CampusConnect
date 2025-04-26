import React from "react";

export default function PostTitle({ title = "Title" }) {
  return (
    <>
      <h1 className="my-2 text-lg text-slate-800 font-semibold leading-6">
        {title}
      </h1>
    </>
  );
}
