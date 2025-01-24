import React from "react";

export default function RTEButton({ children, onClick, disabled, className }) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={` text-sm font-semibold bg-zinc-200 m-1  rounded-md py-0.5 px-1 ${className}`}
      >
        {children}
      </button>
    </>
  );
}
