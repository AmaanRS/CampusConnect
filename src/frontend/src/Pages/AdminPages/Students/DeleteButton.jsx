import React from "react";
import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const postData = async (data) => {
  const response = await axiosInstance.post("/student/deleteStudent", data);
  return response.data;
};

export default function DeleteButton({ studentEmail }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      toast.success("User removed successfully!");
      queryClient.invalidateQueries({
        queryKey: ["allstudents"],
      });
      //   navigate("/student");
    },
    onError: (error) => {
      console.error("Error Removing user:", error);
      toast.error("Error Removing User!");
    },
  });

  function handleSubmit() {
    const data = { studentEmail };
    mutation.mutate(data);
  }

  return (
    <button
      onClick={handleSubmit}
      disabled={mutation.isPending}
      type="button"
      className="bg-red-500 hover:bg-red-600 flex justify-center items-center text-white py-2 px-2 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed  "
    >
      <MdOutlinePersonRemoveAlt1 className="text-lg mr-1 font-bold" />
      Remove
    </button>
  );
}
