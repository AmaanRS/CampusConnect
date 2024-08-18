import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Extend dayjs with the customParseFormat plugin to handle custom formats
dayjs.extend(customParseFormat);

const isValidDate = (dateString: string): boolean => {
	return dayjs(dateString, "DD-MM-YYYY", true).isValid();
};

const isValidTime = (timeString: string): boolean => {
	return dayjs(timeString, "hh:mm A", true).isValid();
};

export { isValidDate, isValidTime };
