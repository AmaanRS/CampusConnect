import React from "react";
import { Outlet } from "react-router-dom";

export default function OutletComponent() {
  return (
    // <div className={` min-h-screen mb-16 w-1/2 md:mb-0 sm:ml-72 `}>
    <div className=" min-h-screen mb-16 w-full sm:w-1/2 md:mb-0 sm:ml-72  p-6">
      <Outlet />
    </div>
  );
}
