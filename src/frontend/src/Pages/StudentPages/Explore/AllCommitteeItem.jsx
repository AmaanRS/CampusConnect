import { Avatar } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function AllCommitteeItem({ item }) {
  console.log(item);
  return (
    <div className="border hover:bg-slate-50 cursor-pointer transition-colors duration-200 p-4 rounded-xl border-slate-300 shadow-sm hover:shadow-lg">
      <div className="flex w-full justify-between">
        <div className="flex items-center">
          <Avatar className="text-slate-400" size={"md"} rounded />
          <div className="ml-4 min-w-0">
            <p className="font-semibold text-sm text-slate-800 hover:text-blue-700">
              {item?.name}
            </p>
            <p className="text-xs text-slate-500">
              {item?.facultyTeam?.length + item?.members?.length} members
            </p>
          </div>
        </div>

        {/* follow button */}
        <div>
          <button
            type="button"
            className="bg-blue-700 hover:bg-blue-800 font-medium text-sm py-2 px-4 rounded-full text-white transition-colors duration-200"
          >
            Follow
          </button>
        </div>
      </div>
      <div className="line-clamp-2 mt-3 text-xs text-slate-600 font-normal">
        {item?.description}
      </div>
    </div>
  );
}
