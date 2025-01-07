import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { StandardResponse } from "../Types/GeneralTypes";

dayjs.extend(customParseFormat);

const dateFormat = "DD-MM-YYYY";
const timeFormat = "hh:mm A";

const isValidDate = (dateString: string): boolean => {
	const date = dayjs(dateString, dateFormat, true);
	return date.isValid() && date.format(dateFormat) === dateString;
};

const isValidTime = (timeString: string): boolean => {
	const time = dayjs(timeString, timeFormat, true);
	return time.isValid() && time.format(timeFormat) === timeString;
};

const isValidDateTimeRange = ({
	startDate,
	startTime,
	endDate,
	endTime,
}: {
	startDate: string;
	startTime: string;
	endDate: string;
	endTime: string;
}) => {
	// Validate dates
	if (!isValidDate(startDate)) {
		const response: StandardResponse = {
			message: "Invalid start date format expected DD-MM-YYYY",
			success: false,
		};

		return response;
	}

	if (!isValidDate(endDate)) {
		const response: StandardResponse = {
			message: "Invalid end date format expected DD-MM-YYYY",
			success: false,
		};

		return response;
	}

	// Validate times in 12-hour format
	if (!isValidTime(startTime)) {
		const response: StandardResponse = {
			message: "Invalid start time format (expected hh:mm AM/PM)",
			success: false,
		};

		return response;
	}

	if (!isValidTime(endTime)) {
		const response: StandardResponse = {
			message: "Invalid end time format (expected hh:mm AM/PM)",
			success: false,
		};

		return response;
	}

	const startDateTime = dayjs(
		`${startDate} ${startTime}`,
		`${dateFormat} ${timeFormat}`,
	);
	const endDateTime = dayjs(
		`${endDate} ${endTime}`,
		`${dateFormat} ${timeFormat}`,
	);

	if (!startDateTime.isBefore(endDateTime)) {
		const response: StandardResponse = {
			message: "Start datetime should be before End datetime",
			success: false,
		};

		return response;
	}

	const response: StandardResponse = {
		message: "Date time is valid",
		success: true,
	};

	return response;
};

export { isValidDate, isValidTime, isValidDateTimeRange };
