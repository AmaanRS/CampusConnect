import React, { useContext } from "react";
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
import Sidebar from "../../../Components/Layout/Desktop/Sidebar";
import SidebarItem from "../../../Components/Layout/Desktop/SidebarItem";
import SidebarButton from "../../../Components/Layout/Desktop/SidebarButton";
import { UserContext } from "../../../store/UserContextProvider";

export default function SidebarComponent({ setGlobalOpen, globalOpen }) {
  const { logOutUser } = useContext(UserContext);
  return (
    <Sidebar setGlobalOpen={setGlobalOpen} globalOpen={globalOpen}>
      <SidebarItem to="/student" icon={<Home size={20} />} text="Home" />
      <SidebarItem
        to="page2"
        icon={<LayoutDashboard size={20} />}
        text="Dashboard"
      />
      <SidebarItem to="page3" icon={<Search size={20} />} text="Search" />
      <SidebarItem icon={<HiOutlineUserGroup size={20} />} text="committees" />
      <SidebarItem
        icon={<LiaChalkboardTeacherSolid size={20} />}
        text="Teachers"
      />
      <SidebarItem icon={<PiStudent size={20} />} text="Students" />
      <SidebarItem icon={<TbDevicesQuestion size={20} />} text="Requests" />

      <hr className="my-3" />
      <SidebarItem icon={<User size={20} />} text="profile" />
      <SidebarItem icon={<Settings size={20} />} text="Settings" />

      <SidebarButton
        onClick={() => logOutUser()}
        icon={<LogOutIcon className="inline" size={20} />}
        text="Logout"
      />
    </Sidebar>
  );
}
