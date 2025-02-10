import React from "react";
import CommitteeSidebarTop from "./CommitteeSidebarTop";
import CommitteSidebarQuant from "./CommitteSidebarQuant";
import CommitteeSidebarDepartment from "./CommitteeSidebarDepartment";
import CommiteeSidebarMemberList from "./CommiteeSidebarMemberList";

export default function CommitteeSidebar({ committeeData }) {
  console.log(committeeData);
  return (
    <div className=" bg-slate-50  py-2 mt-4   rounded-lg">
      <CommitteeSidebarTop
        name={committeeData?.name}
        description={committeeData?.description}
        createdAt={committeeData?.createdAt}
      />
      <CommitteSidebarQuant />
      <hr className="my-4 border-slate-300 rounded-full mx-4" />
      <CommitteeSidebarDepartment
        committeeOfDepartment={committeeData?.committeeOfDepartment}
      />
      <hr className="my-4 border-slate-300 rounded-full mx-4" />
      <CommiteeSidebarMemberList
        facultyTeam={committeeData?.facultyTeam}
        members={committeeData?.members}
      />
    </div>
  );
}
