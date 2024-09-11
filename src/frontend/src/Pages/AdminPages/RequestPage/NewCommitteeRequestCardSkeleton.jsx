import { Card } from "flowbite-react";
import React from "react";

export default function NewCommitteeRequestCardSkeleton() {
  return (
    <Card className=" max-w-lg bg-slate-50  shadow-lg rounded-lg overflow-hidden ">
      <div className="text h-8 w-56 rounded-md  animate-pulse bg-slate-200  mb-1">
        {/* {item.name} */}
      </div>

      <div className=" max-h-60 md:h-40 mb-2 ">
        {/* {item.description} */}
        <div className="h-4 rounded-md mb-2 animate-pulse w-full bg-slate-200 "></div>
        <div className="h-4 rounded-md mb-2 animate-pulse w-full bg-slate-200 "></div>
        <div className="h-4 rounded-md mb-2 animate-pulse w-full bg-slate-200 "></div>
        <div className="h-4 rounded-md mb-2 animate-pulse w-full bg-slate-200 "></div>
        <div className="h-4 rounded-md mb-2 animate-pulse w-1/2 bg-slate-200 "></div>
      </div>

      <div className="mb-2">
        <div className="h-4 w-36 animate-pulse bg-slate-200 rounded-md">
          {/* Departments: */}
        </div>
        <div className="mt-1 flex flex-wrap">
          <div className="bg-slate-200 animate-pulse  px-3 py-1 mx-1 my-1 rounded-full h-5 w-16">
            {/* {dep} */}
          </div>
          <div className="bg-slate-200 animate-pulse  px-3 py-1 mx-1 my-1 rounded-full h-5 w-16"></div>
        </div>
      </div>

      <div className="flex space-x-3">
        <div className="bg-slate-200 h-10 w-28 animate-pulse rounded-lg">
          {/* Accept */}
        </div>

        <div className="bg-slate-200 h-10 w-28 animate-pulse rounded-lg">
          {/* Reject */}
        </div>
      </div>
    </Card>
  );
}
