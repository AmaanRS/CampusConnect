import { Avatar } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
export default function PopularCommiteeItem({
  name = "committee name",
  total = 10,
}) {
  return (
    <li>
      <Link to={"/student"}>
        <div className=" hover:bg-slate-200 transition-colors duration-100 rounded-lg flex py-2     px-2 mx-2 my-2">
          <Avatar
            rounded
            size="sm"
            // img="https://shorturl.at/rUYLE"
            className="mr-2 border-[2px] rounded-full"
          />
          <div>
            <p className="align-middle text-sm text-gray-700 font-medium">
              {name}
            </p>
            <p className="text-xs text-gray-600">{total} Followers</p>
          </div>
        </div>
      </Link>
    </li>
  );
}
