import React from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const postData = async (data) => {
  const response = await axiosInstance.post(
    "/committee/addFollowerToCommittee",
    data
  );
  return response.data;
};

export default function Follow({ committeeId = "" }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      console.log("following", data);
      // alert("Data posted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["allcommittees"],
      });
    },
    onError: (error) => {
      console.error("Error posting data:", error);
      toast.error("Error following committee");
    },
  });
  function handleFollow() {
    mutation.mutate({ committeeId });
  }

  return (
    <div>
      <button
        disabled={mutation.isPending}
        onClick={handleFollow}
        type="button"
        className="bg-blue-700 hover:bg-blue-800 font-medium text-sm py-2 px-4 rounded-full text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Follow
      </button>
    </div>
  );
}
