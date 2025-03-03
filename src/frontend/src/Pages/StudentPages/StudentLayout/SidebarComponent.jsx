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
import { MdGroups } from "react-icons/md";
import { Link } from "react-router-dom";
import MyCommittees from "./MyCommittees";

const fetchData = async () => {
  const response = await axiosInstance.post("/student/getAllStudentData", {}); // Pass an empty object if needed
  return response.data;
};

export default function SidebarComponent() {
  const { logOutUser } = useContext(UserContext);
  const [showAddPost, setShowAddPost] = useState(false);

  const { data, isError, error } = useQuery({
    queryKey: ["canUserAddPost"],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.data?.committeePositions?.length > 0) {
      setShowAddPost(true);
    } else {
      setShowAddPost(false);
    }
  }, [data]);

  if (isError) {
    console.log(error.message, "\n", error);
  }

  return (
    <Sidebar>
      <SidebarItem to="/student" icon={<Home size={20} />} text="Home" />
      {showAddPost && (
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
      <SidebarItem
        icon={<HiOutlineUserGroup size={20} />}
        text="Jobs/intenships/education"
      />
      <SidebarItem
        icon={<LiaChalkboardTeacherSolid size={20} />}
        text="online courses/certifications"
      />
      <hr />

      {/* user committees */}
      <MyCommittees committeeArray={data?.data?.committeePositions} />
      <hr />

      <SidebarButton
        onClick={() => logOutUser()}
        icon={<LogOutIcon className="inline" size={20} />}
        text="Logout"
      />
    </Sidebar>
  );
}
