import React from "react";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import CommitteeSidebar from "../Components/CommitteeSidebar/CommitteeSidebar";
import CommitteeList from "./CommitteeList";

export default function CommitteeDetailLayout() {
  return (
    <>
      <CentreMainContent>
        <CommitteeList />
      </CentreMainContent>
      <RightSidebar>
        <CommitteeSidebar />
      </RightSidebar>
    </>
  );
}
