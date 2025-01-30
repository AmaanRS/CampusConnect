import { Button, Dropdown, Label, Tabs, TextInput } from "flowbite-react";
import React, { useCallback, useState } from "react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import TipTap from "../../../Components/RichTextEditor/TipTap";
import RichTextViewer from "../../../Components/RichTextEditor/RichTextViewer";
import { useDropzone } from "react-dropzone";
import ImageViewer from "react-simple-image-viewer";

export default function AddPostForm() {
  const [file, setfile] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = () => {
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };
  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0]; // Take only the first file
    if (uploadedFile) {
      setfile(
        Object.assign(uploadedFile, {
          preview: URL.createObjectURL(uploadedFile),
        })
      );
    }
  }, []);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    multiple: false,
  });

  const [htmlContent, setHtmlContent] = useState("");
  function getEditorContent(richText) {
    setHtmlContent(richText);
    console.log(richText);
  }
  console.log(file.preview);

  return (
    <div className="ml-8 max-w-2xl">
      <h1 className="font-bold text-slate-800 text-2xl mb-4">Add Post</h1>
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
        <div>
          <div className="container my-8">
            <div
              {...getRootProps({
                className: `flex-1 flex flex-col items-center p-4 border-2 rounded-md border-dashed border-gray-300 bg-gray-50 font-semibold hover:bg-gray-100 cursor-pointer
          ${isFocused ? "border-[#2196f3]" : ""} 
          ${isDragAccept ? "bg-[#00e676]" : ""}
          ${isDragReject ? "bg-[#ff1744] " : ""}
          `,
              })}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, JPEG or GIF
                </p>
              </div>
            </div>
          </div>
          {file && (
            <div>
              <div className=" border bg-slate-100 border-slate-200 w-60 h-60 m-auto">
                <img
                  className="h-full w-full object-contain"
                  src={file.preview}
                  alt={file.name}
                  onClick={() => openImageViewer()}
                  width="300"
                />
              </div>
            </div>
          )}
          {/* {isViewerOpen && (
            <ImageViewer
              backgroundStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark with some transparency
                cursor: "pointer",
              }}
              src={encodeURIComponent(file.preview)}
              currentIndex={0}
              disableScroll={false}
              closeOnClickOutside={true}
              onClose={closeImageViewer}
            />
          )} */}
        </div>
        <div className="text-center">
          <Button
            color="blue"
            className=" inline-block text-center ml-auto mt-4"
          >
            Submit
          </Button>
          <Button
            color="failure"
            className=" inline-block text-center ml-3 mt-4"
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}
