import React from "react";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import AllEvents from "../../StudentPages/AllEvents/AllEvents";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import PopularCommittees from "../../StudentPages/Home/PopularCommittee/PopularCommittees";

export default function AllEventLayout() {
  return (
    <>
      <CentreMainContent>
        <AllEvents />
      </CentreMainContent>
      {/* <RightSidebar>
        <PopularCommittees />
      </RightSidebar> */}
    </>
  );
}
