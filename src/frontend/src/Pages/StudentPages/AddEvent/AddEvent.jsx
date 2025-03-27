import { Button, Label } from "flowbite-react";
import React, { useContext, useState } from "react";
import TipTap from "../../../Components/RichTextEditor/TipTap";
import { format, isAfter, parse } from "date-fns";

import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SelectCommittee from "../AddPost/SelectCommittee";
import { Datepicker } from "flowbite-react";
import { UserContext } from "../../../store/UserContextProvider";
import SelectCommitteeForTeacher from "../AddPost/SelectCommitteeForTeacher";
import { AccountType } from "../../../utils/enum";
import ApiError from "../../../Components/Errors/ApiError";

const datePickerTheme = {
  root: {
    base: "relative",
    input: {
      field: {
        input: {
          base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
          sizes: {
            md: "p-3",
          },
          colors: {
            gray: "border-gray-300  text-gray-900 ",
          },
        },
      },
    },
  },

  popup: {
    root: {
      base: "absolute mt-2 top-10 z-50 block pt-2",
    },

    footer: {
      button: {
        base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium bg-blue-600",
        today: "bg-blue-700 text-white hover:bg-blue-800 ",
      },
    },
  },
  views: {
    days: {
      items: {
        item: {
          selected: "bg-blue-700 text-white hover:bg-blue-600",
        },
      },
    },
    months: {
      items: {
        item: {
          selected: "bg-blue-700 text-white hover:bg-blue-600",
        },
      },
    },
    years: {
      items: {
        item: {
          selected: "bg-blue-700 text-white hover:bg-blue-600",
        },
      },
    },
    decades: {
      items: {
        item: {
          selected: "bg-blue-700 text-white hover:bg-blue-600",
        },
      },
    },
  },
};

const postData = async (data) => {
  const response = await axiosInstance.post("/event/createEvent", data);
  return response.data;
};

const formatDate = (inputDate) => {
  const parsedDate = parse(inputDate, "MMMM dd, yyyy", new Date());
  const formattedDate = format(parsedDate, "dd-MM-yyyy");
  return formattedDate;
};

