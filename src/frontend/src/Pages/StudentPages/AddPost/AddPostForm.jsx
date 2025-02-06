import {
  Button,
  Dropdown,
  Label,
  Select,
  Tabs,
  TextInput,
} from "flowbite-react";
import React, { useState } from "react";
import TipTap from "../../../Components/RichTextEditor/TipTap";
import MediaUploader from "../../../Components/MediaUploader/MediaUploader";
import Title from "./Title";
import SelectCommittee from "./SelectCommittee";

export default function AddPostForm() {
  const [htmlContent, setHtmlContent] = useState("");
  const [publicURL, setPublicUrl] = useState("");
  const [filePath, setFilePath] = useState("");
  const [title, setTitle] = useState("");
  const [committee, setCommittee] = useState("");
  const [error, setError] = useState("");

  function getEditorContent(richText) {
    setError("");
    setHtmlContent(richText);
  }

  function handleChange(e) {
    setError("");
    setCommittee(e.value);
  }

  function handleSubmit() {
    if (!committee || !title || htmlContent.length < 8) {
      setError("Please Fill all mandatory fields");
      return;
    }
    console.log(committee, title, htmlContent, filePath, publicURL);
  }

  return (
    <div className="ml-8 max-w-2xl">
      <h1 className="font-bold text-slate-800 text-2xl mb-8">Add Post</h1>
      <form>
        <div className="mb-8 ">
          <p className="my-2  text-lg font-semibold">
            Select Committee <sup className="text-red-500">*</sup>{" "}
          </p>
          <SelectCommittee handleChange={handleChange} />
        </div>
        <div className="mb-8">
          <Title setTitle={setTitle} setError={setError} title={title} />
        </div>

        <div>
          <p className="my-2  text-lg font-semibold">
            Post Content <sup className="text-red-500">*</sup>
          </p>
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

        <div className="text-center">
          <Button
            onClick={handleSubmit}
            color="blue"
            className=" inline-block text-center ml-auto mt-4"
          >
            Submit
          </Button>
        </div>
        {error != "" && (
          <p className="text-center mt-2 text-red-600">{error}</p>
        )}
      </form>
    </div>
  );
}
