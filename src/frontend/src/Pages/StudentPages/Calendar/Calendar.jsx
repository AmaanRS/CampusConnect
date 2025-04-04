import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import ApiError from "../../../Components/Errors/ApiError";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

// Helper function to convert a date string (DD-MM-YYYY) to a Date object
const convertToDate = (dateStr, hours = 0, minutes = 0) => {
  const [day, month, year] = dateStr.split("-");
  return new Date(year, month - 1, day, hours, minutes);
};

const fetchData = async () => {
  const response = await axiosInstance.post("/event/getAllEvents", {});
  return response.data;
};

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Sample default events (optional)
const defaultEvents = [
  {
    id: 1,
    title: "React Workshop",
    start: new Date(2025, 3, 5, 10, 0), // April 5, 2025, 10 AM
    end: new Date(2025, 3, 5, 12, 0), // April 5, 2025, 12 PM
  },
  {
    id: 2,
    title: "Project Meeting",
    start: new Date(2025, 3, 8, 14, 0), // April 8, 2025, 2 PM
    end: new Date(2025, 3, 8, 15, 30), // April 8, 2025, 3:30 PM
  },
];

const MyCalendar = (props) => {
  const [events, setEvents] = useState(defaultEvents);
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["allEvents"],
    queryFn: fetchData,
  });

  const navigate = useNavigate();

  // Redirect on clicking an event
  const handleSelectEvent = (event) => {
    // Assume each event has an id property; adjust the URL as needed
    navigate(`/student/committee/${event.id}`);
  };

  useEffect(() => {
    if (data?.data?.length > 0) {
      const convertedEvents = data.data.map((item) => {
        const start = convertToDate(item.startDate, 14, 0); // example: 2 PM
        const end = convertToDate(item.endDate, 15, 0); // example: 3 PM
        return {
          id: item.hostingCommittees[0].committeeId,
          title: item.name,
          start,
          end,
        };
      });
      setEvents(convertedEvents);
    }
  }, [data]);

  if (isLoading)
    return (
      <>
        <div className="h-screen w-full flex items-center justify-center pb-32">
          <PulseLoader
            color="#1a56db"
            size={16}
            speedMultiplier={1}
            className="m-auto"
          />
        </div>
      </>
    );
  if (isError)
    return (
      <div className="h-96 w-full flex items-center justify-center">
        <ApiError isError={isError} error={error} />
      </div>
    );

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={["month"]} // Only show the month view
        onSelectEvent={handleSelectEvent} // Redirect on event click
      />
    </div>
  );
};

export default MyCalendar;
