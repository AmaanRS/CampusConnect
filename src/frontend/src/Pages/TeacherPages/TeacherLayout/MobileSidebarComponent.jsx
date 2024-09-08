import React from "react";
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
import { Sidebar } from "flowbite-react";
import MobileSidebarLogout from "../../../Components/Layout/mobile/Sidebar/MobileSidebarLogout";
import MobileSidebarItem from "../../../Components/Layout/mobile/Sidebar/MobileSidebarItem";

export default function MobileSidebarComponent({ setIsDrawerOpen }) {
  return (
    <Sidebar.Items>
      <Sidebar.ItemGroup>
        <MobileSidebarItem
          icon={HiChartPie}
          setIsDrawerOpen={setIsDrawerOpen}
          to={"/teacher"}
          routeName={"teacher"}
        >
          Dashboard
        </MobileSidebarItem>

        <MobileSidebarItem
          icon={HiUsers}
          setIsDrawerOpen={setIsDrawerOpen}
          to={"createcommittee"}
          routeName={"createcommittee"}
        >
          Create Committee
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
  );
}
