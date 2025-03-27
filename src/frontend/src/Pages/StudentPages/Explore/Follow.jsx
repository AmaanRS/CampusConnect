import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UserContext } from "../../../store/UserContextProvider";

const postData = async (data) => {
  const response = await axiosInstance.post("/committee/toggleFollower", data);
  return response.data;
};

export default function Follow({ committeeId = "", followArray = [] }) {
  const [alreadyFollow, setAlreadyFollowing] = useState(false);
  const {
    userState: { email },
  } = useContext(UserContext);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      // alert("Data posted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["allcommittees"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getAllStudentData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["teacherData"],
      });

      setAlreadyFollowing((prev) => !prev);
    },
    onError: (error) => {
      console.error("Error posting data:", error);
      toast.error("Error following committee");
    },
  });

  useEffect(() => {
    // if (followArray?.length > 0) {
    const emailExists = followArray.some(
      (follower) => follower?.userId?.email === email
    );
    setAlreadyFollowing(emailExists);
    // }
  }, [followArray]);

  function handleFollow() {
    mutation.mutate({ committeeId });
  }

  return (
    <div>
      {!alreadyFollow && (
        <button
          disabled={mutation.isPending}
          onClick={handleFollow}
          type="button"
          className="bg-blue-700 hover:bg-blue-800 font-medium text-sm py-2 px-4 rounded-full text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Follow
        </button>
      )}
      {alreadyFollow && (
        <button
          disabled={mutation.isPending}
          onClick={handleFollow}
          type="button"
          className="bg-white border-slate-300 hover:bg-slate-100 border text-black font-medium text-sm py-2 px-4 rounded-full  transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Following
        </button>
      )}

      {/* <button
        disabled={mutation.isPending}
        onClick={handleFollow}
        type="button"
        className="border text-slate-800 font-medium text-xs border-slate-700 hover:border-slate-900 rounded-full px-3 py-1.5 hover:bg-slate-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed  "
      >
        Follow
      </button> */}
    </div>
  );
}
