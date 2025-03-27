import React from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

const postData = async (data) => {
  const response = await axiosInstance.post("/promotion/deletePromotion", data);
  return response.data;
};

export default function DeletePromotion({ promoId }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      toast.success("Promotion removed successfully!");
      queryClient.invalidateQueries({
        queryKey: ["allPromotions"],
      });
      //   navigate("/student");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error Deleting Promotion");
    },
  });

  function handleSubmit() {
    const data = { promoId };
    mutation.mutate(data);
  }

  return (
    <button
      disabled={mutation.isPending}
      onClick={handleSubmit}
      className="w-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-left py-2 px-5 text-white disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MdDelete className="mr-2 text-lg" />
      <span className="font-medium">Delete</span>
    </button>
  );
}
