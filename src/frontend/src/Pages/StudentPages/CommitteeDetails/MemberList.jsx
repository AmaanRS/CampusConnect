import { Avatar, List } from "flowbite-react";
import React from "react";
import MemberItem from "./MemberItem";

export default function MemberList({ members = [], committeeId }) {
  return (
    <List
      unstyled
      className=" m-3 divide-y divide-gray-200 dark:divide-gray-700"
    >
      {members?.map((member) => (
        <MemberItem
          committeeId={committeeId}
          member={member}
          key={member?._id}
        />
      ))}
    </List>
  );
}
