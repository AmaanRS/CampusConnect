import React, { useContext, useEffect, useState } from "react";
import { User, Search, Settings, LogOutIcon, Home } from "lucide-react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import Sidebar from "../../../Components/Layout/Desktop/Sidebar";
import SidebarItem from "../../../Components/Layout/Desktop/SidebarItem";
import SidebarButton from "../../../Components/Layout/Desktop/SidebarButton";
import { UserContext } from "../../../store/UserContextProvider";
import { IoCreateSharp } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { MdOutlineEventNote } from "react-icons/md";
import { Accordion, Avatar } from "flowbite-react";
import { MdEvent } from "react-icons/md";

import MyCommittees from "./MyCommittees";
import FollowingCommittee from "./FollowingCommittee";

const fetchData = async () => {
  const response = await axiosInstance.post("/student/getAllStudentData", {}); // Pass an empty object if needed
  return response.data;
};

export default function SidebarComponent() {
  const { logOutUser } = useContext(UserContext);
  const [inchargeArr, setInchargeArr] = useState([]);

  const { data, isError, error } = useQuery({
    queryKey: ["studentData"],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.data?.committeePositions?.length > 0) {
      const memberarr = data?.data?.committeePositions?.filter(
        (item) => item?.position == "STUDENT_INCHARGE" && item.committeeObjId
      );
      setInchargeArr(memberarr);
    }
  }, [data]);

  if (isError) {
    console.error(error.message, "\n", error);
  }

  return (
    <Sidebar>
      <SidebarItem to="/student" icon={<Home size={20} />} text="Home" />
      <SidebarItem to="events" icon={<MdEvent size={20} />} text="Events" />
      <SidebarItem to="calendar" icon={<MdEvent size={20} />} text="Calendar" />
      {inchargeArr?.length > 0 && (
        <>
          <SidebarItem
            to="createPost"
            icon={<IoCreateSharp size={20} />}
            text="Add Post"
          />
          <SidebarItem
            to="createEvent"
            icon={<MdOutlineEventNote size={20} />}
            text="Add Event"
          />
        </>
      )}
      <SidebarItem to="explore" icon={<Search size={20} />} text="Explore " />
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
      <hr />
      <SidebarButton
        onClick={() => logOutUser()}
        icon={<LogOutIcon className="inline" size={20} />}
        text="Logout"
      />
    </Sidebar>
  );
}
