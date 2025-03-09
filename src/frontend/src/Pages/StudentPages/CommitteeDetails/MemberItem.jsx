import { Avatar, List } from "flowbite-react";
import React, { useContext } from "react";
import RemoveButton from "./RemoveButton";
import { UserContext } from "../../../store/UserContextProvider";

export default function MemberItem({ member, committeeId }) {
  const {
    userState: { email },
  } = useContext(UserContext);
  const isIncharge = email == member?.email;
  return (
    <div>
      <List.Item className=" pb-2 pt-3">
        <div className="flex items-center space-x-4">
          <Avatar rounded size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {member?.email?.split(".")[0]}
            </p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              {member?.email}
            </p>
          </div>
          {!isIncharge && (
            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
              <RemoveButton
                committeeId={committeeId}
                memberEmail={[member?.email]}
              />
            </div>
          )}
        </div>
      </List.Item>
    </div>
  );
}
