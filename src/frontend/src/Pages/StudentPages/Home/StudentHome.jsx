import React from "react";
import StudentPost from "./Post/StudentPost";

export default function StudentHome() {
  return (
    <div className="max-w-3xl m-auto">
      <hr className="mb-2 mx-1" />
      <StudentPost />
      {/* <StudentPost />
      <StudentPost />
      <StudentPost /> */}
    </div>
  );
}
