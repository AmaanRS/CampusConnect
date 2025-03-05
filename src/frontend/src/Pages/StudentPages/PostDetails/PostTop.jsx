import { Avatar } from "flowbite-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { formatDistanceToNow } from "date-fns";

export default function PostTop({
  subname = "subname",
  username = "username",
  createdAt = new Date(),
  committeeId,
}) {
  return (
    <>
      <div className="flex  text-neutral-800  h-8 00 items-center">
        <div>
          <BackButton />
        </div>

        <div>
          <Avatar rounded size="sm" />
        </div>

        <div className="flex-col ml-2 ">
          <div className="flex h-4 items-center gap-1 ">
            <Link to={`/student/committee/${committeeId || 1}`}>
              <div className="text-xs font-bold transition-colors duration-150  hover:text-blue-500">
                {subname}
              </div>
            </Link>
            <div className="h-[0.25rem] w-[0.25rem]  rounded-full bg-neutral-500"></div>
            <div className="text-xs text-neutral-600">
              {" "}
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </div>
          </div>
          <div className="h-4 ml  text-xs">{username}</div>
        </div>
      </div>
    </>
  );
}
