import React from "react";
import parse from "html-react-parser";

export default function RichTextViewer({ htmlContent }) {
  return (
    <div className="tiptap border shadow-sm rounded-md  mt-4 custom-scrollbar max-h-96 overflow-auto">
      {parse(htmlContent)}
    </div>
  );
}
