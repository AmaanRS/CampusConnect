import { useQuery } from "@tanstack/react-query";
import React from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import ApiError from "../../../Components/Errors/ApiError";
import { Button, Card, HR } from "flowbite-react";

const fetchData = async () => {
  const data = await axiosInstance.post("/getAllPendingCommittees");
  console.log("in response", data.response);
};

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
      "committee four committee four committee four committee four committee four committee four committee four committee four committee four committee four committee four committee four committee four ",
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
      "committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six committee six ",
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
    description:
      "committee eight committee eight committee eight committee eight committee eight committee eight committee eight committee eight committee eight committee eight committee eight committee eight committee eight ",
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
  const item = dummyData[0];
  const lorem = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

  return (
    <>
      <div className=" py-4 px-4">
        <Card className="max-w-md">
          <h5 className="text-2xl font-bold tracking-tight capitalize text-gray-900 dark:text-white">
            {item.name}
          </h5>
          <p className="font-normal custom-scrollbar text-gray-700 overflow-auto h-40  ">
            {lorem}
          </p>

          <div className="mt-2 flex space-x-3 lg:mt-3">
            <a
              href="#"
              className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4  dark:bg-cyan-600 dark:hover:bg-cyan-700 "
            >
              Add friend
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Message
            </a>
          </div>
        </Card>
      </div>
      <div className="h-screen"></div>
    </>
  );
}
