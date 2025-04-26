import React from "react";

export default function CommitteeSidebarDepartment({
  committeeOfDepartment = [],
}) {
  return (
    <div className="px-4 text-slate-700">
      <div className="text-sm font-medium mb-2">Department</div>
      <div className="flex text-xs gap-2">
        {committeeOfDepartment.map((department) => {
          return (
            <div
              key={department}
              className="bg-slate-200 px-2 py-1 rounded-full text-slate-800 "
            >
              {department}
            </div>
          );
        })}
      </div>
    </div>
  );
}
