import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import ApiError from "../../../Components/Errors/ApiError";
import AllCommitteeCard from "./AllCommitteeCard";
import AllCommitteesCardSkeleton from "./AllCommitteesCardSkeleton";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import PopularCommittees from "../../StudentPages/Home/PopularCommittee/PopularCommittees";
import { Tabs } from "flowbite-react";

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
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 m-auto max-w-xl mb-4">
          <AllCommitteesCardSkeleton />
          <AllCommitteesCardSkeleton />
          <AllCommitteesCardSkeleton />
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
            <Tabs aria-label="Default tabs" variant="default">
              <Tabs.Item active title="Pending">
                {list?.pendingCommittees?.length !== 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1  gap-4">
                      {list.pendingCommittees.map((item) => {
                        return (
                          <AllCommitteeCard
                            key={item.committeeId}
                            item={item}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </Tabs.Item>
              <Tabs.Item title="Active">
                {list?.acceptedCommittees?.length !== 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1  gap-4">
                      {list.acceptedCommittees.map((item) => {
                        return (
                          <AllCommitteeCard
                            key={item.committeeId}
                            item={item}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </Tabs.Item>
              <Tabs.Item title="Deleted">
                {list?.deletedCommittees?.length !== 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1  gap-4">
                      {list.deletedCommittees.map((item) => {
                        return (
                          <AllCommitteeCard
                            key={item.committeeId}
                            item={item}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </Tabs.Item>
            </Tabs>
          </>
        </div>
      </CentreMainContent>
    </>
  );
}
