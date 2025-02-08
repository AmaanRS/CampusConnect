import React from "react";

export default function PostTitle({ title = "" }) {
  return (
    <>
      <div className="mt-2 font-bold text-2xl leading-7">{title}</div>
    </>
  );
}
