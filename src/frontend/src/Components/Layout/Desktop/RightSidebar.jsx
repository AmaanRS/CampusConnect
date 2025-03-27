import React from "react";

export default function RightSidebar({ children }) {
  return (
    <>
      <div
        style={{
          scrollbarGutter: "stable",
        }}
        className=" custom-scrollbar overflow-hidden  hover:overflow-auto  fixed top-[52.4px] right-0 h-screen w-72 bg-white hidden sm:block pb-14"
      >
        {children || <></>}
      </div>
    </>
  );
}
