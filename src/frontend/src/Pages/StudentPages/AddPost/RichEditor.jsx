import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Add Quill styles

const MyEditor = () => {
  const [value, setValue] = useState(""); // State to store editor content

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"], // remove formatting button
    ],
  };
  const formats = [
    "link",
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "image",
  ];

  const handleChange = (content) => {
    setValue(content);
  };

  return (
    <div>
      <div className="z-100">
        <ReactQuill
          modules={modules}
          value={value}
          onChange={handleChange}
          formats={formats}
        />
        <p>Editor Output:</p>
        <div dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    </div>
  );
};

export default MyEditor;
