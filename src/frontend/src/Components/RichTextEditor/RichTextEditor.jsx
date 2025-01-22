import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import RichTextViewer from "./RichTextViewer";

const RichTextEditor = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  console.log(content);

  return (
    <div className="prose">
      <JoditEditor
        ref={editor}
        value={content}
        config={{
          readonly: false, // all options from https://xdsoft.net/jodit/docs/,
          placeholder: "Start typings...",
          defaultLineHeight: 0,
        }}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
      />
      <RichTextViewer content={content} />
    </div>
  );
};

export default RichTextEditor;
