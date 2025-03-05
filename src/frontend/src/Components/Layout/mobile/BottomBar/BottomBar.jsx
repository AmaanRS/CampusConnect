import React from "react";

export default function BottomBar({ isDrawerOpen, children }) {
  return (
    <>
      <div
        className={`${
          isDrawerOpen ? "hidden" : "fixed"
        } sm:hidden  z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600`}
      >
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
          {children}
        </div>
      </div>
    </>
  );
}
