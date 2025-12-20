export function formatDateTime(date, options = {}) {
  const defaultOptions = {
    locale: "en-US",
    dateStyle: "medium",
    timeStyle: "short",
  };

  const finalOptions = { ...defaultOptions, ...options };
  return new Intl.DateTimeFormat(finalOptions.locale, {
    dateStyle: finalOptions.dateStyle,
    timeStyle: finalOptions.timeStyle,
  }).format(new Date(date));
}

export function formatDate(date, options = {}) {
  const {
    locale = "en-US",
    showTime = false,
    showYear = true,
    showDay = true,
  } = options;

  const dateObj = new Date(date);

  // Validate date
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const formatOptions = {
    month: "long", // Full month name
  };

  if (showDay) {
    formatOptions.day = "numeric";
  }

  if (showYear) {
    formatOptions.year = "numeric";
  }

  if (showTime) {
    formatOptions.hour = "2-digit";
    formatOptions.minute = "2-digit";
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}
