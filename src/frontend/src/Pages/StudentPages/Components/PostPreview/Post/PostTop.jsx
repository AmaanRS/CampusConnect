import { Avatar } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function PostTop() {
  return (
    <>
      <div className="flex text-neutral-600 items-center">
        <div>
          <Avatar rounded size={"xs"} />
        </div>
        <Link to={"/student/committee/1"}>
          <div className="text-xs font-semibold ml-2 hover:text-blue-500 transition-colors duration-150">
            subname
          </div>
        </Link>
        <div className="h-[4px] w-[4px] mx-2 rounded-full bg-neutral-500"></div>
        <div className="text-xs">10 min ago</div>
      </div>
    </>
  );
}
