const computeNextOccurrence = (day, hour, minute, offsetIndex) => {
  const now = new Date();

  const target = new Date();

  const dayIndex = dayMap[day];

  const currentDay = now.getDay();

  let diff = dayIndex - currentDay;

  if (diff < 0) diff += 7;

  target.setDate(now.getDate() + diff);
  target.setHours(Number(hour));
  target.setMinutes(Number(minute) + offsetIndex * 5);
  target.setSeconds(0);
  target.setMilliseconds(0);

  return target.getTime() - now.getTime();
};