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
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
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
          <NavLink to={"/teacher"} end>
            {({ isActive }) => {
              return (
                <SidebarItem
                  active={isActive}
                  icon={<LayoutDashboard size={20} />}
                  text="Dashboard"
                />
              );
            }}
          </NavLink>
          <SidebarItem icon={<Search size={20} />} text="Search" />

          <NavLink to={"createcommittee"}>
            {({ isActive }) => {
              return (
                <SidebarItem
                  active={isActive}
                  icon={<HiOutlineUserGroup size={20} />}
                  text="Create Committee"
                />
              );
            }}
          </NavLink>
          <SidebarItem
            icon={<LiaChalkboardTeacherSolid size={20} />}
            text="Teachers"
          />
          <SidebarItem icon={<PiStudent size={20} />} text="Students" />
          <SidebarItem
            // alert={true}
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
      <div className={` ${globalOpen ? "sm:ml-72" : "sm:ml-20"} `}>
        <Outlet />
      </div>
    </>
  );
}
