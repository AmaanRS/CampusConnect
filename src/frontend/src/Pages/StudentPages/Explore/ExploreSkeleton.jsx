import { Avatar } from "flowbite-react";
import React from "react";
import AllCommitteeItem from "./AllCommitteeItem";

export default function ExploreSkeleton() {
  return (
    <div>
      <div className="mx-2 animate-pulse">
        <div className="mb-6 text-3xl font-bold h-9 w-80 rounded-md bg-slate-100"></div>
        <div className=" grid grid-cols-3  gap-4">
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
      <div className="border   transition-colors duration-200 p-2 rounded-xl bg-slate-50 border-slate-100">
        <div className="flex w-full justify-between">
          <div className="flex">
            <div className="h-10 w-10 rounded-full bg-slate-200"></div>
            <div className="ml-3">
              <p className="rounded-md bg-slate-200 h-4 w-20"></p>
              <div className="flex my-1">
                <p className="rounded-md h-4 w-5 bg-slate-200 "></p>
                <p className=" ml-1 rounded-md h-4 w-16 bg-slate-200 "></p>
              </div>
            </div>
          </div>
          <div>
            <div className=" bg-slate-200 py-1 px-2 rounded-full w-16 h-7"></div>
          </div>
        </div>
        <div className="mt-2">
          <div className="h-4 w-full bg-slate-200 rounded-md"></div>
          <div className="mt-1.5 h-4 w-9/12 bg-slate-200 rounded-md"></div>
        </div>
      </div>
    </>
  );
}
