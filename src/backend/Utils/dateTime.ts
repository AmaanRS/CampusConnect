import dayjs from "dayjs";

const isValidDate = (dateString: string): boolean => {
	const date = dayjs(dateString, "DD-MM-YYYY");
	return date.isValid() && date.format("DD-MM-YYYY") === dateString;
};

const isValidTime = (timeString: string): boolean => {
	const time = dayjs(timeString, "hh:mm A");
	return time.isValid() && time.format("hh:mm A") === timeString;
};

export { isValidDate, isValidTime };
