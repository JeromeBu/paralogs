export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const min = minutes % 60;
  return `${hours}h${min < 10 ? `0${min}` : min}`;
};
