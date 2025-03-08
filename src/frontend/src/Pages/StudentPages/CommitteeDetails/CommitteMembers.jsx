import React from "react";
import AddMembers from "./AddMembers";

export default function CommitteMembers({ committeeId }) {
  return (
    <div>
      <AddMembers committeeId={committeeId} />
    </div>
  );
}
