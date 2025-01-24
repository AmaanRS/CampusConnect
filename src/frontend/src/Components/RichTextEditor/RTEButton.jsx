import React from "react";

export default function RTEButton({
  children,
  onClick,
  disabled,
  className,
  icon,
}) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`text-sm cursor-pointer font-medium bg-slate-200 hover:bg-slate-400 text-slate-800 m-1 rounded-md py-1 px-2 transition-colors duration-100 ${
          className ? "bg-slate-800 hover:bg-slate-900 text-white" : ""
        }`}
      >
        {icon}
        {children}
      </button>
    </>
  );
}
