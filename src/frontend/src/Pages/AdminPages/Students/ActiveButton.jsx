import React from "react";
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonRemoveAlt1,
} from "react-icons/md";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const postData = async (data) => {
  const response = await axiosInstance.post(
    "/admin/reactivateUserAccount",
    data
  );
  return response.data;
};

export default function ActiveButton({ userEmail }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      toast.success("User Activated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["allstudents"],
      });
      //   navigate("/student");
    },
    onError: (error) => {
      console.error("Error activating user:", error);
      toast.error("Error Activating User!");
    },
  });

  function handleSubmit() {
    const data = { userEmail };
    mutation.mutate(data);
  }

  return (
    <button
      onClick={handleSubmit}
      disabled={mutation.isPending}
      type="button"
      className="bg-green-500 hover:bg-green-600 flex justify-center items-center text-white py-2 px-2 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed  "
    >
      <MdOutlinePersonAddAlt1 className="text-lg mr-1 font-bold" />
      Activate
    </button>
  );
}
