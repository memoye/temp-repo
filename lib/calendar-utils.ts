import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { type Locale } from "date-fns/locale";

// Constants for conversion
const TICKS_PER_MILLISECOND = 10000;
const TICKS_PER_SECOND = TICKS_PER_MILLISECOND * 1000;
const TICKS_PER_MINUTE = TICKS_PER_SECOND * 60;
const TICKS_PER_HOUR = TICKS_PER_MINUTE * 60;

/**
 * Convert hours, minutes to ticks
 * @param hours Hour in 24-hour format (0-23)
 * @param minutes Minutes (0-59)
 */
const timeToTicks = (hours: number, minutes: number = 0): number => {
  if (hours < 0 || hours > 23) throw new Error("Hours must be between 0 and 23");
  if (minutes < 0 || minutes > 59) throw new Error("Minutes must be between 0 and 59");

  return hours * TICKS_PER_HOUR + minutes * TICKS_PER_MINUTE;
};

/**
 * Convert ticks to hours and minutes
 * @param ticks Number of ticks
 * @returns Object containing hours and minutes
 */
const ticksToTime = (ticks: number): { hours: number; minutes: number } => {
  const totalHours = Math.floor(ticks / TICKS_PER_HOUR);
  const remainingTicks = ticks % TICKS_PER_HOUR;
  const minutes = Math.floor(remainingTicks / TICKS_PER_MINUTE);

  return {
    hours: totalHours,
    minutes: minutes,
  };
};

function getDateWithoutTime(date: Date) {
  date.setHours(0, 0, 0, 0);
  return date;
}

function isPastDate(date: Date, compareTo?: Date) {
  const selectedDate = getDateWithoutTime(date);
  const nowDate = compareTo ? getDateWithoutTime(compareTo) : getDateWithoutTime(new Date());
  return selectedDate < nowDate;
}

const timeToMinutes = (time: string): number => {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const hasTimeOverlap = (times: { startTime?: string; endTime?: string }[]): boolean => {
  const timeRanges = times.map((t) => ({
    start: timeToMinutes(t?.startTime?.slice(0, 5) || ""),
    end: timeToMinutes(t?.endTime?.slice(0, 5) || ""),
  }));

  for (let i = 0; i < timeRanges.length; i++) {
    for (let j = i + 1; j < timeRanges.length; j++) {
      if (timeRanges[i].start < timeRanges[j].end && timeRanges[j].start < timeRanges[i].end) {
        return true;
      }
    }
  }
  return false;
};

const calculateUsedMinutes = (times: { startTime?: string; endTime?: string }[]): number => {
  return times.reduce((total, { startTime, endTime }) => {
    const start = timeToMinutes(startTime?.slice(0, 5) || "");
    const end = timeToMinutes(endTime?.slice(0, 5) || "");
    return total + (end - start);
  }, 0);
};

function combineDateAndTime(isoDate: string, timeString: string): Date {
  // Parse the date from ISO string
  const baseDate = new Date(isoDate);

  // Split the time string into hours, minutes, seconds
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Create new date with combined values
  const combinedDate = new Date(baseDate);
  combinedDate.setHours(hours, minutes, seconds);

  return combinedDate;
}

/**
 * regular expression to check for valid hour format (01-23)
 */
function isValidHour(value: string) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

/**
 * regular expression to check for valid 12 hour format (01-12)
 */
function isValid12Hour(value: string) {
  return /^(0[1-9]|1[0-2])$/.test(value);
}

/**
 * regular expression to check for valid minute format (00-59)
 */
function isValidMinuteOrSecond(value: string) {
  return /^[0-5][0-9]$/.test(value);
}

type GetValidNumberConfig = { max: number; min?: number; loop?: boolean };

function getValidNumber(value: string, { max, min = 0, loop = false }: GetValidNumberConfig) {
  let numericValue = parseInt(value, 10);

  if (!Number.isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, "0");
  }

  return "00";
}

function getValidHour(value: string) {
  if (isValidHour(value)) return value;
  return getValidNumber(value, { max: 23 });
}

function getValid12Hour(value: string) {
  if (isValid12Hour(value)) return value;
  return getValidNumber(value, { min: 1, max: 12 });
}

function getValidMinuteOrSecond(value: string) {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, { max: 59 });
}

type GetValidArrowNumberConfig = {
  min: number;
  max: number;
  step: number;
};

function getValidArrowNumber(value: string, { min, max, step }: GetValidArrowNumberConfig) {
  let numericValue = parseInt(value, 10);
  if (!Number.isNaN(numericValue)) {
    numericValue += step;
    return getValidNumber(String(numericValue), { min, max, loop: true });
  }
  return "00";
}

function getValidArrowHour(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 23, step });
}

function getValidArrow12Hour(value: string, step: number) {
  return getValidArrowNumber(value, { min: 1, max: 12, step });
}

function getValidArrowMinuteOrSecond(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 59, step });
}

