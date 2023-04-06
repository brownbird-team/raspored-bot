export const formatPeriod = (startTime, endTime) => {
    const startTimeShort = startTime.slice(0, 5);
    const endTimeShort = endTime.slice(0, 5);
    return `${startTimeShort} - ${endTimeShort}`;
};
