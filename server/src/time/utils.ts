export const formatTime = (timestamp: number): string => {
  const elaspedTimeInSeconds = Math.trunc(timestamp / 1000);
  const minutes = Math.trunc(elaspedTimeInSeconds / 60);
  const seconds = elaspedTimeInSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}m ${seconds
    .toString()
    .padStart(2, '0')}s`;
};
