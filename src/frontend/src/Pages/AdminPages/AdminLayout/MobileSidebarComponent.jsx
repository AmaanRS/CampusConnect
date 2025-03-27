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
import { Home, LayoutDashboard, Search } from "lucide-react";
import { MdEvent } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";

export default function MobileSidebarComponent({ setIsDrawerOpen }) {
  return (
    <>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <MobileSidebarItem
            icon={Home}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"/admin"}
            routeName={"admin"}
          >
            Home
          </MobileSidebarItem>

          <MobileSidebarItem
            icon={MdEvent}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"/admin/events"}
            routeName={"events"}
          >
            Events
          </MobileSidebarItem>

          <MobileSidebarItem
            icon={Search}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"explore"}
            routeName={"explore"}
          >
            Explore
          </MobileSidebarItem>

          <MobileSidebarItem
            icon={HiOutlineUserGroup}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"createcommittee"}
            routeName={"createcommittee"}
          >
            Create Committee
          </MobileSidebarItem>

          <MobileSidebarItem
            icon={LayoutDashboard}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"allCommittee"}
            routeName={"allCommittee"}
          >
            All Committee
          </MobileSidebarItem>

          <MobileSidebarItem
            icon={LiaChalkboardTeacherSolid}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"teachers"}
            routeName={"teachers"}
          >
            Teachers
          </MobileSidebarItem>

          <MobileSidebarItem
            icon={LiaChalkboardTeacherSolid}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"students"}
            routeName={"students"}
          >
            Students
          </MobileSidebarItem>
        </Sidebar.ItemGroup>

        <Sidebar.ItemGroup>
          <MobileSidebarLogout />
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </>
  );
}
