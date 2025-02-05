import React from "react";
import StudentPost from "../Components/PostPreview/Post/StudentPost";
import { Avatar } from "flowbite-react";

export default function CommitteeList() {
  return (
    <>
      <div className="flex bg-slate-100 rounded-lg items-center mb-4 px-4 ">
        <Avatar size="lg" rounded className="  rounded-full" />
        <p className="ml-2 font-bold text-2xl">Committee Name</p>
      </div>
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
