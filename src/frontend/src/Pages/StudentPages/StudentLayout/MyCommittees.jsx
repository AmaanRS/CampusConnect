import { Accordion, Avatar } from "flowbite-react";
import React from "react";
import CommitteeItem from "./CommitteeItem";

export default function MyCommittees({ committeeArray = [] }) {
  return (
    <Accordion className="border-none">
      <Accordion.Panel>
        <Accordion.Title className="bg-white border-none outline-none shadow-none  ring-0 focus:ring-0 p-0  py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors duration-200 group hover:bg-indigo-50 text-gray-600">
          My Committees
        </Accordion.Title>

        <Accordion.Content className="p-0">
          {committeeArray.map((item) => {
            return <CommitteeItem key={item._id} item={item} />;
          })}
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
}
