import React from "react";
import EmptyBox from "../../../../assets/empty-box.png";

export default function EmptyComment() {
  return (
    <div className="h-32 flex items-center justify-center">
      <div className="flex items-center">
        <img className=" w-20" src={EmptyBox} alt="" />
        <div className="mt-6 text-sm text-slate-500 font-medium">
          No Comments yet
        </div>
      </div>
    </div>
  );
}
