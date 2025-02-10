import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { BarLoader, PulseLoader } from "react-spinners";
import axiosInstance from "../../../../utils/Axios/AxiosInstance";

// Function to fetch data
const fetchData = async () => {
  const response = await axiosInstance.post("/student/getAllStudentsEmail", {});
  return response.data;
};

export default function StudentSelect({ handleStudentEmail }) {
  const [options, setOptions] = useState([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["StudentEmailList"],
    queryFn: fetchData,
  });

  useEffect(() => {
    if (data?.data) {
      console.log(data?.data);
      const temp = data?.data?.map((student) => ({
        value: student?.email,
        label: student?.email,
      }));
      setOptions(temp);
    }
  }, [data]);

  // if (isLoading)
  //   return (
  //     <p className="">
  //       <BarLoader size={9} />
  //     </p>
  //   );
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <Select
      placeholder="Select Committee"
      styles={{
        input: (base) => ({
          ...base,
          "input:focus": {
            boxShadow: "none",
          },
          cursor: "text",
        }),
        valueContainer: (base) => ({
          ...base,
          padding: "8px",
        }),
      }}
      isLoading={isLoading}
      defaultValue={""}
      isClearable={true}
      isSearchable={true}
      options={options}
      onChange={handleStudentEmail}
    />
  );
}
