import { Avatar } from "flowbite-react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import UpdatePost from "./UpdatePost";
import { UserContext } from "../../../../../store/UserContextProvider";
import { AccountType } from "../../../../../utils/enum";

export default function PostTop({
  mode = "home",
  committeeId = "",
  createdAt = new Date(),
  subname = "subname",
  username = "username",
  isIncharge,
  postId,
}) {
  const {
    userState: { accountType },
  } = useContext(UserContext);

  let link = "";
  if (accountType == "STUDENT") {
    link = `/student/committee/${committeeId || 1}`;
  } else if (accountType == AccountType.Admin) {
    link = `/admin/committee/${committeeId || 1}`;
  } else {
    link = `/teacher/committee/${committeeId || 1}`;
  }

  return (
    <>
      <div className="flex text-neutral-600 items-center">
        <div>
          <Avatar rounded size={"xs"} />
        </div>
        {mode === "home" && (
          <Link to={link}>
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
        {isIncharge && (
          <div className="ml-auto">
            <UpdatePost committeeId={committeeId} postId={postId} />
          </div>
        )}
      </div>
    </>
  );
}
