import { Dropdown, Tabs } from "flowbite-react";
import React from "react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import RichTextEditor from "../../../Components/RichTextEditor/RichTextEditor";
import Tiptap from "./TipTap";

export default function AddPostForm() {
  return (
    <div className="m-auto max-w-2xl">
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
            {/* <RichTextEditor /> */}
            <div>
              <Tiptap />
            </div>
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
