import React from "react";

export default function CommitteeSidebarDepartment() {
  return (
    <div className="px-4 text-slate-700">
      <div className="text-sm font-medium mb-2">Department</div>
      <div className="flex text-xs gap-2">
        <div className="bg-slate-200 px-2 py-1 rounded-full text-slate-800 ">
          IT
        </div>
        <div className="bg-slate-200 px-2 py-1 rounded-full text-slate-800 ">
          COMPS
        </div>
        <div className="bg-slate-200 px-2 py-1 rounded-full text-slate-800 ">
          CSE
        </div>
      </div>
    </div>
  );
}
