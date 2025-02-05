import React from "react";
import EmptyBox from "../../../../assets/empty-box.png";

export default function EmptyComment() {
  return (
    <div className="h-40 flex items-center justify-center">
      <div className="flex-row justify-center  items-center">
        <img className=" w-24 ml-3" src={EmptyBox} alt="" />
        <div className=" text-sm text-slate-500 font-medium">
          No Comments yet
        </div>
      </div>
    </div>
  );
}
