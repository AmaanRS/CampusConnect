import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import ApiError from "../../../Components/Errors/ApiError";
import { Badge, Button, Card, HR } from "flowbite-react";
import { FaCheck } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import NewCommitteeRequestCard from "./NewCommitteeRequestCard";

const dummyData = [
  {
    _id: "66e137be84f04e8383ba42f5",
    name: "committee three",
    description:
      "committee three committee three committee three committee three committee three committee three committee three committee three ",
    studentIncharge: "66d8a996546965112293c8b0",
    facultyIncharge: "66d8aaf9546965112293c8b8",
    facultyTeam: ["66d8aaf9546965112293c8b8"],
    members: ["66d8a996546965112293c8b0"],
    events: [],
    status: "PENDING",
    committeeOfDepartment: ["IT", "COMS"],
    committeeId: "b52l2",
    createdAt: "2024-09-11T06:25:02.340Z",
    updatedAt: "2024-09-11T06:25:02.340Z",
    __v: 0,
  },
  {
    _id: "66e13a3484f04e8383ba4303",
    name: "committee four",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ",
    studentIncharge: "66d8a996546965112293c8b0",
    facultyIncharge: "66d8aaf9546965112293c8b8",
    facultyTeam: ["66d8aaf9546965112293c8b8"],
    members: ["66d8a996546965112293c8b0"],
    events: [],
    status: "PENDING",
    committeeOfDepartment: ["IT", "COMS", "AIDS"],
    committeeId: "k18lc",
    createdAt: "2024-09-11T06:35:32.353Z",
    updatedAt: "2024-09-11T06:35:32.353Z",
    __v: 0,
  },
  {
    _id: "66e13a4384f04e8383ba430f",
    name: "committee six",
    description:
      "committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ",
    studentIncharge: "66d8a996546965112293c8b0",
    facultyIncharge: "66d8aaf9546965112293c8b8",
    facultyTeam: ["66d8aaf9546965112293c8b8"],
    members: ["66d8a996546965112293c8b0"],
    events: [],
    status: "PENDING",
    committeeOfDepartment: ["COMS", "AIDS"],
    committeeId: "9oeh6",
    createdAt: "2024-09-11T06:35:47.838Z",
    updatedAt: "2024-09-11T06:35:47.838Z",
    __v: 0,
  },
  {
    _id: "66e13a4f84f04e8383ba431b",
    name: "committee eight",
    description: `Typhoon Yagi (satellite image shown) leaves more than 150 people dead in China, Vietnam, and the Philippines.
Michel Barnier is appointed prime minister of France by President Emmanuel Macron, leading to nationwide anti-government protests.
An attempted jailbreak at Makala Central Prison in Kinshasa, Democratic Republic of the Congo, leaves 129 people dead.
A Mil Mi-8 helicopter crashes in Kamchatka, Russia, killing all 22 people on board.
Ongoing: Israel Hamas war timelineRussian invasion of Ukraine timelineSudanese civil war timeline
Recent deaths: James Earl JonesAna GervasiHenny MoanRebecca HornRadha Charan GuptaVladimir Bure
`,
    studentIncharge: "66d8a996546965112293c8b0",
    facultyIncharge: "66d8aaf9546965112293c8b8",
    facultyTeam: ["66d8aaf9546965112293c8b8"],
    members: ["66d8a996546965112293c8b0"],
    events: [],
    status: "PENDING",
    committeeOfDepartment: ["COMS", "IT"],
    committeeId: "a5e11",
    createdAt: "2024-09-11T06:35:59.584Z",
    updatedAt: "2024-09-11T06:35:59.584Z",
    __v: 0,
  },
];

export default function NewRequest() {
  const [isSingle, setIsSingle] = useState(false);
  //   const committeRequest = useQuery({
  //     queryKey: ["committeRequest"],
  //     queryFn: () => axiosInstance.post("/getAllPendingCommittees"),
  //     staleTime: 1000 * 60 * 10,
  //   });

  //   if (committeRequest.isLoading) {
  //     return <p>Loading....</p>;
  //   }

  //   if (committeRequest.isError) {
  //     console.log(committeRequest.error);

  //     return (
  //       <ApiError
  //         error={committeRequest.error}
  //         isError={committeRequest.isError}
  //       />
  //     );
  //   }
  // const fetchData = async () => {
  //   const data = await axiosInstance.post("/getAllPendingCommittees");
  // };
  // fetchData();
  const dummyDat = [];

  return (
    <>
      <div className=" py-4 px-4 ">
        {dummyData.length !== 0 && (
          <>
            <p className="mb-3 md:text-2xl text-center font-bold text-xl ">
              New Committee Requests
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-4">
              {dummyData.map((item) => {
                return (
                  <NewCommitteeRequestCard key={item.committeeId} item={item} />
                );
              })}
            </div>
          </>
        )}
        {dummyData.length === 0 && (
          <p className="text-2xl font-bold text-center ">
            There are no Pending Requests
          </p>
        )}
      </div>
    </>
  );
}
