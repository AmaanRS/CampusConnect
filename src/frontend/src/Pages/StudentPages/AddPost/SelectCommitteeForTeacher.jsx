import React, { useEffect, useState } from "react";
import Select from "react-select";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { BarLoader, PulseLoader } from "react-spinners";

// Function to fetch data
const fetchData = async () => {
  const response = await axiosInstance.post("/teacher/getTeacher", {}); // Pass an empty object if needed
  return response.data;
};

export default function SelectCommitteeForTeacher({
  handleChange,
  isMulti = false,
}) {
  const [options, setOptions] = useState([]);

  // Fetch data using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teacherData"], // Unique query key
    queryFn: fetchData, // Function to fetch data
  });

  useEffect(() => {
    if (data?.data?.committeePositions) {
      const memberarr = data?.data?.committeePositions?.filter(
        (item) => item?.position == "FACULTY_INCHARGE" && item.committeeObjId
      );
      //   const temp = memberarr?.map((position) => ({
      //     value: position?.committeeObjId?.committeeId,
      //     label: position?.committeeObjId?.name,
      //   }));
      //   setOptions(temp);

      //   temporary solution
      const temp = memberarr?.map((position) => ({
        value: position?.committeeObjId,
        label: position?.committeeObjId,
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
      isMulti={isMulti}
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
      defaultValue={""}
      isClearable={true}
      isSearchable={true}
      options={options}
      isLoading={isLoading}
      onChange={handleChange}
    />
  );
}
