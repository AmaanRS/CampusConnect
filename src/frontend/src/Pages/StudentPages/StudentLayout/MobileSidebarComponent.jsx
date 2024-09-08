import { Sidebar } from "flowbite-react";
import React from "react";
import MobileSidebarLogout from "../../../Components/Layout/mobile/Sidebar/MobileSidebarLogout";
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

export default function MobileSidebarComponent({ setIsDrawerOpen }) {
  return (
    <>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <MobileSidebarItem
            icon={HiChartPie}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"/student"}
            routeName={"student"}
          >
            Home
          </MobileSidebarItem>

          <MobileSidebarItem
            icon={HiUsers}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"page2"}
            routeName={"page2"}
          >
            Page 2
          </MobileSidebarItem>

          <MobileSidebarItem
            setIsDrawerOpen={setIsDrawerOpen}
            to={"page3"}
            routeName={"page3"}
            icon={HiShoppingBag}
          >
            Page 3
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
