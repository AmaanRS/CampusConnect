import React from "react";
import { CiCalendar } from "react-icons/ci";
import { formatDistanceToNow } from "date-fns";
import Follow from "./Follow";

export default function CommitteeSidebarTop({
  name = "name",
  description = "description",
  createdAt = new Date(),
  committeeId,
}) {
  return (
    <div className="px-4 pt-4 ">
      <div className="flex justify-between items-center">
        <p className="font-bold  text-slate-800">{name}</p>
        <Follow committeeId={committeeId} />
      </div>
      <div className="text-sm mt-4 text-slate-700 ">{description}</div>
      <div className="flex my-2 items-center">
        <CiCalendar className="text-lg mr-1" />
        <p className="text-xs text-slate-700">
          {"created "}
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
