import React from "react";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import AddPostForm from "./AddPostForm";

export default function AddPost() {
  return (
    <>
      {/* <CentreMainContent> */}
      <AddPostForm />
      {/* </CentreMainContent> */}
      {/* <RightSidebar>
        <div className="h-full border-l-[1px] border-gray-300">
          Group Description
        </div>
      </RightSidebar> */}
    </>
  );
}
