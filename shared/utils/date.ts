import { parseDuration, parseAbsolute, now, getLocalTimeZone } from '@internationalized/date';

export const formatDuration = (durationISO?: string | null) => {
  const result = '--:--';

  if (durationISO?.length) {
    const parsed = parseDuration(durationISO);

    const formattedMinutes = String(parsed.minutes).padStart(2, '0');
    const formattedSeconds = String(parsed.seconds).padStart(2, '0');

    if (parsed.hours) {
      return `${String(parsed.hours).padStart(2, '0')}:${formattedMinutes}:${formattedSeconds}`;
    }

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return result;
};

const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

export const formatRelativeTime = (date: Date | string) => {
  const now = new Date();
  const d = new Date(date);
  const diff = (d.getTime() - now.getTime()) / 1000;

  const ranges = [
    { unit: 'year', seconds: 60 * 60 * 24 * 365 },
    { unit: 'month', seconds: 60 * 60 * 24 * 30 },
    { unit: 'day', seconds: 60 * 60 * 24 },
    { unit: 'hour', seconds: 60 * 60 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ] as const;

  for (const { unit, seconds } of ranges) {
    const delta = Math.round(diff / seconds);
    if (Math.abs(delta) >= 1) {
      return rtf.format(delta, unit);
    }
  }

  return 'à l’instant';
};
