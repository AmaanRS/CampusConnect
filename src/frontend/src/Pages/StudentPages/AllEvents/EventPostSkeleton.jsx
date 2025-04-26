import { Avatar } from "flowbite-react";
import React from "react";

export default function EventPostSkeleton() {
  return (
    <div className="mx-4 border my-3 animate-pulse bg-white hover:bg-slate-50 rounded-xl p-4 transition-all duration-200 shadow-md mb-6">
      {/* Post Header */}
      <div className="flex items-center gap-3 text-neutral-600">
        <div className="rounded-full h-8 w-8 bg-slate-200"></div>
        <div className="flex flex-col">
          <div className="text-sm h-4 w-32 rounded-md bg-slate-200"></div>
          <div className="text-xs h-4 bg-slate-200 mt-1 rounded-md w-20 "></div>
        </div>
      </div>

      {/* Post Title */}
      <h1 className="mt-2 bg-slate-200 h-6 w-60 rounded-md mb-3"></h1>

      {/* Post Body */}
      <div>
        <div className="bg-slate-200 h-4  rounded-md mb-2 mr-3"></div>
        <div className="bg-slate-200 h-4  rounded-md mb-2 mr-2"></div>
        <div className="bg-slate-200 h-4  rounded-md mb-2 mr-4"></div>
        <div className="bg-slate-200 h-4  rounded-md mb-2 mr-5"></div>
        <div className="bg-slate-200 h-4  rounded-md mb-2 mr-3"></div>
        <div className="bg-slate-200 w-1/2 h-4  rounded-md mb-2"></div>
      </div>

      {/* Event Details */}
      <div className="bg-slate-100 p-3 rounded-lg text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <p className="flex items-center gap-1">
            <span className="bg-slate-200 h-4 rounded-md w-4"></span>{" "}
            <span className="bg-slate-200 h-4 rounded-md w-11"></span>{" "}
            <span className="bg-slate-200 h-4 rounded-md w-20"></span>{" "}
          </p>
          <p className="flex items-center gap-1">
            <span className="bg-slate-200 h-4 rounded-md w-4"></span>{" "}
            <span className="bg-slate-200 h-4 rounded-md w-11"></span>{" "}
            <span className="bg-slate-200 h-4 rounded-md w-20"></span>{" "}
          </p>
          <p className="flex items-center gap-1">
            <span className="bg-slate-200 h-4 rounded-md w-4"></span>{" "}
            <span className="bg-slate-200 h-4 rounded-md w-10"></span>{" "}
            <span className="bg-slate-200 h-4 rounded-md w-14"></span>{" "}
            <span className="bg-slate-200 h-4 rounded-md w-14"></span>{" "}
          </p>
          <p className="flex items-center gap-1 col-span-2">
            <span className="bg-slate-200 h-4 rounded-md w-14"></span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
