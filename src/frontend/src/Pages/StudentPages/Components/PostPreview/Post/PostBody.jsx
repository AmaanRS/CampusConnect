import React from "react";
import parse from "html-react-parser";

export default function PostBody({ isImage, content }) {
  return (
    <div
      className={`tiptap-post mb-1  ${
        isImage ? "line-clamp-2" : "line-clamp-6"
      }  text-slate-700`}
    >
      {parse(content)}
    </div>
  );
}
