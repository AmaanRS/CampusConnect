import { Accordion, Avatar } from "flowbite-react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";

export default function FollowingCommittee({ data }) {
  const {
    userState: { accountType },
  } = useContext(UserContext);
  return (
    <Accordion className="border-none">
      <Accordion.Panel>
        <Accordion.Title className="bg-white border-none outline-none shadow-none  ring-0 focus:ring-0 p-0  py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors duration-200 group hover:bg-indigo-50 text-gray-600">
          Following
        </Accordion.Title>

        <Accordion.Content className="p-0">
          {data?.data?.followingCommittees?.length == 0 && (
            <p className="relative flex items-center py-2 px-3 my-1 font-medium   text-gray-600">
              No Committees
            </p>
          )}

          {data?.data?.followingCommittees?.map((item) => {
            return (
              <Link
                key={item?._id}
                to={`/${accountType.toLowerCase()}/committee/${
                  item?.committeeId
                }`}
              >
                <div className=" relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors duration-200 group hover:bg-indigo-50 text-gray-600">
                  <Avatar rounded size={"sm"} />
                  <p className="ml-3">{item?.name}</p>
                </div>
              </Link>
            );
          })}
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
}
