import { Avatar } from "flowbite-react";
import React from "react";

export default function StudentPost() {
  return (
    <>
      <div className="mx-2 ">
        <div className="flex text-neutral-600 items-center">
          <div>
            <Avatar rounded size={"xs"} />
          </div>
          <div className="text-xs font-semibold ml-2">subname</div>
          <div className="h-[4px] w-[4px] mx-2 rounded-full bg-neutral-500"></div>
          <div className="text-xs">10 min ago</div>
        </div>
      </div>
      <hr className="my-2 mx-1" />
    </>
  );
}
