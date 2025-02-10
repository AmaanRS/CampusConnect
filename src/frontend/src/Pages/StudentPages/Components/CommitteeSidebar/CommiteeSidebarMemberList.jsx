import React from "react";
import { Avatar } from "flowbite-react";

export default function CommiteeSidebarMemberList({
  facultyTeam = [],
  members = [],
}) {
  console.log(facultyTeam, members);

  return (
    <div className="px-4 mb-4">
      <p className="text-sm font-medium text-slate-700  mb-2">Members</p>
      <div>
        <MemberList />
        <MemberList />
      </div>
    </div>
  );
}

function MemberList() {
  return (
    <div className="flex py-1 px-1 rounded-lg transition-colors duration-200 my-1 items-center hover:bg-slate-200">
      <Avatar rounded size="xs" />
      <div className="text-slate-700 text-xs ml-2 font-medium">Username</div>
    </div>
  );
}
