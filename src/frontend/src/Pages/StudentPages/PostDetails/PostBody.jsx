import React from "react";
import parse from "html-react-parser";

export default function PostBody({ content = "" }) {
  return <div className="tiptap mt-4 ">{parse(content)}</div>;
}
