import { Avatar } from "flowbite-react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";

export default function CommitteeItem({ item }) {
  const {
    userState: { accountType },
  } = useContext(UserContext);
  return (
    <Link
      to={`/${accountType.toLowerCase()}/committee/${
        item?.committeeObjId?.committeeId
      }`}
    >
      <div className=" relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors duration-200 group hover:bg-indigo-50 text-gray-600">
        <Avatar rounded size={"sm"} />
        <p className="ml-3">{item?.committeeObjId?.name}</p>
      </div>
    </Link>
  );
}
