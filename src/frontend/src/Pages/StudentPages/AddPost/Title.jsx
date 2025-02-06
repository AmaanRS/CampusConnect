import { Label } from "flowbite-react";
import React from "react";

export default function Title({ title, setTitle, setError }) {
  return (
    <>
      <div className="mb-2 block">
        <Label
          className="my-2 text-lg font-semibold"
          htmlFor="title"
          value="Post Title"
        />
        <sup className="text-red-500 text-base">*</sup>
      </div>
      <input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setError("");
        }}
        id="title"
        placeholder="Post Title"
        className=" appearance-none rounded-md block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300  text-gray-900  focus:outline-1 focus:outline-blue-700  p-4 sm:text-base"
      />
    </>
  );
}
