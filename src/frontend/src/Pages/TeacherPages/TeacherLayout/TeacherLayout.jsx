import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";
import { AccountType } from "../../../utils/enum";
import SidebarComponent from "./SidebarComponent";
import MobileNavComponent from "./MobileNavComponent";
import OutletComponent from "../../../Components/Layout/OutletComponent";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import Topbar from "../../../Components/Layout/Desktop/Topbar";

export default function TeacherLayout() {
  const { userState } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (userState.accountType !== AccountType.Teacher) {
      navigate("/");
    }
    if (
      userState.accountType === AccountType.Teacher &&
      !userState.isProfileComplete
    ) {
      navigate("/userprofile");
    }
  }, [userState]);

  return (
    <>
      <Topbar />
      <div className="mt-[52px]">
        <SidebarComponent />
        <MobileNavComponent />
        <OutletComponent />
        {/* <RightSidebar /> */}
      </div>
    </>
  );
}
