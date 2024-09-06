import React from "react";
import {
  Button,
  Checkbox,
  Dropdown,
  Label,
  Textarea,
  TextInput,
} from "flowbite-react";
import { Department } from "../../../utils/enum";

export default function CreateCommittee() {
  return (
    <>
      <div className="my-4  mx-10">
        <h1 className="mb-4 text-2xl font-semibold">Create a New Committee</h1>
        <form className=" flex h-screen max-w-lg flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="committee-name" value="Commitee name" />
            </div>
            <TextInput
              id="committee-name"
              type="text"
              placeholder="committee"
              required
            />
          </div>
          <div className="max-w-lg">
            <div className="mb-2 block">
              <Label htmlFor="description" value="Description" />
            </div>
            <Textarea
              id="description"
              placeholder="write description about committee"
              required
              rows={4}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="student-incharge"
                value="Student Incharge Email"
              />
            </div>
            <TextInput
              id="student-incharge"
              type="email"
              placeholder="write email of student incharge"
              required
            />
          </div>
          <div className="mb-2 block">
            <Label className="block mb-2" value="Department of Committee " />
            <div className="border-2 border-gray-300 inline-block p-2 rounded-lg ">
              <Dropdown inline label="Select Department">
                <Dropdown.Item> {Department.IT} </Dropdown.Item>
                <Dropdown.Item> {Department.COMS} </Dropdown.Item>
                <Dropdown.Item> {Department.AIDS} </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>GLOBAL</Dropdown.Item>
              </Dropdown>
            </div>
          </div>

          <Button
            disabled
            color={""}
            className="bg-blue-medium hover:bg-blue-dark active:bg-blue-dark text-white"
            onClick={() => console.log("first")}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  );
}
