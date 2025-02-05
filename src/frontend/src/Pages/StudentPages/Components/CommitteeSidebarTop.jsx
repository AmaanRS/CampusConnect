import React from "react";

export default function CommitteeSidebarTop() {
  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex justify-between items-center">
        <p className="font-bold  text-slate-800">Committee Name</p>
        <button
          type="button"
          className="border text-slate-800 font-medium text-xs border-slate-700 hover:border-slate-900 rounded-full px-3 py-1.5 hover:bg-slate-200 transition-colors duration-200  "
        >
          Follow
        </button>
      </div>
      <div className="text-sm mt-4 text-slate-700 ">
        Web development is the work involved in developing a website for the
        Internet (World Wide Web) or an intranet (a private network).[1] Web
        development can range from developing a simple single static page of
        plain text to complex web applications, electronic businesses, and
        social network services.
      </div>
    </div>
  );
}
