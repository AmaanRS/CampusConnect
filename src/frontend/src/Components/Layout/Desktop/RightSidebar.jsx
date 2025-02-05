import React from "react";

export default function RightSidebar({ children }) {
  return (
    <>
      <div
        style={{
          scrollbarGutter: "stable",
        }}
        className=" custom-scrollbar overflow-hidden  hover:overflow-auto fixed top-[52.4px] right-0 h-screen w-72 bg-white hidden sm:block"
      >
        {children || (
          <>
            <div className="h-screen border-l">
              <h2 className="text-xl font-bold mb-4">Popular Committees</h2>
              <ul>
                <li className="mb-2">Committee 1</li>
                <li className="mb-2">Committee 2</li>
                <li className="mb-2">Committee 3</li>
                <li className="mb-2">Committee 4</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </>
  );
}
