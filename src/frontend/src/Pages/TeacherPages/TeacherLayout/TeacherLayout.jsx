import { useContext, useEffect, useState } from "react";
import Sidebar, { SidebarButton, SidebarItem } from "./Sidebar";
import {
  LayoutDashboard,
  User,
  Search,
  Settings,
  LogOutIcon,
} from "lucide-react";
import BottomBar from "./BottomBar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";
import { AccountType } from "../../../utils/enum";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiStudent } from "react-icons/pi";
import { TbDevicesQuestion } from "react-icons/tb";

export default function TeacherLayout() {
  const { userState, logOutUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (userState.accountType !== AccountType.Teacher) {
      navigate("/");
    }
  }, []);
  const [globalOpen, setGlobalOpen] = useState(true);

  return (
    <>
      <div className="hidden sm:flex fixed left-0 top-0">
        <Sidebar setGlobalOpen={setGlobalOpen} globalOpen={globalOpen}>
          {/* <SidebarItem icon={<Home size={20} />} text="Home" alert /> */}
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            active
          />
          <SidebarItem icon={<Search size={20} />} text="Search" />
          <SidebarItem
            icon={<HiOutlineUserGroup size={20} />}
            text="committees"
          />
          <SidebarItem
            icon={<LiaChalkboardTeacherSolid size={20} />}
            text="Teachers"
          />
          <SidebarItem
            active={true}
            icon={<PiStudent size={20} />}
            text="Students"
          />
          <SidebarItem
            alert={true}
            icon={<TbDevicesQuestion size={20} />}
            text="Requests"
          />

          <hr className="my-3" />
          <SidebarItem icon={<User size={20} />} text="profile" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" />

          <SidebarButton
            onClick={() => logOutUser()}
            icon={<LogOutIcon className="inline" size={20} />}
            text="Logout"
          />
        </Sidebar>
      </div>
      <BottomBar />
      <div className={`mr-4 ${globalOpen ? "sm:ml-72" : "sm:ml-16"} `}>
        <Outlet />
      </div>
    </>
  );
}
