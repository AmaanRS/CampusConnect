import React from "react";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import PopularCommittees from "./PopularCommittee/PopularCommittees";
import StudentHome from "./StudentHome";

export default function StudentHomeLayout() {
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
