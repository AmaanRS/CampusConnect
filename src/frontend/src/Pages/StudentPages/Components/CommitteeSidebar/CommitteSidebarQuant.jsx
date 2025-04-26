import React from "react";

export default function CommitteSidebarQuant({ members = 0, followers = 0 }) {
  return (
    <div className="px-4 flex justify-between">
      <div className="flex-col text-sm justify-center items-center">
        <div className="font-bold text-center">{members}</div>
        <div className="text-xs">Members</div>
      </div>

      <div className="flex-col  text-sm justify-center items-center">
        <div className="font-bold text-center"> {followers} </div>
        <div className="text-xs">Followers</div>
      </div>

      <div className="flex-col invisible text-sm justify-center items-center">
        <div className="font-bold text-center">10</div>
        <div className="text-xs">Members</div>
      </div>
    </div>
  );
}
