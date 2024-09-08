import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";
import { AccountType } from "../../../utils/enum";
import SidebarComponent from "./SidebarComponent";
import MobileNavComponent from "./MobileNavComponent";
import OutletComponent from "../../../Components/Layout/OutletComponent";

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
  const [globalOpen, setGlobalOpen] = useState(true);

  return (
    <>
      <SidebarComponent globalOpen={globalOpen} setGlobalOpen={setGlobalOpen} />
      <MobileNavComponent />
      <OutletComponent globalOpen={globalOpen} />
    </>
  );
}
