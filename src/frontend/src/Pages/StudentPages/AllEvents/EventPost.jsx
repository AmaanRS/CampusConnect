import { format, formatDistanceToNow, parse } from "date-fns";
import { Avatar } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import htmlParse from "html-react-parser";

const formatDate = (inputDate) => {
  const parsedDate = parse(inputDate, "dd-MM-yyyy", new Date());
  const formattedDate = format(parsedDate, "MMMM dd, yyyy");

  return formattedDate;
};

export default function EventPost({ eventData, mode = "allEvents" }) {
  return (
    <>
      <div className="mx-4 border my-3 bg-white hover:bg-gray-50 rounded-xl p-4 transition-all duration-200 shadow-md mb-6">
        {/* Post Header */}
        <div className="flex items-center gap-3 text-neutral-600">
          <Avatar rounded size="sm" />
          <div className="flex flex-col">
            {mode === "allEvents" ? (
              <Link to={`/student/committee/${eventData?.committeeId || 1}`}>
                <span className="text-sm font-semibold hover:text-blue-500 transition">
                  {"eventData?.subname"}
                </span>
              </Link>
            ) : (
              <span className="text-sm font-semibold">{username}</span>
            )}
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(eventData?.createdAt, { addSuffix: true })}
            </span>
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
        <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <p className="flex items-center gap-1">
              📅 <span className="font-medium">Start:</span>{" "}
              {formatDate(eventData?.startDate)}
            </p>
            <p className="flex items-center gap-1">
              🏁 <span className="font-medium">End:</span> {eventData?.endDate}
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
