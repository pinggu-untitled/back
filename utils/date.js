export function transDate(date) {
  const newDate = new Date(date.setHours(date.getHours() + 9));
  return newDate;
}
