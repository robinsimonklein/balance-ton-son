import { parseDuration } from '@internationalized/date';

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
