import { Dropdown } from "flowbite-react";
import React from "react";
export default function SelectCommittee() {
  return (
    <>
      <Dropdown
        renderTrigger={() => (
          <div className="inline-block  bg-neutral-200 px-4 py-2 rounded-full">
            <div className=" flex items-center">
              <span className="font-medium">Select a committee</span>
              <span className="ml-2">
                {" "}
                {/* Adjust the margin as needed */}
                <svg
                  className="fill-current"
                  height="20"
                  viewBox="0 0 20 20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 13.125a.624.624 0 0 1-.442-.183l-5-5 .884-.884L10 11.616l4.558-4.558.884.884-5 5a.624.624 0 0 1-.442.183Z"></path>
                </svg>
              </span>
            </div>
          </div>
        )}
        dismissOnClick={false}
      >
        <Dropdown.Item>Hackathon Committee</Dropdown.Item>
        <Dropdown.Item>Student Council</Dropdown.Item>
        <Dropdown.Item>NSS</Dropdown.Item>
        <Dropdown.Item>Computer Society of India</Dropdown.Item>
      </Dropdown>
    </>
  );
}
