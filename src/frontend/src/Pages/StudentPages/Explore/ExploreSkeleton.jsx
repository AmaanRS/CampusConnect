import React from "react";

export default function ExploreSkeleton() {
  return (
    <div>
      <div className="mx-2 animate-pulse">
        <div className="mb-7 text-3xl font-bold h-10  w-80 rounded-md bg-slate-100"></div>
        <div className=" grid sm:grid-cols-3  gap-4">
          <CommitteSkeleton />
          <CommitteSkeleton />
          <CommitteSkeleton />
          <CommitteSkeleton />
          <CommitteSkeleton />
          <CommitteSkeleton />
        </div>
      </div>
    </div>
  );
}

function CommitteSkeleton() {
  return (
    <>
      <div className="border   transition-colors duration-200 p-4 rounded-xl border-slate-200 shadow-sm ">
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <div className="bg-slate-200 h-10 w-10 rounded-full"></div>
            <div className="ml-4 min-w-0">
              <p className="bg-slate-200 rounded-md h-5 w-20 "></p>
              <p className="bg-slate-200 rounded-md h-3 w-16 mt-1 "></p>
            </div>
          </div>

          {/* follow button */}
          <div>
            <div className="bg-slate-200 h-8 py-2 w-20  rounded-full  transition-colors duration-200 "></div>
          </div>
        </div>
        <div className="line-clamp-2 mt-3 text-xs text-slate-600 font-normal">
          <div className="h-4 w-full bg-slate-200 rounded-full"></div>
          <div className="mt-1 h-4 w-1/2 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </>
  );
}
