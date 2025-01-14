import React from "react";
import { Outlet } from "react-router-dom";

export default function OutletComponent() {
  return (
    <div className="flex-1 p-6 sm:ml-72 sm:mr-72 bg-white  min-h-screen overflow-y-auto">
      <Outlet />
    </div>
  );
}
