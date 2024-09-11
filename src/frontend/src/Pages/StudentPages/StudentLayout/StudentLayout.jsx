import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";
import { AccountType } from "../../../utils/enum";
import SidebarComponent from "./SidebarComponent";
import OutletComponent from "../../../Components/Layout/OutletComponent";
import MobileNavComponent from "./MobileNavComponent";

export default function StudentLayout() {
  const { userState, logOutUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (userState.accountType !== AccountType.Student) {
      navigate("/");
    }
    if (
      userState.accountType === AccountType.Student &&
      !userState.isProfileComplete
    ) {
      navigate("/userprofile");
    }
  }, []);
  const [globalOpen, setGlobalOpen] = useState(true);

  return (
    <>
      {/* <BottomBar /> */}
      <SidebarComponent globalOpen={globalOpen} setGlobalOpen={setGlobalOpen} />
      <MobileNavComponent />
      <OutletComponent globalOpen={globalOpen} />
    </>
  );
}
