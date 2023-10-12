import moment from 'moment';

const formatDateAndTime = (date: string) => {
  if (!date) return date;
  return moment(date).format('DD/MM/YYYY HH:mm');
};

export const maskHelper = {
  formatDateAndTime,
};
