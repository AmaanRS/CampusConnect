import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card } from "flowbite-react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AllCommitteeCard({ item, type = "ACTIVE" }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data) => axiosInstance.post("/changeStatusOfCommittee", data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["allCommittee"]);
      toast.success("Status Changed");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Request Failed");
    },
  });

  function handleAccept() {
    mutation.mutate({
      committeeId: item.committeeId,
      action: "ACCEPTED",
    });
  }

  function handleDelete() {
    mutation.mutate({
      committeeId: item.committeeId,
      action: "DELETED",
    });
  }
  return (
    <>
      <Card className=" m-auto  max-w-xl w-[500px] bg-white  shadow-lg rounded-lg overflow-hidden ">
        <h5 className="text-2xl font-bold tracking-tight capitalize text-gray-900  mb-1">
          {item.name}
        </h5>

        <p className="font-normal text-gray-700 dark:text-gray-400 custom-scrollbar overflow-hidden hover:overflow-auto max-h-60  mb-2 ">
          {item.description}
        </p>

        <div>
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
            {item.status}
          </span>
        </div>

        <div className="mb-1">
          <span className="font-semibold text-gray-900 dark:text-gray-300">
            Departments:
          </span>
          <div className="mt-1 flex flex-wrap">
            {item.committeeOfDepartment.map((dep) => (
              <span
                className="bg-blue-100 text-gray-800   px-3 py-1 mx-1 my-1 rounded-full text-sm"
                key={dep}
              >
                {dep}
              </span>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          {type !== "DELETED" && (
            <Button
              onClick={() =>
                navigate(`/admin/committee/edit/${item.committeeId}`)
              }
              color={""}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300"
            >
              <MdEdit className="mr-2 h-5 w-5" />
              Edit
            </Button>
          )}

          {item.status !== "ACCEPTED" && (
            <Button
              disabled={mutation.isPending}
              color={""}
              onClick={() => handleAccept()}
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition duration-300"
            >
              <FaCheck className="mr-2 text-xl h-5 w-5" />
              {mutation.isPending ? "Accepting" : "Accept"}
            </Button>
          )}

          {item.status !== "DELETED" && (
            <Button
              disabled={mutation.isPending}
              color={""}
              onClick={() => handleDelete()}
              className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition duration-300"
            >
              <MdDelete className="mr-2 text-xl h-5 w-5" />
              {mutation.isPending ? "Deleting" : "Delete"}
            </Button>
          )}
        </div>
      </Card>
    </>
  );
}
