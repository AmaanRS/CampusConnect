import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import ApiError from "../../../Components/Errors/ApiError";
import AllCommitteeCard from "./AllCommitteeCard";
import AllCommitteesCardSkeleton from "./AllCommitteesCardSkeleton";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import { Tabs } from "flowbite-react";
import EmptyComment from "../../StudentPages/PostDetails/Comment/EmptyComment";
import {
  BarLoader,
  ClimbingBoxLoader,
  HashLoader,
  PulseLoader,
} from "react-spinners";

export default function AllCommittees() {
  const {
    data: committees = [],
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["allCommittee"],
    queryFn: () => axiosInstance.post("/committee/getAllCommittees"),
  });
  const [list, setList] = useState({
    acceptedCommittees: [],
    pendingCommittees: [],
    deletedCommittees: [],
  });

  useEffect(() => {
    if (committees?.data?.data?.length > 0) {
      const allArray = committees?.data?.data;

      const acceptedCommittees = allArray.filter(
        (committee) => committee.status === "ACCEPTED"
      );
      const pendingCommittees = allArray.filter(
        (committee) => committee.status === "PENDING"
      );
      const deletedCommittees = allArray.filter(
        (committee) => committee.status === "DELETED"
      );

      const categorisedList = {
        acceptedCommittees,
        pendingCommittees,
        deletedCommittees,
      };
      setList(categorisedList);
    }
  }, [committees]);

  if (isError) {
    console.log(error);

    return <ApiError error={error} isError={isError} />;
  }

  if (isLoading) {
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

  // return <>Working</>;

  return (
    <>
      <CentreMainContent>
        <div className=" px-2 ">
          {(isLoading || committees?.data?.data?.length !== 0) && (
            <p className="mb-3 md:text-2xl text-center font-bold text-xl ">
              All Committees
            </p>
          )}
          {committees?.data?.data.length === 0 && (
            <p className="text-2xl font-bold text-center  border-2   w-fit m-auto p-4 rounded-md border-slate-400">
              There are no Pending Requests for New Committee
            </p>
          )}

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
              {/* pending committee */}
              <Tabs.Item title="Pending">
                {list?.pendingCommittees?.length !== 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1  gap-4">
                      {list.pendingCommittees.map((item) => {
                        return (
                          <AllCommitteeCard
                            type="PENDING"
                            key={item.committeeId}
                            item={item}
                          />
                        );
                      })}
                    </div>
                  </>
                )}

                {list?.pendingCommittees?.length == 0 && (
                  <EmptyComment type="pending committes" />
                )}
              </Tabs.Item>
              {/* active committees */}
              <Tabs.Item active title="Active">
                {list?.acceptedCommittees?.length !== 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1  gap-4">
                      {list.acceptedCommittees.map((item) => {
                        return (
                          <AllCommitteeCard
                            type="ACTIVE"
                            key={item.committeeId}
                            item={item}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
                {list?.acceptedCommittees?.length == 0 && (
                  <EmptyComment type="Active committes" />
                )}
              </Tabs.Item>
              {/* deleted committees */}
              <Tabs.Item title="Deleted">
                {list?.deletedCommittees?.length !== 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1  gap-4">
                      {list.deletedCommittees.map((item) => {
                        return (
                          <AllCommitteeCard
                            type="DELETED"
                            key={item.committeeId}
                            item={item}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
                {list?.deletedCommittees?.length == 0 && (
                  <EmptyComment type="deleted committees" />
                )}
              </Tabs.Item>
            </Tabs>
          </>
        </div>
      </CentreMainContent>
    </>
  );
}
