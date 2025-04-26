import { Avatar, Dropdown, Label, Navbar, TextInput } from "flowbite-react";
import { LucideSearch } from "lucide-react";
import React, { useContext } from "react";
import { HiMail } from "react-icons/hi";
import { Link } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";

export default function Topbar() {
  const {
    logOutUser,
    userState: { email },
  } = useContext(UserContext);
  return (
    <div className="border-b-[1px] z-50 fixed w-full border-gray-300 ">
      <div className="flex px-3 bg-white justify-between h-[52.3px] items-center">
        {/* Left Section - Logo */}
        <div>
          <Link to={"/"} className="flex-shrink-0">
            <Logo />
          </Link>
        </div>

        {/* Center Section - Search Bar */}
        {/* <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-lg">
          <div className="relative">
            <TextInput
              theme={{
                field: {
                  input: {
                    colors: {
                      search:
                        "focus:outline-none focus:ring-1 focus:ring-blue-500 border-1 border-gray-200 bg-slate-100",
                    },
                    withAddon: {
                      on: "rounded-full",
                      off: "rounded-full",
                    },
                  },
                },
              }}
              color={"search"}
              id="search"
              type="search"
              icon={LucideSearch}
              placeholder="Search committees, posts, or events..."
              required
            />
          </div>
        </div> */}

        {/* Right Section - User Dropdown */}
        <div className="">
          <Dropdown
            className="rounded-xl"
            arrowIcon={false}
            inline
            label={<Avatar size={"sm"} alt="User settings" rounded />}
          >
            <Dropdown.Header>
              <span className="block capitalize  font-bold text-sm">
                {email.split(".")[0]}
              </span>
              <span className=" block truncate text-sm "> {email} </span>
            </Dropdown.Header>
            <Dropdown.Item
              onClick={() => logOutUser()}
              className="text-red-700 font-semibold"
            >
              Log out
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="logo">
      <h1 className="text-2xl font-bold text-blue-700">
        Campus<span className="text-blue-500">Connect</span>
      </h1>
    </div>
  );
}
