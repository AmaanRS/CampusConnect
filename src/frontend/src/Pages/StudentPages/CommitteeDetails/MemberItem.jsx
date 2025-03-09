import { Avatar, List } from "flowbite-react";
import React from "react";
import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";

export default function MemberItem({ member }) {
  console.log(member);
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
          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 flex justify-center items-center text-white py-1.5 px-2 rounded-lg text-xs  "
            >
              <MdOutlinePersonRemoveAlt1 className="text-lg mr-1 font-bold" />
              Remove
            </button>
          </div>
        </div>
      </List.Item>
    </div>
  );
}
