import React from "react";
import { Tooltip } from "flowbite-react";
export default function RTEButton({
  children,
  onClick,
  disabled,
  className,
  icon,
}) {
  return (
    <>
      <div className="m-1">
        <Tooltip
          className="text-xs hover:hidden "
          animation="duration-300"
          content={children}
        >
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`text-sm cursor-pointer font-medium bg-slate-200 hover:bg-slate-400 text-slate-800  rounded-md py-1 px-2 transition-colors duration-100 ${
              className ? "bg-slate-800 hover:bg-slate-900 text-white" : ""
            }`}
          >
            {icon}
          </button>
        </Tooltip>
      </div>
    </>
  );
}
