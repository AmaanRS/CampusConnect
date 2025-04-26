import React from "react";
import EmptyBox from "../../../../assets/empty-box.png";

export default function EmptyComment({ type = "comment" }) {
  return (
    <div className="h-40 flex items-center justify-center">
      <div className="flex-row justify-center  items-center">
        <img className=" w-24 m-auto" src={EmptyBox} alt="" />
        <div className=" text-sm text-center text-slate-500 font-medium">
          No {type}
        </div>
      </div>
    </div>
  );
}