export default function AddEvent() {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [committee, setCommittee] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndtDate] = useState("");
  const [startTime, setStarTime] = useState("");
  const [endTime, setEndtTime] = useState("");
  const [venue, setVenue] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    userState: { accountType },
  } = useContext(UserContext);

  // Use the mutation hook
  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      toast.success("Event Created successfully!");
      navigate(`/${accountType.toLowerCase()}`);

      // alert("Data posted successfully!");
    },
    onError: (error) => {
      console.error("Error posting data:", error);
      toast.error("Error creating Event!");
    },
  });

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    // Format the time in 12-hour format with AM/PM
    return format(date, "hh:mm a");
  };

  function getEditorContent(richText) {
    setError("");
    setDescription(richText);
  }

  // setting committe id
  function handleChange(e) {
    setError("");
    let arr = e?.map(({ value }) => value);
    setCommittee(arr);
  }

  // clearing form
  function handleClear() {
    setName("");
    setCommittee("");
    setError("");
    setDescription("");
    setStartDate("");
    setEndtDate("");
    setStarTime("");
    setEndtTime("");
    setVenue("");
  }

  // submitting form
  function handleSubmit() {
    // mutation.mutate(obj); // Trigger the mutation

    // checkinng for null values
    if (
      committee?.length < 1 ||
      !name ||
      !description ||
      !startDate ||
      !endDate ||
      !endTime ||
      !endDate ||
      !venue
    ) {
      setError("Please fill all fields");
      return;
    }

    // checking if start date and end date are valid
    if (
      isAfter(
        parse(startDate, "MMMM dd, yyyy", new Date()),
        parse(endDate, "MMMM dd, yyyy", new Date())
      )
    ) {
      setError("Invalid End date");
      return;
    }
    const data = {
      name,
      description,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      venue,
      hostingCommitteesId: committee,
    };

    // sending data
    mutation.mutate(data);
  }

  return (
    <div className="p-2 sm:p-0 sm:ml-8 max-w-2xl">
      <h1 className="font-bold text-slate-800 text-2xl mb-8">Add Event</h1>

      <form>
        {/* select committee */}
        <div className="mb-8 ">
          <p className="my-2  text-lg font-semibold">
            Select Committee <sup className="text-red-500">*</sup>{" "}
          </p>
          {accountType === AccountType.Student && (
            <SelectCommittee isMulti={true} handleChange={handleChange} />
          )}
          {accountType === AccountType.Teacher && (
            <SelectCommitteeForTeacher
              isMulti={true}
              handleChange={handleChange}
            />
          )}
        </div>

        {/* name input */}
        <div className="mb-8">
          <div className="mb-2 block">
            <Label
              htmlFor="name"
              className="my-2 text-lg font-semibold"
              value="Event Name"
            />
            <sup className="text-red-500 text-base">*</sup>
          </div>
          <input
            disabled={mutation.isPending}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            id="name"
            placeholder="Event Name"
            className=" appearance-none rounded-md block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300  text-gray-900  focus:outline-1 focus:outline-blue-700  p-4 sm:text-base"
          />
        </div>

        {/* description */}
        <div>
          <p className="my-2  text-lg font-semibold">
            Description <sup className="text-red-500">*</sup>
          </p>
          <TipTap getEditorContent={getEditorContent} />
        </div>

        {/* date input */}
        <div className=" mt-8 grid grid-cols-2 gap-4">
          {/* start date */}
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="startdate"
                className="my-2 text-lg font-semibold"
                value="Start Date"
              />
              <sup className="text-red-500 text-base">*</sup>
            </div>
            <Datepicker
              placeholder="select start date"
              disabled={mutation.isPending}
              onSelectedDateChanged={(date) => {
                setStartDate(format(date, "MMMM dd, yyyy"));
                setError("");
              }}
              value={startDate}
              id="startdate"
              theme={datePickerTheme}
              minDate={new Date()}
            />
          </div>
          {/* end date */}
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="enddate"
                className="my-2 text-lg font-semibold"
                value="End Date"
              />
              <sup className="text-red-500 text-base">*</sup>
            </div>
            <Datepicker
              placeholder="select end date"
              disabled={mutation.isPending}
              id="enddate"
              onSelectedDateChanged={(date) => {
                setEndtDate(format(date, "MMMM dd, yyyy"));
                setError("");
              }}
              value={endDate}
              theme={datePickerTheme}
              minDate={new Date()}
            />
          </div>
        </div>

        {/* time input */}
        <div className=" mt-8 grid grid-cols-2 gap-4">
          {/* start time */}
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="starttime"
                className="my-2 text-lg font-semibold"
                value="Start Time"
              />
              <sup className="text-red-500 text-base">*</sup>
            </div>
            <input
              disabled={mutation.isPending}
              type="time"
              value={startTime}
              onChange={(e) => {
                setStarTime(e.target.value);
                setError("");
              }}
              id="starttime"
              className=" appearance-none rounded-md block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300  text-gray-900 p-3 sm:text-base"
            />
          </div>
          {/* end time */}
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="endtime"
                className="my-2 text-lg font-semibold"
                value="End Time"
              />
              <sup className="text-red-500 text-base">*</sup>
            </div>
            <input
              disabled={mutation.isPending}
              id="endtime"
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndtTime(e.target.value);
                setError("");
              }}
              className=" appearance-none rounded-md block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300  text-gray-900  focus:outline-1   p-3 sm:text-base"
            />
          </div>
        </div>

        {/* venue */}
        <div className="mt-6 mb-6">
          <div className="mb-2 block">
            <Label
              className="my-2 text-lg font-semibold"
              htmlFor="venue"
              value="Event Venue"
            />
            <sup className="text-red-500 text-base">*</sup>
          </div>
          <input
            disabled={mutation.isPending}
            value={venue}
            onChange={(e) => {
              setVenue(e.target.value);
              setError("");
            }}
            id="venue"
            placeholder="Event Venue"
            className=" appearance-none rounded-md block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300  text-gray-900  focus:outline-1 focus:outline-blue-700  p-4 sm:text-base"
          />
        </div>

        {/* submit button */}
        <div className="text-right">
          <Button
            disabled={mutation.isPending}
            onClick={handleClear}
            color="error"
            className=" inline-block text-center ml-auto mt-4 mr-4 bg-red-600  text-white hover:bg-red-700 "
          >
            clear
          </Button>

          <Button
            disabled={mutation.isPending}
            onClick={handleSubmit}
            color="blue"
            className=" inline-block text-center ml-auto mt-4"
          >
            Submit
          </Button>
        </div>

        {/* error display */}
        {error != "" && (
          <p className="text-center mt-2 text-red-600">{error}</p>
        )}
        {mutation.isError && (
          <div className="text-center mt-2 text-red-600">
            <ApiError isError={mutation.isError} error={mutation.error} />
          </div>
        )}
      </form>
    </div>
  );
}
