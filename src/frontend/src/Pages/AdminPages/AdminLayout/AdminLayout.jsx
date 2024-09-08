import { useContext, useEffect, useState } from "react";
import Sidebar, { SidebarButton, SidebarItem } from "./Sidebar";

import BottomBar from "./BottomBar";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";
import { AccountType } from "../../../utils/enum";
import OutletComponent from "../../../Components/Layout/OutletComponent";
import SidebarComponent from "./SidebarComponent";

export default function AdminLayout() {
  const { userState, logOutUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (userState.accountType !== AccountType.Admin) {
      navigate("/");
    }
  }, []);
  const [globalOpen, setGlobalOpen] = useState(true);

  return (
    <>
      <SidebarComponent globalOpen={globalOpen} setGlobalOpen={setGlobalOpen} />
      <BottomBar />
      <OutletComponent globalOpen={globalOpen} />
    </>
  );
}
