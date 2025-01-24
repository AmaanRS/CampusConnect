import React from "react";

export default function RichTextViewer({ content }) {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}
