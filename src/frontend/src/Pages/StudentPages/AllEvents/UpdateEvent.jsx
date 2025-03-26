import { Popover } from "flowbite-react";
import React, { useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import DeleteEvent from "../CommitteeDetails/DeleteEvent";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";

export default function UpdateEvent({ eventId, committeeId }) {
  return (
    <div className="ml-4">
      <Popover
        content={<PopMenu eventId={eventId} committeeId={committeeId} />}
      >
        <button className="rounded-full hover:bg-slate-200 p-2">
          <BsThreeDotsVertical />{" "}
        </button>
      </Popover>
    </div>
  );
}

function PopMenu({ eventId, committeeId }) {
  const navigate = useNavigate();
  const {
    userState: { accountType },
  } = useContext(UserContext);
  return (
    <>
      <div className="shadow-2xl ">
        <div>
          <button
            onClick={() =>
              navigate(`/${accountType.toLowerCase()}/edit/event/${eventId}`)
            }
            className="w-full  flex items-center justify-start text-left py-2 px-5 hover:bg-slate-100"
          >
            <MdEdit className="mr-2 text-lg" />
            <span className="font-medium">Edit</span>
          </button>
        </div>
        <div>
          <DeleteEvent committeeId={committeeId} eventId={eventId} />
        </div>
      </div>
    </>
  );
}
