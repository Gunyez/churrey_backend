export const getDatesInRange = (startDate, endDate) => {
  const dates = [];

  let current = new Date(startDate);

  while (current <= new Date(endDate)) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const isHouseAvailable = (
  house,
  startDate,
  endDate
) => {
  const requestedDates = getDatesInRange(
    startDate,
    endDate
  );

  return !requestedDates.some((requested) =>
    house.unavailableDates.some(
      (booked) =>
        new Date(booked).toDateString() ===
        requested.toDateString()
    )
  );
};