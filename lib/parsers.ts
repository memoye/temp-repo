import { createParser } from "nuqs/server";
import { z } from "zod";

import { dataTableConfig } from "@/config/data-table";

import type { ExtendedColumnFilter, ExtendedColumnSort } from "@/types/data-table";
import type { DateRange } from "react-day-picker";

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export const getSortingStateParser = <TData>(columnIds?: string[] | Set<string>) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(sortingItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as ExtendedColumnSort<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every((item, index) => item.id === b[index]?.id && item.desc === b[index]?.desc),
  });
};

const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string(),
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;

export const getFiltersStateParser = <TData>(columnIds?: string[] | Set<string>) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(filterItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as ExtendedColumnFilter<TData>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (filter, index) =>
          filter.id === b[index]?.id &&
          filter.value === b[index]?.value &&
          filter.variant === b[index]?.variant &&
          filter.operator === b[index]?.operator,
      ),
  });
};

export const parseAsDate = createParser<Date | undefined>({
  parse: (value) => {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  },
  serialize: (value) => value?.toISOString() ?? "",
});

export const parseAsDateRange = createParser<DateRange | undefined>({
  parse: (value) => {
    if (!value) return undefined;
    try {
      const parsed = JSON.parse(value);
      const from = parsed.from ? new Date(parsed.from) : undefined;
      const to = parsed.to ? new Date(parsed.to) : undefined;
      if ((from && isNaN(from.getTime())) || (to && isNaN(to.getTime()))) {
        return undefined;
      }
      return { from, to };
    } catch {
      return undefined;
    }
  },
  serialize: (value) => {
    if (!value) return "";
    return JSON.stringify({
      from: value.from?.toISOString(),
      to: value.to?.toISOString(),
    });
  },
});
