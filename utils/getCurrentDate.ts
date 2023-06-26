export const getFormattedDate = () => {
  const currentDate = new Date();

  // Format the date to yyyy-mm-dd
  const formattedDate = currentDate.toISOString().slice(0, 10);

  return formattedDate;
};
