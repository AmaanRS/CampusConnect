import React from "react";
import CommitteeSidebarTop from "./CommitteeSidebarTop";
import CommitteSidebarQuant from "./CommitteSidebarQuant";
import CommitteeSidebarDepartment from "./CommitteeSidebarDepartment";
import CommiteeSidebarMemberList from "./CommiteeSidebarMemberList";

export default function CommitteeSidebar() {
  return (
    <div className=" bg-slate-50  py-2 mt-4   rounded-lg">
      <CommitteeSidebarTop />
      <CommitteSidebarQuant />
      <hr className="my-4 border-slate-300 rounded-full mx-4" />
      <CommitteeSidebarDepartment />
      <hr className="my-4 border-slate-300 rounded-full mx-4" />
      <CommiteeSidebarMemberList />
    </div>
  );
}
