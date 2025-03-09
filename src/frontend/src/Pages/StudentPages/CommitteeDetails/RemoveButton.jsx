import React from "react";
import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const postData = async (data) => {
  const response = await axiosInstance.post(
    "/committee/removeMembersFromCommittee",
    data
  );
  return response.data;
};

export default function RemoveButton({ committeeId, memberEmail }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      toast.success("Member removed successfully!");
      queryClient.invalidateQueries({
        queryKey: ["committee", committeeId],
      });
      //   navigate("/student");
    },
    onError: (error) => {
      console.error("Error Removing member:", error);
      toast.error("Error Removing member!");
    },
  });

  function handleSubmit() {
    const data = { committeeId, members: memberEmail };
    mutation.mutate(data);
  }

  return (
    <button
      onClick={handleSubmit}
      disabled={mutation.isPending}
      type="button"
      className="bg-red-600 hover:bg-red-700 flex justify-center items-center text-white py-1.5 px-2 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed  "
    >
      <MdOutlinePersonRemoveAlt1 className="text-lg mr-1 font-bold" />
      Remove
    </button>
  );
}
