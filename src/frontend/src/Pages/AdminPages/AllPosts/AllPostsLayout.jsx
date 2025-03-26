import React from "react";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import StudentHome from "../../StudentPages/Home/StudentHome";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import PopularCommittees from "../../StudentPages/Home/PopularCommittee/PopularCommittees";

export default function AllPostsLayout() {
  return (
    <>
      <CentreMainContent>
        <StudentHome />
      </CentreMainContent>
      <RightSidebar>
        <PopularCommittees />
      </RightSidebar>
    </>
  );
}