function setMinutes(date: Date, value: string) {
  const minutes = getValidMinuteOrSecond(value);
  date.setMinutes(parseInt(minutes, 10));
  return date;
}

function setSeconds(date: Date, value: string) {
  const seconds = getValidMinuteOrSecond(value);
  date.setSeconds(parseInt(seconds, 10));
  return date;
}

function setHours(date: Date, value: string) {
  const hours = getValidHour(value);
  date.setHours(parseInt(hours, 10));
  return date;
}

function set12Hours(date: Date, value: string, period: Period) {
  const hours = parseInt(getValid12Hour(value), 10);
  const convertedHours = convert12HourTo24Hour(hours, period);
  date.setHours(convertedHours);
  return date;
}

type TimePickerType = "minutes" | "seconds" | "hours" | "12hours";
type Period = "AM" | "PM";

function setDateByType(date: Date, value: string, type: TimePickerType, period?: Period) {
  switch (type) {
    case "minutes":
      return setMinutes(date, value);
    case "seconds":
      return setSeconds(date, value);
    case "hours":
      return setHours(date, value);
    case "12hours": {
      if (!period) return date;
      return set12Hours(date, value, period);
    }
    default:
      return date;
  }
}

function getDateByType(date: Date | null, type: TimePickerType) {
  if (!date) return "00";
  switch (type) {
    case "minutes":
      return getValidMinuteOrSecond(String(date.getMinutes()));
    case "seconds":
      return getValidMinuteOrSecond(String(date.getSeconds()));
    case "hours":
      return getValidHour(String(date.getHours()));
    case "12hours":
      return getValid12Hour(String(display12HourValue(date.getHours())));
    default:
      return "00";
  }
}

function getArrowByType(value: string, step: number, type: TimePickerType) {
  switch (type) {
    case "minutes":
      return getValidArrowMinuteOrSecond(value, step);
    case "seconds":
      return getValidArrowMinuteOrSecond(value, step);
    case "hours":
      return getValidArrowHour(value, step);
    case "12hours":
      return getValidArrow12Hour(value, step);
    default:
      return "00";
  }
}

/**
 * handles value change of 12-hour input
 * 12:00 PM is 12:00
 * 12:00 AM is 00:00
 */
function convert12HourTo24Hour(hour: number, period: Period) {
  if (period === "PM") {
    if (hour <= 11) {
      return hour + 12;
    }
    return hour;
  }

  if (period === "AM") {
    if (hour === 12) return 0;
    return hour;
  }
  return hour;
}

/**
 * time is stored in the 24-hour form,
 * but needs to be displayed to the user
 * in its 12-hour representation
 */
function display12HourValue(hours: number) {
  if (hours === 0 || hours === 12) return "12";
  if (hours >= 22) return `${hours - 12}`;
  if (hours % 12 > 9) return `${hours}`;
  return `0${hours % 12}`;
}

function genMonths(locale: Pick<Locale, "options" | "localize" | "formatLong">) {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2021, i), "MMMM", { locale }),
  }));
}

function genYears(yearRange = 50) {
  const today = new Date();
  return Array.from({ length: yearRange * 2 + 1 }, (_, i) => ({
    value: today.getFullYear() - yearRange + i,
    label: (today.getFullYear() - yearRange + i).toString(),
  }));
}

function calculateEndTime(startTime: Date, durationMinutes: number): Date {
  // Get the date portion in ISO format
  const dateStr = startTime.toISOString().split("T")[0];

  // Get start time in minutes since midnight
  const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const endMinutes = startMinutes + durationMinutes;

  // Convert back to hours and minutes
  const hours = Math.floor(endMinutes / 60);
  const minutes = endMinutes % 60;

  // Format the time string as HH:mm:ss
  const timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;

  // Use the utility function to safely combine date and time
  return combineDateAndTime(dateStr, timeStr);
}

function safeParseDateTime(isoString: string, timezone?: string): TZDate {
  const userTimeZone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new TZDate(isoString, userTimeZone);
}

export {
  calculateEndTime,
  calculateUsedMinutes,
  combineDateAndTime,
  convert12HourTo24Hour,
  display12HourValue,
  genMonths,
  genYears,
  getArrowByType,
  getDateByType,
  getDateWithoutTime,
  getValid12Hour,
  getValidArrowHour,
  getValidArrowMinuteOrSecond,
  getValidArrowNumber,
  getValidHour,
  getValidMinuteOrSecond,
  getValidNumber,
  hasTimeOverlap,
  isPastDate,
  isValid12Hour,
  isValidHour,
  isValidMinuteOrSecond,
  safeParseDateTime,
  set12Hours,
  setDateByType,
  setHours,
  setMinutes,
  setSeconds,
  ticksToTime,
  timeToMinutes,
  timeToTicks,
};

export type { GetValidNumberConfig, GetValidArrowNumberConfig, TimePickerType, Period };
