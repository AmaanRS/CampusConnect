import { Button, Dropdown, Label, Tabs, TextInput } from "flowbite-react";
import React, { useState } from "react";
import TipTap from "../../../Components/RichTextEditor/TipTap";
import MediaUploader from "../../../Components/MediaUploader/MediaUploader";
import Title from "./Title";
import SelectCommittee from "./SelectCommittee";

export default function AddPostForm() {
  const [htmlContent, setHtmlContent] = useState("");
  const [publicURL, setPublicUrl] = useState("");
  const [filePath, setFilePath] = useState("");

  function getEditorContent(richText) {
    setHtmlContent(richText);
  }
  return (
    <div className="ml-8 max-w-2xl">
      <h1 className="font-bold text-slate-800 text-2xl mb-8">Add Post</h1>
      <form>
        <div className="mb-8 ">
          <p className="my-2  text-lg font-semibold">Select Committee</p>
          <SelectCommittee />
        </div>
        <div className="mb-8">
          <Title />
        </div>

        <div>
          <p className="my-2  text-lg font-semibold">Post Content</p>
          <TipTap getEditorContent={getEditorContent} />
        </div>

        <div className="mt-6">
          <p className="my-2  text-lg font-semibold">Upload Image (optional)</p>

          <MediaUploader
            filePath={filePath}
            publicURL={publicURL}
            setFilePath={setFilePath}
            setPublicUrl={setPublicUrl}
            dir={"posts/"}
          />
        </div>

        <div className="text-right">
          <Button
            color="blue"
            className=" inline-block text-center ml-auto mt-4"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
