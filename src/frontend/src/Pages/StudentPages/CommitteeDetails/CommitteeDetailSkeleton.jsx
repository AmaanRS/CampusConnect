import React from "react";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import PostDetailSkeleton from "../PostDetails/Skeletons/PostDetailSkeleton";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import SidebarSkeleton from "../Components/CommitteeSidebar/skeletons/SidebarSkeleton";
import { Tabs } from "flowbite-react";

export default function CommitteeDetailSkeleton() {
  return (
    <>
      <div className="animate-pulse">
        <CentreMainContent>
          <div></div>
          <div className="flex animate-pulse bg-slate-100 py-2 rounded-lg items-center mb-4 px-4 ">
            <div className="rounded-full bg-slate-200 h-16 w-16 "></div>

            <p className="ml-6 rounded-md h-6 w-40 bg-slate-200"> </p>
          </div>

          <hr className="" />
          {/* tab skeleton */}
          <div className="animate-pulse h-10 py-8 pl-4  flex items-center">
            <div className="flex">
              <p className="h-5 w-5 rounded-md bg-slate-200 "></p>
              <p className="h-5 ml-2 w-12 rounded-md bg-slate-200 "></p>
            </div>
            <div className="flex ml-4">
              <p className="h-5 w-5 rounded-md bg-slate-200 "></p>
              <p className="h-5 ml-2 w-12 rounded-md bg-slate-200 "></p>
            </div>
          </div>
          <hr className="mb-4" />
          <div>
            <PostDetailSkeleton />
          </div>
        </CentreMainContent>
        <RightSidebar>
          <SidebarSkeleton />
        </RightSidebar>
      </div>
    </>
  );
}
