import { Avatar } from "flowbite-react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Follow from "./Follow";
import { UserContext } from "../../../store/UserContextProvider";

export default function AllCommitteeItem({ item }) {
  const {
    userState: { accountType },
  } = useContext(UserContext);
  return (
    <div className="border hover:bg-slate-50  transition-colors duration-200 p-4 rounded-xl border-slate-300 shadow-md hover:shadow-lg">
      <div className="flex w-full justify-between">
        <Link
          key={item?.committeeId}
          to={`/${accountType.toLowerCase()}/committee/${item?.committeeId}`}
        >
          <div className="flex items-center">
            <Avatar className="text-slate-400" size={"md"} rounded />
            <div className="ml-4 min-w-0">
              <p className="font-semibold text-sm text-slate-800 hover:text-blue-700">
                {item?.name}
              </p>
              <p className="text-xs text-slate-500">
                {!item?.followers && <>0 follower</>}
                {item?.followers?.length < 2 && (
                  <>{item?.followers?.length} follower</>
                )}
                {item?.followers?.length > 1 && (
                  <>{item?.followers?.length} followers</>
                )}
              </p>
            </div>
          </div>
        </Link>

        {/* follow button */}
        <Follow followArray={item?.followers} committeeId={item?.committeeId} />
      </div>
      <Link
        key={item?.committeeId}
        to={`/${accountType.toLowerCase()}/committee/${item?.committeeId}`}
      >
        <div className="line-clamp-2 mt-3 text-xs text-slate-600 font-normal">
          {item?.description}
        </div>
      </Link>
    </div>
  );
}
