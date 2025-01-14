import React, { useContext } from "react";
import StudentPost from "./StudentPost";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { UserContext } from "../../../store/UserContextProvider";
import RightSidebar from "../../../Components/Layout/Desktop/RightSidebar";
import CentreMainContent from "../../../Components/Layout/Desktop/CentreMainContent";

export default function StudentHome() {
  const { userState } = useContext(UserContext);

  const students = useQuery({
    queryKey: ["posts"],
    queryFn: () => axiosInstance.post("/post/getAllPosts"),
  });

  if (students.isError) {
    console.log(students.error);

    return <ApiError error={students.error} isError={students.isError} />;
  }

  return (
    <>
      <CentreMainContent>
        <div className="pl-0 w-full m-auto p-0 inline-block ">
          {students.isLoading && (
            <>
              <p className="flex h-screen ml-96 items-center justify-center">
                Loading...
              </p>
            </>
          )}

          {!students.isLoading && (
            <>
              <div className="m-auto w-full">
                {students?.data?.data?.data.map((item) => (
                  <StudentPost
                    key={item._id}
                    data={item}
                    email={userState.email}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </CentreMainContent>
      <RightSidebar>
        <h1>test 1</h1>
        <h1>test 2</h1>
        <h1>test 3</h1>
        <h1>test 4</h1>
        <h1>test 5</h1>
        <h1>test 6</h1>
      </RightSidebar>
    </>
  );
}
