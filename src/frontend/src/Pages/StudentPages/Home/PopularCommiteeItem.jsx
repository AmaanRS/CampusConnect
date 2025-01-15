import { Avatar } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
export default function PopularCommiteeItem() {
  return (
    <li>
      <Link>
        <div className=" hover:bg-slate-200 rounded-lg flex py-2     px-2 mx-2 my-2">
          <Avatar
            rounded
            size="sm"
            img="https://shorturl.at/rUYLE"
            className="mr-2"
          />
          <div>
            <p className="align-middle text-sm text-gray-700 font-medium">
              Commitee Name
            </p>
            <p className="text-xs text-gray-600">1,47,328 Followers</p>
          </div>
        </div>
      </Link>
    </li>
  );
}
