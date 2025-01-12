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

  return (
    <>
      <div className="flex">
        <SidebarComponent />
        <MobileNavComponent />
        <OutletComponent />
        {/* <div id="right-section"> */}
        <div className=" custom-scrollbar overflow-auto fixed top-0 right-0 h-screen w-72 bg-white border-l-[1px] p-4 hidden sm:block">
          <h2 className="text-xl font-bold mb-4">Popular Committees</h2>
          <ul>
            <li className="mb-2">Committee 1</li>
            <li className="mb-2">Committee 2</li>
            <li className="mb-2">Committee 3</li>
            <li className="mb-2">Committee 4</li>
          </ul>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
