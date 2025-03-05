import React from "react";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import AllEvents from "./AllEvents";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import PopularCommittees from "../Home/PopularCommittee/PopularCommittees";

export default function AllEventsLayout() {
  return (
    <>
      <CentreMainContent>
        <AllEvents />
      </CentreMainContent>
      <RightSidebar>
        <PopularCommittees />
      </RightSidebar>
    </>
  );
}
