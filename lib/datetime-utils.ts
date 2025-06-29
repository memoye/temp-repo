// Constants for conversion
const TICKS_PER_MILLISECOND = 10000;
const TICKS_PER_SECOND = TICKS_PER_MILLISECOND * 1000;
const TICKS_PER_MINUTE = TICKS_PER_SECOND * 60;
const TICKS_PER_HOUR = TICKS_PER_MINUTE * 60;

/**
 * Convert hours, minutes to ticks
 * -  hour in 24-hour format (0-23)
 * -  minutes (0-59)
 */
export const timeToTicks = (hours: number, minutes: number = 0): number => {
  if (hours < 0 || hours > 23) throw new Error("Hours must be between 0 and 23");
  if (minutes < 0 || minutes > 59) throw new Error("Minutes must be between 0 and 59");

  return hours * TICKS_PER_HOUR + minutes * TICKS_PER_MINUTE;
};

export function getDateWithoutTime(date: Date) {
  date.setHours(0, 0, 0, 0);
  return date;
}

export const validateTimeRange = (data: { startTime?: string; endTime?: string }) => {
  if (!data || !data.startTime || !data.startTime) return true;

  const [sh, sm] = (data?.startTime || "00:00:00").split(":").map(Number); // sh - start hour, sm - start minutes
  const [eh, em] = (data?.endTime || "00:00:00").split(":").map(Number); // eh - end hour, em - end minutes
  const startTicks = timeToTicks(sh, sm);
  const endTicks = timeToTicks(eh, em);
  return endTicks > startTicks;
};

export function isPastDate(date: Date, compareTo?: Date) {
  const selectedDate = getDateWithoutTime(date);
  const nowDate = compareTo ? getDateWithoutTime(compareTo) : getDateWithoutTime(new Date());
  return selectedDate < nowDate;
}

export function timeToMinutes(time: string): number {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function hasTimeOverlap(times: { startTime?: string; endTime?: string }[]): boolean {
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
}
