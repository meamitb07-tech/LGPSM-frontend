export function parseEventDate(dateStr: any): Date | null {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;
  if (typeof dateStr !== "string") return null;

  const str = dateStr.trim();
  if (!str || str === "TBD") return null;

  // Direct Date parse attempt first if ISO format or standard date format
  const directDate = new Date(str);
  if (!isNaN(directDate.getTime()) && !/^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(str)) {
    return directDate;
  }

  // Handle DD/MM/YY or DD/MM/YYYY with optional time like "23/09/26 03.00 PM" or "23/09/2026 03:00 PM"
  const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+(\d{1,2})[.:](\d{2})(?:\s+(AM|PM))?)?/i);
  if (match) {
    let [, dayStr, monthStr, yearStr, hourStr, minStr, ampm] = match;
    let day = parseInt(dayStr, 10);
    let month = parseInt(monthStr, 10) - 1;
    let year = parseInt(yearStr, 10);
    if (year < 100) year += 2000;

    let hour = hourStr ? parseInt(hourStr, 10) : 0;
    let min = minStr ? parseInt(minStr, 10) : 0;
    if (ampm) {
      const upper = ampm.toUpperCase();
      if (upper === "PM" && hour < 12) hour += 12;
      if (upper === "AM" && hour === 12) hour = 0;
    }

    const parsed = new Date(year, month, day, hour, min);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  // Fallback to direct Date parse
  if (!isNaN(directDate.getTime())) {
    return directDate;
  }

  return null;
}

export type EventStatusType = "Upcoming" | "Ongoing" | "Completed";

export function getDynamicEventStatus(
  startDateStr?: any,
  endDateStr?: any,
  fallbackStatus?: string
): EventStatusType {
  const startDate = parseEventDate(startDateStr);
  const endDate = parseEventDate(endDateStr);
  const now = new Date();

  if (startDate && endDate) {
    if (now < startDate) return "Upcoming";
    if (now >= startDate && now <= endDate) return "Ongoing";
    if (now > endDate) return "Completed";
  } else if (startDate) {
    if (now < startDate) return "Upcoming";
    const isSameDay =
      now.getFullYear() === startDate.getFullYear() &&
      now.getMonth() === startDate.getMonth() &&
      now.getDate() === startDate.getDate();
    if (isSameDay) return "Ongoing";
    return "Completed";
  } else if (endDate) {
    if (now <= endDate) return "Ongoing";
    return "Completed";
  }

  if (fallbackStatus === "Completed" || fallbackStatus === "Ongoing" || fallbackStatus === "Upcoming") {
    return fallbackStatus;
  }

  return "Upcoming";
}
