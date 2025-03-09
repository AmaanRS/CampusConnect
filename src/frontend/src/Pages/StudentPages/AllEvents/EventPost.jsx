import {
  format,
  formatDistanceToNow,
  parse,
  isBefore,
  isAfter,
  isWithinInterval,
} from "date-fns";
import { Avatar } from "flowbite-react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import htmlParse from "html-react-parser";
import HostingCommittee from "./HostingCommittee";
import { BsThreeDotsVertical } from "react-icons/bs";
import UpdateEvent from "./UpdateEvent";
import { UserContext } from "../../../store/UserContextProvider";

const formatDate = (inputDate) => {
  if (!inputDate) return "";
  const parsedDate = parse(inputDate, "dd-MM-yyyy", new Date());
  return format(parsedDate, "MMMM dd, yyyy");
};

// Function to determine event status
const getEventStatus = (startDate, endDate, startTime, endTime) => {
  if (!startDate || !endDate || !startTime || !endTime) return "Unknown";

  // Parse date and time into valid Date objects
  const startDateTime = parse(
    `${startDate} ${startTime}`,
    "dd-MM-yyyy hh:mm a",
    new Date()
  );
  const endDateTime = parse(
    `${endDate} ${endTime}`,
    "dd-MM-yyyy hh:mm a",
    new Date()
  );

  //  current timestamp
  const now = new Date();

  // Determine event status
  if (isBefore(now, startDateTime)) {
    return "Upcoming";
  } else if (
    isWithinInterval(now, { start: startDateTime, end: endDateTime })
  ) {
    return "Ongoing";
  } else {
    return "Finished";
  }
};

export default function EventPost({
  eventData,
  mode = "allEvents",
  committeeName = "",
  committeeData,
}) {
  // Get event status
  const eventStatus = getEventStatus(
    eventData?.startDate,
    eventData?.endDate,
    eventData?.startTime,
    eventData?.endTime
  );

  const {
    userState: { email },
  } = useContext(UserContext);

  let isIncharge = false;
  if (mode == "committee") {
    isIncharge = email === committeeData?.studentIncharge?.email;
  }

  return (
    <>
      <div className="mx-4 border my-3 bg-white hover:bg-slate-50 rounded-xl p-4 transition-all duration-200 shadow-md mb-6">
        {/* Post Header */}
        <div className="flex items-center gap-3 text-neutral-600">
          <Avatar rounded size="sm" />
          <div className="flex flex-col">
            {mode === "allEvents" ? (
              <HostingCommittee committees={eventData?.hostingCommittees} />
            ) : (
              <span className="text-sm font-semibold">{committeeName}</span>
            )}
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(eventData?.createdAt, { addSuffix: true })}
            </span>
          </div>
          <div className="text-right ml-auto flex items-center mt-3">
            <div className=" text-sm font-semibold text-center">
              <span
                className={`px-2 py-1.5 rounded-lg ${
                  eventStatus === "Upcoming"
                    ? "bg-blue-100 text-blue-600"
                    : eventStatus === "Ongoing"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {eventStatus}
              </span>
            </div>
            {isIncharge && (
              <UpdateEvent
                eventId={eventData?.eventId}
                committeeId={committeeData?.committeeId}
              />
            )}
          </div>
        </div>

        {/* Post Title */}
        <h1 className="mt-2 text-lg font-semibold text-gray-900">
          {eventData?.name}
        </h1>

        {/* Post Body */}
        <div className="tiptap  text-gray-700 text-sm mb-3">
          {htmlParse(eventData?.description)}
        </div>

        {/* Event Details */}
        <div className="bg-slate-100 border-slate-300 p-3 rounded-lg text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <p className="flex items-center gap-1">
              📅 <span className="font-medium">Start:</span>{" "}
              {formatDate(eventData?.startDate)}
            </p>
            <p className="flex items-center gap-1">
              🏁 <span className="font-medium">End:</span>{" "}
              {formatDate(eventData?.endDate)}
            </p>
            <p className="flex items-center gap-1">
              ⏰ <span className="font-medium">Time:</span>{" "}
              {eventData?.startTime} - {eventData?.endTime}
            </p>
            <p className="flex items-center gap-1 col-span-2">
              📍 <span className="font-medium">Venue:</span> {eventData?.venue}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
