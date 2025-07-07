export const convertUnixToTimestamp = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};