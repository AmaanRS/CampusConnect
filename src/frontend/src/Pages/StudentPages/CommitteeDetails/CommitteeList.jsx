import React, { useContext } from "react";
import StudentPost from "../Components/PostPreview/Post/StudentPost";
import { Avatar, Tabs } from "flowbite-react";
import { MdGroups } from "react-icons/md";
import { AiOutlineFileText } from "react-icons/ai";
import { FaRegCalendarAlt } from "react-icons/fa";
import EventPost from "../AllEvents/EventPost";
import EmptyComment from "../PostDetails/Comment/EmptyComment";
import { MdPersonAddAlt } from "react-icons/md";
import AddMembers from "./AddMembers";
import CommitteMembers from "./CommitteMembers";
import { UserContext } from "../../../store/UserContextProvider";

const tabTheme = {
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
  tabpanel: "py-0",
};

export default function CommitteeList({
  name = "committee name",
  posts = [],
  events = [],
  committeeId = "",
  members = [],
  committeeData,
}) {
  const {
    userState: { email },
  } = useContext(UserContext);
  const isStudentIncharge = committeeData?.studentIncharge?.email === email;

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
            theme={tabTheme}
            aria-label="Tabs with underline"
            variant="underline"
          >
            {/* post list */}
            <Tabs.Item active title="Posts" icon={AiOutlineFileText}>
              {posts?.length == 0 && <EmptyComment type="posts" />}
              {posts?.length > 0 &&
                posts?.map((post) => {
                  return (
                    <StudentPost
                      mode="committee"
                      key={post?.postId}
                      postData={post}
                      isIncharge={isStudentIncharge}
                    />
                  );
                })}
            </Tabs.Item>

            {/* event list */}
            <Tabs.Item title="Events" icon={FaRegCalendarAlt}>
              {events?.length == 0 && <EmptyComment type="events" />}
              {events?.length > 0 &&
                events?.map((event) => {
                  return (
                    <EventPost
                      committeeData={committeeData}
                      committeeName={name}
                      mode="committee"
                      key={event?._id}
                      eventData={event}
                    />
                  );
                })}
            </Tabs.Item>

            {/* members tab */}
            {isStudentIncharge && (
              <Tabs.Item title="Members" icon={MdPersonAddAlt}>
                <CommitteMembers committeeId={committeeId} members={members} />
              </Tabs.Item>
            )}
          </Tabs>
        </div>
      </div>
    </>
  );
}
