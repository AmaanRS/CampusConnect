import React from "react";
import StudentPost from "../Components/PostPreview/Post/StudentPost";
import { Avatar } from "flowbite-react";
import { MdGroups } from "react-icons/md";

export default function CommitteeList() {
  // return <>"work in progress"</>;
  return (
    <>
      <div className="flex bg-slate-100 rounded-lg items-center mb-4 px-4 ">
        <Avatar
          img={MdGroups}
          size="lg"
          rounded
          className="  rounded-full text-slate-300 "
        />
        <p className="ml-2 font-bold text-2xl text-slate-700">Committee Name</p>
      </div>
      <div className="max-w-3xl m-auto">
        <hr className="mb-2 mx-1" />
        {/* <StudentPost mode="committee" />
        <StudentPost mode="committee" />
        <StudentPost mode="committee" />
        <StudentPost mode="committee" /> */}
      </div>
    </>
  );
}
