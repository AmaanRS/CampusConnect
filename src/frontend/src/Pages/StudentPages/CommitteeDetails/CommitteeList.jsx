import React from "react";
import StudentPost from "../Components/PostPreview/Post/StudentPost";

export default function CommitteeList() {
  return (
    <>
      <p className="mb-4 ml-2 font-bold text-2xl">Committee Name</p>
      <div className="max-w-3xl m-auto">
        <hr className="mb-2 mx-1" />
        <StudentPost mode="committee" />
        <StudentPost mode="committee" />
        <StudentPost mode="committee" />
        <StudentPost mode="committee" />
      </div>
    </>
  );
}
