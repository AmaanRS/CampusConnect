import React from "react";
import AddMembers from "./AddMembers";
import MemberList from "./MemberList";
import { HR } from "flowbite-react";

export default function CommitteMembers({
  committeeId,
  members,
  studentIncharge,
}) {
  return (
    <div>
      <AddMembers committeeId={committeeId} />
      <HR className="my-6" />
      <div className="m-3">
        <p className="font-medium text-lg  text-slate-700">Committee Members</p>
        <MemberList
          studentIncharge={studentIncharge}
          committeeId={committeeId}
          members={members}
        />
      </div>
    </div>
  );
}
