import { Label } from "flowbite-react";
import React from "react";

export default function Title() {
  return (
    <>
      <div className="mb-2 block">
        <Label
          className="my-2 text-lg font-semibold"
          htmlFor="title"
          value="Post Title"
        />
      </div>
      <input
        id="title"
        placeholder="Post Title"
        className=" appearance-none rounded-2xl block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900  focus:outline-1 focus:outline-blue-700  p-4 sm:text-base"
      />
    </>
  );
}
