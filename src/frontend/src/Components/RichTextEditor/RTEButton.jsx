import React from "react";

export default function RTEButton({ children, onClick, disabled, className }) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={` text-sm font-medium bg-slate-200 hover:bg-slate-600 hover:text-white  text-slate-800 m-1  rounded-md py-1 px-2 ${className}`}
      >
        {children}
      </button>
    </>
  );
}
