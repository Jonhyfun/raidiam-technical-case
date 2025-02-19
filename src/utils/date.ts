function getFormattedDate(date: Date) {
  const year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return month + '/' + day + '/' + year;
}

export function getDateLabelFromEpoch(epoch: number) {
  const date = new Date(0);
  date.setUTCSeconds(epoch);
  return getFormattedDate(date)
}