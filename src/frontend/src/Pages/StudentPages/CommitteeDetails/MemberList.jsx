import { Avatar, List } from "flowbite-react";
import React from "react";
import MemberItem from "./MemberItem";

export default function MemberList({ members = [] }) {
  console.log(members[0]);
  return (
    <List
      unstyled
      className=" m-3 divide-y divide-gray-200 dark:divide-gray-700"
    >
      {members?.map((member) => (
        <MemberItem member={member} key={member?._id} />
      ))}
    </List>
  );
}
