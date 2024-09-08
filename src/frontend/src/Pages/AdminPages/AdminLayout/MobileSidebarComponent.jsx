import { Sidebar } from "flowbite-react";
import React from "react";
import MobileSidebarItem from "../../../Components/Layout/mobile/Sidebar/MobileSidebarItem";
import {
  HiChartPie,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiLogin,
  HiPencil,
  HiShoppingBag,
  HiUsers,
} from "react-icons/hi";
import MobileSidebarLogout from "../../../Components/Layout/mobile/Sidebar/MobileSidebarLogout";

export default function MobileSidebarComponent({ setIsDrawerOpen }) {
  return (
    <>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <MobileSidebarItem
            icon={HiChartPie}
            routeName={"admin"}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"/admin"}
          >
            Dashboard
          </MobileSidebarItem>
          <MobileSidebarItem
            icon={HiUsers}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"requests"}
            routeName={"requests"}
          >
            Requests
          </MobileSidebarItem>

          <Sidebar.Item icon={HiShoppingBag}>Users list</Sidebar.Item>
          <Sidebar.Item icon={HiLogin}>Sign in</Sidebar.Item>
          <Sidebar.Item icon={HiPencil}>Sign up</Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item icon={HiClipboard}>Docs</Sidebar.Item>
          <Sidebar.Item icon={HiCollection}>Components</Sidebar.Item>
          <Sidebar.Item icon={HiInformationCircle}>Help</Sidebar.Item>

          <MobileSidebarLogout />
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </>
  );
}
