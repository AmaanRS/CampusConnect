import React from "react";
import { useParams } from "react-router-dom";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import PostDetails from "./PostDetails";
import CommitteeSidebar from "../Components/CommitteeSidebar/CommitteeSidebar";

export default function PostDetailsLayout() {
  const { postId } = useParams();
  console.log(postId);

  return (
    <>
      <CentreMainContent>
        <PostDetails />
      </CentreMainContent>
      <RightSidebar>
        <CommitteeSidebar />
      </RightSidebar>
    </>
  );
}
