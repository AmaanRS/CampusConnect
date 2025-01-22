import React from "react";

export default function RichTextViewer({ content }) {
  return (
    <>
      <div
        style={{
          lineHeight: 0,
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
