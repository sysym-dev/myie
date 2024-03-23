import dayjs from 'dayjs';

export function parseDate(date?: string): dayjs.Dayjs {
  return dayjs(date);
}
