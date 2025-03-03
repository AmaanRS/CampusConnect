import React from "react";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosInstance from "../../../../utils/Axios/AxiosInstance";

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
      //   queryClient.invalidateQueries({ queryKey: ["committee", committeeId] });
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
        className="border text-slate-800 font-medium text-xs border-slate-700 hover:border-slate-900 rounded-full px-3 py-1.5 hover:bg-slate-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed  "
      >
        Follow
      </button>
    </div>
  );
}
