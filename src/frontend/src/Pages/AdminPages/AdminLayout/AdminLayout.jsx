import { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";
import { AccountType } from "../../../utils/enum";
import OutletComponent from "../../../Components/Layout/OutletComponent";
import SidebarComponent from "./SidebarComponent";
import MobileNavComponent from "./MobileNavComponent";

export default function AdminLayout() {
  const { userState } = useContext(UserContext);
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
      <MobileNavComponent />
      <OutletComponent globalOpen={globalOpen} />
    </>
  );
}
