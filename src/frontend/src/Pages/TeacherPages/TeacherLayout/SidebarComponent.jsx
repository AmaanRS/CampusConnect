import Sidebar from "../../../Components/Layout/Desktop/Sidebar";

import {
  LayoutDashboard,
  User,
  Search,
  Settings,
  LogOutIcon,
  Home,
} from "lucide-react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiStudent } from "react-icons/pi";
import { TbDevicesQuestion } from "react-icons/tb";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../store/UserContextProvider";
import SidebarButton from "../../../Components/Layout/Desktop/SidebarButton";
import SidebarItem from "../../../Components/Layout/Desktop/SidebarItem";
import { MdEvent, MdOutlineEventNote } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { IoCreateSharp } from "react-icons/io5";
import MyCommittees from "../../StudentPages/StudentLayout/MyCommittees";
import { Accordion } from "flowbite-react";

const fetchData = async () => {
  const response = await axiosInstance.post("/teacher/getTeacher", {}); // Pass an empty object if needed
  return response.data;
};

export default function SidebarComponent() {
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
    <Sidebar>
      <SidebarItem to="/teacher" icon={<Home size={20} />} text="Home" />
      <SidebarItem to="events" icon={<MdEvent size={20} />} text="Events" />
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
      <Accordion className="border-none">
        <Accordion.Panel>
          <Accordion.Title className="bg-white border-none outline-none shadow-none  ring-0 focus:ring-0 p-0  py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors duration-200 group hover:bg-indigo-50 text-gray-600">
            Following
          </Accordion.Title>

          <Accordion.Content className="p-0">
            {/* in case of not following any committee */}
            {data?.data?.followingCommittees?.length == 0 && (
              <p className="relative flex items-center py-2 px-3 my-1 font-medium   text-gray-600">
                No Committees
              </p>
            )}

            {data?.data?.followingCommittees?.map((item) => {
              return <p key={item}>{item}</p>;
            })}
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
      <hr />

      <SidebarButton
        onClick={() => logOutUser()}
        icon={<LogOutIcon className="inline" size={20} />}
        text="Logout"
      />
    </Sidebar>
  );
}
