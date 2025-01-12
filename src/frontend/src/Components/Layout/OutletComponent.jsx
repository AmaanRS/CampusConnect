import React from "react";
import { Outlet } from "react-router-dom";

export default function OutletComponent() {
  return (
    // <div className={` min-h-screen mb-16 w-1/2 md:mb-0 sm:ml-72 `}>
    // <div className=" min-h-screen mb-16 w-full sm:w-1/2 md:mb-0 sm:ml-72  p-6">
    // <div className="border-2 border-black col-span-6 bg-white p-6">
    <div className="flex-1 p-6 sm:ml-72 sm:mr-72 bg-white  min-h-screen overflow-y-auto">
      <Outlet />
    </div>
  );
}
