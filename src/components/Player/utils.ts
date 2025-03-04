
/**
 * Formats seconds into a minutes:seconds string
 * @param time Time in seconds
 * @returns Formatted time string (e.g. "3:45")
 */
export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
