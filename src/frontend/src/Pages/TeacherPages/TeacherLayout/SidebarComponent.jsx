import Sidebar from "../../../Components/Layout/Desktop/Sidebar";

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
import { useContext } from "react";
import { UserContext } from "../../../store/UserContextProvider";
import SidebarButton from "../../../Components/Layout/Desktop/SidebarButton";
import SidebarItem from "../../../Components/Layout/Desktop/SidebarItem";
import { MdEvent } from "react-icons/md";

export default function SidebarComponent() {
  const { logOutUser } = useContext(UserContext);
  return (
    <Sidebar>
      <SidebarItem to="/teacher" icon={<Home size={20} />} text="Home" />
      <SidebarItem to="events" icon={<MdEvent size={20} />} text="Events" />
      <SidebarItem to="explore" icon={<Search size={20} />} text="Explore " />
      <hr />
      <SidebarButton
        onClick={() => logOutUser()}
        icon={<LogOutIcon className="inline" size={20} />}
        text="Logout"
      />
    </Sidebar>
  );
}
