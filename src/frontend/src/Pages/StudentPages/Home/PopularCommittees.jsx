import React from "react";
import PopularCommiteeItem from "./PopularCommiteeItem";

export default function PopularCommittees() {
  return (
    <div className="bg-slate-100 py-3 mt-4 mr-2 pl-2 rounded-lg">
      <h1 className="font-semibold text-sm mb-6 text-gray-700">
        Popular Committees
      </h1>
      <ul>
        <PopularCommiteeItem />
        <PopularCommiteeItem />
        <PopularCommiteeItem />
        <PopularCommiteeItem />
      </ul>
    </div>
  );
}
