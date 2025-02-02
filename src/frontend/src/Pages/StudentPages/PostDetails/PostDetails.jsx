import React from "react";
import { useParams } from "react-router-dom";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";

export default function PostDetails() {
  const { postId } = useParams();
  console.log(postId);

  return (
    <>
      <CentreMainContent>
        <p>hello world</p>
      </CentreMainContent>
      <RightSidebar></RightSidebar>
    </>
  );
}
