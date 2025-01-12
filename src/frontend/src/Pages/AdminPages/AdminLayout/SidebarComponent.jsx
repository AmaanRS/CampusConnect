import React, { useContext } from "react";
import { UserContext } from "../../../store/UserContextProvider";
import Sidebar from "../../../Components/Layout/Desktop/Sidebar";
import SidebarItem from "../../../Components/Layout/Desktop/SidebarItem";
import {
  LayoutDashboard,
  User,
  Search,
  Settings,
  LogOutIcon,
  Home,
} from "lucide-react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiStudent } from "react-icons/pi";
import { TbDevicesQuestion } from "react-icons/tb";
import SidebarButton from "../../../Components/Layout/Desktop/SidebarButton";

export default function SidebarComponent() {
  const { logOutUser } = useContext(UserContext);
  return (
    <>
      <Sidebar>
        <SidebarItem icon={<Home size={20} />} to="/admin" text="Home" />
        <SidebarItem
          to={"createcommittee"}
          text="Create Committee"
          icon={<HiOutlineUserGroup size={20} />}
        />
        <SidebarItem
          to="allCommittee"
          icon={<LayoutDashboard size={20} />}
          text="All Committee"
        />

        <SidebarItem
          to="teachers"
          icon={<LiaChalkboardTeacherSolid size={20} />}
          text="Teachers"
        />
        <SidebarItem
          to="students"
          icon={<PiStudent size={20} />}
          text="Students"
        />
        <SidebarItem icon={<Search size={20} />} text="Search" />
        <SidebarItem icon={<TbDevicesQuestion size={20} />} text="Requests" />

        <hr className="my-3" />
        <SidebarItem icon={<User size={20} />} text="profile" />

        <SidebarItem icon={<User size={20} />} text="profile" />
        <SidebarItem icon={<User size={20} />} text="profile" />
        <SidebarItem icon={<User size={20} />} text="profile" />
        <SidebarItem icon={<User size={20} />} text="profile" />
        <SidebarItem icon={<User size={20} />} text="profile" />
        <SidebarItem icon={<User size={20} />} text="profile" />
        <SidebarItem icon={<User size={20} />} text="profile" />

        <SidebarItem icon={<Settings size={20} />} text="Settings" />

        <SidebarButton
          onClick={() => logOutUser()}
          icon={<LogOutIcon className="inline" size={20} />}
          text="Logout"
        />
      </Sidebar>
    </>
  );
}
