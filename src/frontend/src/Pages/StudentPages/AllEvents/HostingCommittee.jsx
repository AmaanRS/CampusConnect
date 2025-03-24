import React from "react";
import { Link } from "react-router-dom";

export default function HostingCommittee({ committees = [] }) {
  if (committees?.length === 1) {
    return (
      <Link to={`/student/committee/${committees[0]?.committeeId}`}>
        <span className="text-sm font-semibold hover:text-blue-500 transition">
          {committees[0]?.name}
        </span>
      </Link>
    );
  }

  if (committees?.length === 2) {
    return (
      <div>
        <Link
          className="inline-block"
          to={`/student/committee/${committees[0]?.committeeId}`}
        >
          <span className="text-sm font-semibold hover:text-blue-500 transition">
            {committees[0]?.name}
          </span>
        </Link>
        <span> and 1 other</span>
      </div>
    );
  }

  return (
    <>
      <div>
        <Link
          className="inline-block"
          to={`/student/committee/${committees[0]?.committeeId}`}
        >
          <span className="text-sm font-semibold hover:text-blue-500 transition">
            {committees[0]?.name}
          </span>
        </Link>
        <span> and {committees?.length - 1} others</span>
      </div>
    </>
  );
}
