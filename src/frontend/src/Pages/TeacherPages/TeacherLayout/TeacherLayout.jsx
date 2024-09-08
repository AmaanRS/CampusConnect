import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";
import { AccountType } from "../../../utils/enum";
import SidebarComponent from "./SidebarComponent";
import MobileNav from "./MobileNav";
import OutletComponent from "../../../Components/Layout/OutletComponent";

export default function TeacherLayout() {
  const { userState } = useContext(UserContext);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (userState.accountType !== AccountType.Teacher) {
  //     navigate("/");
  //   }
  //   if (
  //     userState.accountType === AccountType.Teacher &&
  //     !userState.isProfileComplete
  //   ) {
  //     navigate("/userprofile");
  //   }
  // }, []);
  const [globalOpen, setGlobalOpen] = useState(true);

  return (
    <>
      <SidebarComponent globalOpen={globalOpen} setGlobalOpen={setGlobalOpen} />
      <MobileNav />
      <OutletComponent globalOpen={globalOpen} />
    </>
  );
}
