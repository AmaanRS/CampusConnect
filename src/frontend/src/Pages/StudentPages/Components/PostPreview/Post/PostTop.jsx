import { Avatar } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function PostTop({
  mode = "home",
  committeeId = "",
  createdAt = new Date(),
  subname = "subname",
  username = "username",
}) {
  return (
    <>
      <div className="flex text-neutral-600 items-center">
        <div>
          <Avatar rounded size={"xs"} />
        </div>
        {mode === "home" && (
          <Link to={`/student/committee/${committeeId || 1}`}>
            <div className="text-xs font-semibold ml-2 hover:text-blue-500 transition-colors duration-150">
              {subname}
            </div>
          </Link>
        )}

        {mode === "committee" && (
          <div className="text-xs font-semibold ml-2  transition-colors duration-150">
            {username}
          </div>
        )}

        <div className="h-[4px] w-[4px] mx-2 rounded-full bg-neutral-500"></div>
        <div className="text-xs">
          {" "}
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </div>
      </div>
    </>
  );
}
