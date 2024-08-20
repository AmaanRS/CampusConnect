import { useContext, useEffect, useState } from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import {
  LayoutDashboard,
  Home,
  StickyNote,
  Layers,
  Flag,
  Calendar,
  LifeBuoy,
  Settings,
} from "lucide-react";
import BottomBar from "./BottomBar";
import { Outlet, redirect } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";
import { AccountType } from "../../../utils/enum";

export default function AdminLayout() {
  const { userState } = useContext(UserContext);
  useEffect(() => {
    if (userState.accountType !== AccountType.Admin) {
      redirect("/");
    }
  }, []);
  const [globalOpen, setGlobalOpen] = useState(true);
  return (
    <>
      <div className="hidden sm:flex fixed left-0 top-0">
        <Sidebar setGlobalOpen={setGlobalOpen} globalOpen={globalOpen}>
          <SidebarItem icon={<Home size={20} />} text="Home" alert />
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            active
          />
          <SidebarItem icon={<StickyNote size={20} />} text="Projects" alert />
          <SidebarItem icon={<Calendar size={20} />} text="Calendar" />
          <SidebarItem icon={<Layers size={20} />} text="Tasks" />
          <SidebarItem icon={<Flag size={20} />} text="Reporting" />
          <hr className="my-3" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
          <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
        </Sidebar>
      </div>
      <div className={`mr-4 ${globalOpen ? "sm:ml-72" : "sm:ml-16"} `}>
        <Outlet />
      </div>
      <BottomBar />
    </>
  );
}
