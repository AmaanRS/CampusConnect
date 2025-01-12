import { Avatar, Dropdown, Label, Navbar, TextInput } from "flowbite-react";
import { LucideSearch } from "lucide-react";
import React, { useContext } from "react";
import { HiMail } from "react-icons/hi";
import { Link } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";

export default function Topbar() {
  const { logOutUser } = useContext(UserContext);
  return (
    <div className="border-b-[1px] z-10 fixed w-full border-gray-300 ">
      <Navbar className="flex  ">
        {/* Left Section - Logo */}
        <Link to={"/"} className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Center Section - Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-lg">
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
              id="email4"
              type="email"
              icon={LucideSearch}
              placeholder="Search committees, posts, or events..."
              required
            />
          </div>
        </div>

        {/* Right Section - User Dropdown */}
        <div className="flex md:order-2 flex-shrink-0">
          <Dropdown
            className="rounded-xl"
            arrowIcon={false}
            inline
            label={<Avatar size={"sm"} alt="User settings" rounded />}
          >
            <Dropdown.Header>
              <span className="block capitalize  font-bold text-sm">
                John Doe
              </span>
              <span className=" block truncate text-sm ">john@gmail.com</span>
            </Dropdown.Header>
            <Dropdown.Item className="font-semibold">Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => logOutUser()}
              className="text-red-700 font-semibold"
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>
    </div>
  );
}

function Logo() {
  return (
    <div className="logo">
      <h1 className="text-2xl font-bold text-blue-dark">
        Campus<span className="text-blue-light">Connect</span>
      </h1>
    </div>
  );
}
