import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import RichTextViewer from "./RichTextViewer";

const RichTextEditor = () => {
  const editor = useRef(null);
  const [content, setContent] = useState(
    '<p><span style="font-size: 14px;">This is P</span></p><h1><span style="font-size: 14px;">This is H1</span></h1><h2><span style="font-size: 14px;"><span style="font-size: 14px;">This is H2</span></span></h2><h3><span style="font-size: 14px;"><span style="font-size: 14px;">This is H3</span></span></h3><h4><span style="font-size: 14px;">This is H4</span></h4><blockquote><span style="font-size: 14px;">This is Quote</span></blockquote><pre><span style="font-size: 14px;"><span style="font-size: 14px;">This is Code</span></span></pre><p><span style="font-size: 14px;"><br></span></p><p><strong>This is bold</strong></p><p style="text-align: center;"><em>This is italic</em></p><p style="text-align: right;"><u>This is underline</u></p><p style="text-align: justify;"><s>This is strikethrough</s></p><ul><li>ul 1</li><li style="margin-left: 70px;">ul 2</li></ul><ol style="list-style-type: upper-roman;"><li>ul c 1</li></ol><ul style="list-style-type: circle;"><li>ul c 2</li></ul><ul style="list-style-type: square;"><li>ul sq 1</li><li>ul sq 2</li><br></ul><ol><li>ol d 1</li><li>ol d 2</li></ol><ol style="list-style-type: lower-alpha;"><li>ol la 1</li><li>ol la 2</li></ol><ol style="list-style-type: lower-greek;"><li>ol g 1</li><li>ol g 2</li></ol><ol style="list-style-type: lower-roman;"><li>ol lr 1</li><li>ol lr 2</li></ol><ol style="list-style-type: upper-alpha;"><li>ol ua 1</li><li>ol ua 2</li></ol><ol style="list-style-type: upper-roman;"><li>ol ur</li><li>ol ur</li></ol><p><span style="background-color: rgb(255, 255, 0);">colored&nbsp;</span></p><p><br><br><br><br><br><br></p>'
  );

  console.log(content);

  return (
    <div className="no-tailwindcss-base m-auto">
      <div className="">
        <JoditEditor
          ref={editor}
          value={content}
          config={{
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            placeholder: "Start typings...",
          }}
          tabIndex={1} // tabIndex of textarea
          onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        />
      </div>
      <div className=" border py-2 px-2">
        <RichTextViewer content={content} />
      </div>
    </div>
  );
};

export default RichTextEditor;
