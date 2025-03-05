import { Avatar, List, Button } from "flowbite-react";
import React from "react";
import TeacherImg from "../../../assets/Dummy/user.png";

export default function StudentItem({ email }) {
  console.log("email is ", email);
  let [name] = email?.split(".");
  return (
    <List.Item className="py-3 sm:py-2">
      <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg    transition-transform transform hover:scale-105 ">
        <Avatar img={TeacherImg} alt="Thomas Lean" rounded size="sm" />
        <div className="min-w-0 flex-1 pl-4">
          <p className="truncate text-lg font-semibold text-gray-900 dark:text-white">
            {name}
          </p>
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
            {email}
          </p>
        </div>
        <div className="inline-flex flex-col items-end">
          <Button
            size="sm"
            color="white"
            className="text-blue-500  "
            // onClick={() => alert("View Details")}
          >
            View Details
          </Button>
        </div>
      </div>
    </List.Item>
  );
}
