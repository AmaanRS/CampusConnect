import { Avatar } from "flowbite-react";
import React from "react";

export default function AllCommitteeItem({ item }) {
  console.log(item);
  return (
    <div className="border hover:bg-slate-50 cursor-pointer transition-colors duration-200 p-2 rounded-xl border-slate-300">
      <div className="flex w-full justify-between">
        <div className="flex">
          <Avatar className="text-slate-400" size={"md"} rounded />
          <div className="ml-3 min-w-0">
            <p className="font-bold   text-sm text-slate-700">{item?.name}</p>

            <p className="text-xs text-slate-600">
              {item?.facultyTeam?.length + item?.members?.length} members
            </p>
          </div>
        </div>
        <div>
          <button
            type="button"
            className=" bg-blue-800 hover:bg-blue-900 font-medium text-sm py-1 px-2 rounded-full text-white"
          >
            Follow
          </button>
        </div>
      </div>
      <div className="line-clamp-2 font- text-xs mt-2 text-slate-600">
        {item?.description}
      </div>
    </div>
  );
}
