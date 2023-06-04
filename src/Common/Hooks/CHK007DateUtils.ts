export const dateToHourMinString = (date: Date) => {
	const hour = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${hour}:${minutes}`;
};
