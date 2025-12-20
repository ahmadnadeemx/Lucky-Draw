export const formatDate = (date) => {
  try {
    const dateObject = new Date(date);
    return dateObject?.toLocaleDateString("en-IN");
  } catch (error) {
    return null;
  }
};

export const formatTime = (date) => {
  try {
    const dateObject = new Date(date);
    return dateObject?.toLocaleTimeString("en-IN");
  } catch (error) {
    return null;
  }
};
export const getDateDifferences = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const milliseconds = end - start;

  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth() + years * 12;
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor(milliseconds / (1000 * 60));
  const seconds = Math.floor(milliseconds / 1000);

  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
};

export const getDayName = (date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date(date);
  return days[d.getDay()];
};

export const isDateInRange = (date, startDate, endDate) => {
  const targetDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);

  return targetDate >= start && targetDate <= end;
};



export function formatMilliseconds(ms) {
  ms = Number(ms);
  if (ms <= 0) return "0 seconds";
  if (ms < 1000) return "0 seconds";

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (remainingHours > 0)
    parts.push(`${remainingHours} hour${remainingHours > 1 ? "s" : ""}`);
  if (remainingMinutes > 0)
    parts.push(`${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`);
  if (remainingSeconds > 0)
    parts.push(`${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`);

  return parts.join(", ").replace(/,([^,]*)$/, " and$1");
}



export function isToday(date) {
  date = new Date(date);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}





export const sortByDate = (arr, dateField) => {
  return arr.sort((a, b) => new Date(b[dateField]) - new Date(a[dateField]));
};
