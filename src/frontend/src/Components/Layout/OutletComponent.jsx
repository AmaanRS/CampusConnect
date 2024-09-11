import React from "react";
import { Outlet } from "react-router-dom";

export default function OutletComponent({ globalOpen }) {
  return (
    <div
      className={` min-h-screen mb-16 md:mb-0 ${
        globalOpen ? "sm:ml-72" : "sm:ml-20"
      } `}
    >
      <Outlet />
    </div>
  );
}
