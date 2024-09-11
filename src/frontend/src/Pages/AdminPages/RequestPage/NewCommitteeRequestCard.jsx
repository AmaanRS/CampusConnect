import { Button, Card } from "flowbite-react";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

export default function NewCommitteeRequestCard({ item }) {
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
            <FaRegCheckCircle className="mr-2 h-5 w-5" />
            Accept
          </Button>

          <Button
            color={""}
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition duration-300"
          >
            <MdOutlineCancel className="mr-2 h-5 w-5" />
            Reject
          </Button>
        </div>
      </Card>
    </>
  );
}
