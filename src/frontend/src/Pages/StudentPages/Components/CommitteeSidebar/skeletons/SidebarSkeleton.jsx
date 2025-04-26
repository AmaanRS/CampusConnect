import React from "react";
import { CiCalendar } from "react-icons/ci";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "flowbite-react";

export default function SidebarSkeleton() {
  return (
    <>
      <div className=" bg-slate-50 animate-pulse  py-2 mt-4   rounded-lg">
        {/* top bar */}
        <>
          <div className="px-4 pt-4 ">
            <div className="flex justify-between items-center">
              <p className="font-bold w-28 bg-slate-200 h-6 rounded-md  text-slate-800"></p>
              <div className=" text-slate-800 font-medium text-xs border-slate-700  rounded-full px-3 py-1.5 w-16 h-7 bg-slate-200  "></div>
            </div>
            <div className="h-4 mt-4 w-full bg-slate-200 rounded-md "></div>
            <div className="h-4 mt-1.5 w-full bg-slate-200 rounded-md "></div>
            <div className="h-4 mt-1.5  w-1/3 bg-slate-200 rounded-md "></div>

            <div className="flex my-2 items-center">
              <div className="h-4 w-4 bg-slate-200 mr-1 rounded-md"></div>
              <p className="h-3 ml-1 w-24 bg-slate-200 rounded-md"></p>
            </div>
          </div>
        </>
        {/* quant */}
        <>
          <div className="px-4 flex justify-between">
            <div className="flex-col justify-center items-center">
              <div className="w-6 h-4 ml-5 bg-slate-200 rounded-md"></div>
              <div className="mt-1 h-3 w-16 bg-slate-200 rounded-md"></div>
            </div>

            <div className="flex-col justify-center items-center">
              <div className="w-6 h-4 ml-5 bg-slate-200 rounded-md"></div>
              <div className="mt-1 h-3 w-16 bg-slate-200 rounded-md"></div>
            </div>

            <div className="flex-col invisible text-sm justify-center items-center">
              <div className="font-bold text-center">10</div>
              <div className="text-xs">Members</div>
            </div>
          </div>
        </>
        <hr className="my-4 border-slate-200 rounded-full mx-4" />
        {/* department */}
        <>
          <div className="px-4 text-slate-700">
            <div className="h-5 rounded-full w-24 bg-slate-200 mb-2"></div>
            <div className="flex text-xs gap-2">
              <div className="bg-slate-200 px-2 py-1 rounded-full h-4 w-14  "></div>
              <div className="bg-slate-200 px-2 py-1 rounded-full h-4 w-14  "></div>
              <div className="bg-slate-200 px-2 py-1 rounded-full h-4 w-14  "></div>
            </div>
          </div>
        </>
        <hr className="my-4 border-slate-200 rounded-full mx-4" />
        {/* member list */}
        <>
          <div className="px-4 mb-4">
            <p className="h-5 w-24 rounded-full bg-slate-200  mb-2"></p>
            <div>
              <div className="flex py-1 px-1 rounded-lg transition-colors duration-200 my-1 items-center ">
                <div className="h-6 w-6 rounded-full bg-slate-200"></div>
                <div className="w-36 h-5 bg-slate-200 rounded-md ml-2"></div>
              </div>
              <div className="flex py-1 px-1 rounded-lg transition-colors duration-200 my-1 items-center ">
                <div className="h-6 w-6 rounded-full bg-slate-200"></div>
                <div className="w-36 h-5 bg-slate-200 rounded-md ml-2"></div>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
}
