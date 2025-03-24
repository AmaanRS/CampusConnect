import React, { useEffect, useState } from "react";
import { List, Tabs } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import ApiError from "../../../Components/Errors/ApiError";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import StudentItem from "./StudentItem";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import { PulseLoader } from "react-spinners";
import EmptyComment from "../../StudentPages/PostDetails/Comment/EmptyComment";

export default function AllTeachers() {
  const [list, setList] = useState({
    activeUsers: [],
    deletedUsers: [],
  });

  const students = useQuery({
    queryKey: ["allstudents"],
    queryFn: () => axiosInstance.post("/student/getAllStudents"),
  });

  useEffect(() => {
    if (students?.data?.data?.data?.length > 0) {
      const allArray = students?.data?.data?.data;
      const activeUsers = allArray.filter((item) => item.isAccountActive);
      const deletedUsers = allArray.filter((item) => !item.isAccountActive);
      const categorisedList = {
        activeUsers,
        deletedUsers,
      };
      setList(categorisedList);
    }
  }, [students.data]);

  if (students.isLoading) {
    return (
      <>
        <div className="h-screen w-full flex items-center justify-center pb-32">
          <PulseLoader
            color="#1a56db"
            size={16}
            speedMultiplier={1}
            className="m-auto"
          />
        </div>
      </>
    );
  }

  if (students.isError) {
    return <ApiError error={students.error} isError={students.isError} />;
  }

  return (
    <>
      <CentreMainContent>
        <p className="mb-3 md:text-2xl text-center font-bold text-xl ">
          All Students
        </p>

        {/* tabs */}
        <>
          <Tabs
            theme={{
              tablist: {
                tabitem: {
                  base: "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:outline-none  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
                  variant: {
                    default: {
                      active: {
                        on: "bg-indigo-100 text-indigo-700",
                        off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600 ",
                      },
                    },
                  },
                },
              },
              tabitemcontainer: {
                base: "",
                variant: {
                  default: "",
                  underline: "",
                  pills: "",
                  fullWidth: "",
                },
              },
              tabpanel: "py-3",
            }}
            variant="default"
          >
            {/* active users */}
            <Tabs.Item active title="Active">
              {list?.activeUsers?.length !== 0 && (
                <>
                  <div className="max-w-xl border  mx-auto   p-4  bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <List
                      unstyled
                      className="divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      {list.activeUsers.map((item) => (
                        <StudentItem
                          key={item._id}
                          email={item?.email}
                          isActive={item?.isAccountActive}
                        />
                      ))}
                    </List>
                  </div>
                </>
              )}

              {list?.activeUsers?.length == 0 && (
                <EmptyComment type="Active Teachers" />
              )}
            </Tabs.Item>

            {/* deleted users */}
            <Tabs.Item title="Deleted">
              {list?.deletedUsers?.length !== 0 && (
                <>
                  <div className="max-w-xl border  mx-auto  p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <List
                      unstyled
                      className="divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      {list.deletedUsers.map((item) => (
                        <StudentItem
                          key={item._id}
                          email={item?.email}
                          isActive={item?.isAccountActive}
                        />
                      ))}
                    </List>
                  </div>
                </>
              )}

              {list?.deletedUsers?.length == 0 && (
                <EmptyComment type="Inactivate Teachers" />
              )}
            </Tabs.Item>
          </Tabs>
        </>
      </CentreMainContent>
    </>
  );
}
