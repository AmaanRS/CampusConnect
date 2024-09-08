import { Sidebar } from "flowbite-react";
import React, { useContext } from "react";
import { FiLogOut } from "react-icons/fi";
import { UserContext } from "../../../../store/UserContextProvider";

export default function MobileSidebarLogout() {
  const { logOutUser } = useContext(UserContext);
  return (
    <Sidebar.Item onClick={() => logOutUser()} icon={FiLogOut}>
      Logout
    </Sidebar.Item>
  );
}
