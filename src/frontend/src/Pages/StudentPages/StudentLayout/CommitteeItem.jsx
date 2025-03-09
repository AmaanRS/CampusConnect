import { Avatar } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function CommitteeItem({ item }) {
  return (
    <Link to={`/student/committee/${item?.committeeObjId?.committeeId}`}>
      <div className=" relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors duration-200 group hover:bg-indigo-50 text-gray-600">
        <Avatar rounded size={"sm"} />
        <p className="ml-3">{item?.committeeObjId?.name}</p>
      </div>
    </Link>
  );
}
