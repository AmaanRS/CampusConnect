import React from "react";

export default function RightSidebar() {
  return (
    <>
      <div className=" custom-scrollbar overflow-auto fixed top-0 right-0 h-screen w-72 bg-white border-l-[1px] p-4 hidden sm:block">
        <h2 className="text-xl font-bold mb-4">Popular Committees</h2>
        <ul>
          <li className="mb-2">Committee 1</li>
          <li className="mb-2">Committee 2</li>
          <li className="mb-2">Committee 3</li>
          <li className="mb-2">Committee 4</li>
        </ul>
      </div>
    </>
  );
}
