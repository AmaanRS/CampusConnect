import { Button, Dropdown, Label, Tabs, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import TipTap from "../../../Components/RichTextEditor/TipTap";
import RichTextViewer from "../../../Components/RichTextEditor/RichTextViewer";

export default function AddPostForm() {
  const [htmlContent, setHtmlContent] = useState("");
  function getEditorContent(richText) {
    setHtmlContent(richText);
    console.log(richText);
  }

  return (
    <div className="ml-8 max-w-2xl">
      <h1 className="font-bold text-slate-800 text-2xl mb-4">Create Post</h1>
      <form>
        <div className="mb-8 ">
          <Dropdown
            renderTrigger={() => (
              <div className="inline-block  bg-slate-200 px-4 py-2 rounded-full">
                <div className=" flex items-center">
                  <span className="font-medium">Select a committee</span>
                  <span className="ml-2">
                    {" "}
                    {/* Adjust the margin as needed */}
                    <svg
                      className="fill-current"
                      height="20"
                      viewBox="0 0 20 20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 13.125a.624.624 0 0 1-.442-.183l-5-5 .884-.884L10 11.616l4.558-4.558.884.884-5 5a.624.624 0 0 1-.442.183Z"></path>
                    </svg>
                  </span>
                </div>
              </div>
            )}
            dismissOnClick={false}
          >
            <Dropdown.Item>Hackathon Committee</Dropdown.Item>
            <Dropdown.Item>Student Council</Dropdown.Item>
            <Dropdown.Item>NSS</Dropdown.Item>
            <Dropdown.Item>Computer Society of India</Dropdown.Item>
          </Dropdown>
        </div>
        <div className="mb-8">
          <div className="mb-2 block">
            <Label
              className="my-2 text-lg font-semibold"
              htmlFor="email1"
              value="Post Title"
            />
          </div>
          <TextInput
            sizing={"lg"}
            theme={{
              field: {
                input: {
                  colors: {
                    gray: "border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 ",
                  },
                },
              },
            }}
            className="rounded-full"
            id="email1"
            type="email"
            placeholder="Post Title"
            required
          />
        </div>

        <div>
          <p className="my-2 text-lg font-semibold">Post Content</p>
          <TipTap getEditorContent={getEditorContent} />
        </div>
        {/* <RichTextViewer htmlContent={htmlContent} /> */}
        <Button color="blue" className=" inline-block  ml-auto mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
}
