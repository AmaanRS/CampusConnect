import { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";
import { AccountType } from "../../../utils/enum";
import OutletComponent from "../../../Components/Layout/OutletComponent";
import SidebarComponent from "./SidebarComponent";
import MobileNavComponent from "./MobileNavComponent";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import Topbar from "../../../Components/Layout/Desktop/Topbar";

export default function AdminLayout() {
  const { userState } = useContext(UserContext);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (userState.accountType !== AccountType.Admin) {
  //     navigate("/");
  //   }
  // }, []);

  return (
    <>
      <Topbar />
      <div className="flex mt-[52px]">
        <SidebarComponent />
        <MobileNavComponent />
        <OutletComponent />
      </div>
    </>
  );
}
