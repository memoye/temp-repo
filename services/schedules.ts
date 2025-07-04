import { api } from "@/lib/api";
import type {
  AvailabilityScheduleValues,
  BlackoutsValues,
  CalendarAvailability,
  CancelEventScheduleValues,
  Event,
  EventScheduleValues,
  EventType,
  UserAvailability,
  UserAvailabilitySchedule,
} from "@/types/schedules";

export interface UserAvailabilitiesQueryParams {
  HostId: string;
  StartTime: string;
  EndTime: string;
  DurationInMinutes: number;
}

export interface FirmAvailabilitiesQueryParams {
  FirmId: string;
  StartTime: string;
  EndTime: string;
  DurationInMinutes: number;
}

const config = { service: "events", requireAuth: true } as const;

class SchedulesService {
  // Availability
  readonly availability = {
    updateCalendar: (data: AvailabilityScheduleValues, id?: string) =>
      api.post<CalendarAvailability>(
        id ? `/availability/update-calendar/${id}` : `/availability/add-calendar`,
        data,
        { ...config },
      ),

    createBlackout: (data: BlackoutsValues) =>
      api.post<BlackoutsValues[]>(`/availability/add-holiday`, data, {
        ...config,
      }),

    updateBlackout: ({ id, ...data }: BlackoutsValues) =>
      api.post<BlackoutsValues>(`/availability/update-holiday/${id}`, data, {
        ...config,
      }),

    getBlackouts: () =>
      api.get<BlackoutsValues[]>(`/availability/my-holiday`, {
        ...config,
      }),

    getUserAvailabilities: (params: UserAvailabilitiesQueryParams) =>
      api.get<UserAvailability[]>(`/availability/user`, {
        ...config,
        params,
      }),

    getCurrentUserAvailability: (params?: { UserId?: string }) =>
      api.get<UserAvailabilitySchedule>(`/availability/my-calendar`, {
        ...config,
        params,
      }),

    getFirmAvailabilities: (params: FirmAvailabilitiesQueryParams) =>
      api.get<UserAvailability[]>(`/availability/firm`, {
        ...config,
        params,
      }),
  };

  // Event
  readonly events = {
    getUserEvents: () => api.get<Event[]>(`/my-events`, { ...config }),

    getFirmEvents: () => api.get<Event[]>(`/firm-events`, { ...config }),

    createSchedule: (data: EventScheduleValues) =>
      api.post<boolean>(`/schedule`, data, { ...config }),

    cancel: (data: CancelEventScheduleValues) =>
      api.post<boolean>(`/cancel`, data, { ...config }),
  };

  // Lookup
  readonly lookups = {
    getEventTypes: () => api.get<EventType[]>(`/lookup/event-types`, { ...config }),

    getHolidayTypes: () =>
      api.get<Omit<EventType, "code">[]>(`/lookup/holiday-types`, {
        ...config,
      }),
  };
}

export const Schedules = new SchedulesService();
