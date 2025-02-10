import React from "react";

export default function CommitteSidebarQuant() {
  return (
    <div className="px-4 flex justify-between">
      <div className="flex-col text-sm justify-center items-center">
        <div className="font-bold text-center">2</div>
        <div className="text-xs">Members</div>
      </div>

      <div className="flex-col  text-sm justify-center items-center">
        <div className="font-bold text-center">2</div>
        <div className="text-xs">Followers</div>
      </div>

      <div className="flex-col invisible text-sm justify-center items-center">
        <div className="font-bold text-center">10</div>
        <div className="text-xs">Members</div>
      </div>
    </div>
  );
}
