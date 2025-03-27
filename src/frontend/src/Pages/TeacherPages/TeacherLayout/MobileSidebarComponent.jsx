import React, { useContext, useEffect, useState } from "react";
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
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { UserContext } from "../../../store/UserContextProvider";
import { useQuery } from "@tanstack/react-query";
import { Home, Search } from "lucide-react";
import { MdEvent, MdOutlineEventNote } from "react-icons/md";
import { IoCreateSharp } from "react-icons/io5";
import MyCommittees from "../../StudentPages/StudentLayout/MyCommittees";
import FollowingCommittee from "../../StudentPages/StudentLayout/FollowingCommittee";

const fetchData = async () => {
  const response = await axiosInstance.post("/teacher/getAllTeacherData", {}); // Pass an empty object if needed
  return response.data;
};

export default function MobileSidebarComponent({ setIsDrawerOpen }) {
  const { logOutUser } = useContext(UserContext);
  const [inchargeArr, setInchargeArr] = useState([]);

  const { data, isError, error } = useQuery({
    queryKey: ["teacherData"],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.data?.committeePositions?.length > 0) {
      const memberarr = data?.data?.committeePositions?.filter(
        (item) => item?.position == "FACULTY_INCHARGE" && item.committeeObjId
      );
      setInchargeArr(memberarr);
    }
  }, [data]);

  if (isError) {
    console.error(error.message, "\n", error);
  }

  return (
    <>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <MobileSidebarItem
            icon={Home}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"/teacher"}
            routeName={"teacher"}
          >
            Home
          </MobileSidebarItem>

          <MobileSidebarItem
            icon={MdEvent}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"/teacher/events"}
            routeName={"events"}
          >
            Events
          </MobileSidebarItem>

          {inchargeArr?.length > 0 && (
            <>
              <MobileSidebarItem
                icon={IoCreateSharp}
                setIsDrawerOpen={setIsDrawerOpen}
                to={"createPost"}
                routeName={"createPost"}
              >
                Add Post
              </MobileSidebarItem>

              <MobileSidebarItem
                icon={MdOutlineEventNote}
                setIsDrawerOpen={setIsDrawerOpen}
                to={"createEvent"}
                routeName={"createEvent"}
              >
                Add Event
              </MobileSidebarItem>
            </>
          )}

          <MobileSidebarItem
            icon={Search}
            setIsDrawerOpen={setIsDrawerOpen}
            to={"explore"}
            routeName={"explore"}
          >
            Explore
          </MobileSidebarItem>
        </Sidebar.ItemGroup>

        <hr />
        {inchargeArr?.length > 0 && (
          <>
            {/* user committees */}
            <MyCommittees committeeArray={inchargeArr} />

            <hr />
          </>
        )}
        {/* user following committees */}
        <FollowingCommittee data={data} />

        <Sidebar.ItemGroup>
          <MobileSidebarLogout />
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </>
  );
}
