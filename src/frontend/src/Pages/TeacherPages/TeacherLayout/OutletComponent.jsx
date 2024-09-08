import React from "react";
import { Outlet } from "react-router-dom";

export default function OutletComponent({ globalOpen }) {
  return (
    <div className={` ${globalOpen ? "sm:ml-72" : "sm:ml-20"} `}>
      <Outlet />
    </div>
  );
}
