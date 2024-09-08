import Sidebar from "./Sidebar";

import {
  LayoutDashboard,
  User,
  Search,
  Settings,
  LogOutIcon,
} from "lucide-react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiStudent } from "react-icons/pi";
import { TbDevicesQuestion } from "react-icons/tb";
import { useContext } from "react";
import { UserContext } from "../../../store/UserContextProvider";
import SidebarButton from "./SidebarButton";
import SidebarItem from "./SidebarItem";

export default function SidebarComponent({ setGlobalOpen, globalOpen }) {
  const { logOutUser } = useContext(UserContext);
  return (
    <Sidebar setGlobalOpen={setGlobalOpen} globalOpen={globalOpen}>
      <SidebarItem
        to={"/teacher"}
        text={"Dashboard"}
        icon={<LayoutDashboard size={20} />}
      />
      <SidebarItem
        to={"createcommittee"}
        text="Create Committee"
        icon={<HiOutlineUserGroup size={20} />}
      />
      <SidebarItem icon={<Search size={20} />} text="Search" />

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
