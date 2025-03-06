import React from "react";
import StudentPost from "../Components/PostPreview/Post/StudentPost";
import { Avatar, Tabs } from "flowbite-react";
import { MdGroups } from "react-icons/md";
import { AiOutlineFileText } from "react-icons/ai";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function CommitteeList({ name = "committee name", posts = [] }) {
  // return <>"work in progress"</>;
  return (
    <>
      <div className="flex bg-slate-100 rounded-lg items-center mb-4 px-4 ">
        <Avatar
          img={MdGroups}
          size="lg"
          rounded
          className="  rounded-full text-slate-300 "
        />
        <p className="ml-2 font-bold text-2xl text-slate-600"> {name} </p>
      </div>
      <div className="max-w-3xl m-auto">
        <hr className="mb-2 mx-1" />

        {/* tabs to switch between event and post */}
        <div>
          <Tabs
            theme={{
              tablist: {
                variant: {
                  underline: "-mb-px flex-wrap border-b border-gray-200 ",
                },
                tabitem: {
                  base: "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
                  variant: {
                    underline: {
                      base: "rounded-t-lg",
                      active: {
                        on: "active rounded-t-lg border-b-2 border-blue-600 text-blue-600 ",
                        off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600",
                      },
                    },
                  },
                  icon: "mr-2 h-5 w-5",
                },
              },
              tabpanel: "py-3",
            }}
            aria-label="Tabs with underline"
            variant="underline"
          >
            <Tabs.Item active title="Posts" icon={AiOutlineFileText}>
              {posts?.map((post) => {
                return (
                  <StudentPost
                    mode="committee"
                    key={post?.postId}
                    postData={post}
                  />
                );
              })}
            </Tabs.Item>
            <Tabs.Item title="Events" icon={FaRegCalendarAlt}>
              This is{" "}
              <span className="font-medium text-gray-800 dark:text-white">
                Dashboard tab's associated content
              </span>
              . Clicking another tab will toggle the visibility of this one for
              the next. The tab JavaScript swaps classes to control the content
              visibility and styling.
            </Tabs.Item>
          </Tabs>
        </div>
      </div>
    </>
  );
}
