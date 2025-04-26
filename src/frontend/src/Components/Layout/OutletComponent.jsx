import React from "react";
import { Outlet } from "react-router-dom";

export default function OutletComponent() {
  return (
    <div className="flex-1 md:p-6 pb-28 pt-4 sm:pt-6 sm:pb-6  md:ml-72 bg-white  min-h-screen overflow-y-auto">
      <Outlet />
    </div>
  );
}
