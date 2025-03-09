import { Popover } from "flowbite-react";
import React from "react";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export default function UpdateEvent() {
  return (
    <div className="ml-4">
      {" "}
      <Popover content={<PopMenu />}>
        <button className="rounded-full hover:bg-slate-200 p-2">
          <BsThreeDotsVertical />{" "}
        </button>
      </Popover>
    </div>
  );
}

function PopMenu() {
  return (
    <>
      <div className="shadow-2xl ">
        <div>
          <button className="w-full  flex items-center justify-start text-left py-2 px-5 hover:bg-slate-100">
            <MdEdit className="mr-2 text-lg" />
            <span className="font-medium">Edit</span>
          </button>
        </div>
        <div>
          <button className="w-full flex items-center justify-center text-left py-2 px-5 hover:bg-slate-100">
            <MdDelete className="mr-2 text-lg" />
            <span className="font-medium">Delete</span>
          </button>
        </div>
      </div>
    </>
  );
}
