export const dateToHourMinString = (date: Date) => {
	const hour = date.getHours();
	const minutes = date.getMinutes();
	return `${hour}:${minutes}`;
};
