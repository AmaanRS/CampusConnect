import { Dropdown, Tabs } from "flowbite-react";
import React, { useState } from "react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import TipTap from "../../../Components/RichTextEditor/TipTap";
import RichTextViewer from "../../../Components/RichTextEditor/RichTextViewer";

export default function AddPostForm() {
  const [htmlContent, setHtmlContent] = useState("");
  function getEditorContent(richText) {
    setHtmlContent(richText);
  }

  return (
    <div className="ml-16 max-w-2xl">
      <h1>Create Post</h1>

      <form>
        <Dropdown label="Dropdown button" dismissOnClick={false}>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
        <Tabs aria-label="Default tabs" variant="default">
          <Tabs.Item active title="Profile" icon={HiUserCircle}>
            <div>
              <TipTap getEditorContent={getEditorContent} />
            </div>
            <RichTextViewer htmlContent={htmlContent} />
          </Tabs.Item>
          <Tabs.Item title="Dashboard" icon={MdDashboard}>
            This is{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              Dashboard tab's associated content
            </span>
            . Clicking another tab will toggle the visibility of this one for
            the next. The tab JavaScript swaps classes to control the content
            visibility and styling.
          </Tabs.Item>
        </Tabs>
      </form>
    </div>
  );
}
