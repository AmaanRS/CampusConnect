import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card } from "flowbite-react";
import { MdDelete, MdEdit, MdOutlineCancel } from "react-icons/md";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { toast } from "react-toastify";

export default function AllCommitteeCard({ item }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data) =>
      axiosInstance.post("/committee/deleteCommittee", data),
    onSuccess: (data) => {
      console.log("data is ", data);
      queryClient.invalidateQueries(["allCommittee"]);
      toast.success("Deleted Committee");
    },
    onError: (error) => {
      console.log(error);
      toast.error("failed to create");
    },
  });

  function handleDelete() {
    console.log(item._id);
    mutation.mutate({
      committeeId: item.committeeId,
    });
  }
  return (
    <>
      <Card className=" max-w-lg bg-white  shadow-lg rounded-lg overflow-hidden ">
        <h5 className="text-2xl font-bold tracking-tight capitalize text-gray-900  mb-1">
          {item.name}
        </h5>

        <p className="font-normal text-gray-700 dark:text-gray-400 custom-scrollbar overflow-auto max-h-60 md:h-40 mb-2 ">
          {item.description}
        </p>

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
          <Button
            color={""}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300"
          >
            <MdEdit className="mr-2 h-5 w-5" />
            Edit
          </Button>

          <Button
            disabled={mutation.isPending}
            color={""}
            onClick={handleDelete}
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition duration-300"
          >
            <MdDelete className="mr-2 h-5 w-5" />
            {mutation.isPending ? "Deleting" : "Delete"}
          </Button>
        </div>
      </Card>
    </>
  );
}
