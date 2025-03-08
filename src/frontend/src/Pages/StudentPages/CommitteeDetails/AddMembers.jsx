import React, { useState } from "react";
import StudentSelect from "./StudentSelect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useNavigate } from "react-router-dom";

const postData = async (data) => {
  const response = await axiosInstance.post(
    "/committee/addMembersInCommittee",
    data
  );
  return response.data;
};

export default function AddMembers({ committeeId }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [members, setMembers] = useState([]);
  const [formError, setFormError] = useState("");

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      toast.success("Memberd addded successfully!");
      navigate(`/student/committee/${committeeId}`);
      queryClient.invalidateQueries({
        queryKey: ["committee", committeeId],
      });
      //   navigate("/student");
    },
    onError: (error) => {
      console.error("Error adding member:", error);
      toast.error("Error adding member!");
    },
  });

  function handleStudentEmail(e) {
    setFormError("");
    let arr = e?.map(({ value }) => value);
    setMembers(arr);
  }

  function handleSubmit() {
    if (members.length === 0) {
      setFormError("Please select some value");
      return;
    }
    const data = { committeeId, members };
    mutation.mutate(data);
  }

  return (
    <div>
      <div className="mt-6 mx-2">
        <div className="text-slate-700 font-medium mb-2">Select Students</div>
        <StudentSelect
          isDisabled={mutation.isPending}
          handleStudentEmail={handleStudentEmail}
        />
        <div className=" mt-2 flex justify-center">
          <button
            disabled={mutation.isPending}
            onClick={handleSubmit}
            className="mt-2  bg-blue-600 text-white rounded-lg py-2 px-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add Members
          </button>
        </div>
        {formError && (
          <p className="text-center mt-4 text-red-600">Error: {formError}</p>
        )}
        {mutation.isError && (
          <p className="text-center mt-4 text-red-600">
            Error: {mutation.error.message}
          </p>
        )}
      </div>
    </div>
  );
}
