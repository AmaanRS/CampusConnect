import React from "react";
import { HiAdjustments } from "react-icons/hi";

export default function BottomBarButton({ setIsDrawerOpen, iconCss }) {
  return (
    <button
      onClick={() => setIsDrawerOpen(true)}
      data-tooltip-target="tooltip-profile"
      type="button"
      className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
    >
      <HiAdjustments className={iconCss} size={25} />
      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
        More
      </span>
    </button>
  );
}
