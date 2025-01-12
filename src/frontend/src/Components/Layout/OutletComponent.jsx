import React from "react";
import { Outlet } from "react-router-dom";

export default function OutletComponent() {
  return (
    <div className={` min-h-screen mb-16 md:mb-0 sm:ml-72 `}>
      <Outlet />
    </div>
  );
}
