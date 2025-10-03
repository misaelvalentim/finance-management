export const toYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getFirstDayOfMonth = (date: Date): string => {
  return toYYYYMMDD(new Date(date.getFullYear(), date.getMonth(), 1));
};

export const getLastDayOfMonth = (date: Date): string => {
  return toYYYYMMDD(new Date(date.getFullYear(), date.getMonth() + 1, 0));
};

export const getMonthYear = (date: Date, locale: string = 'pt-BR') => {
    return {
        month: date.toLocaleString(locale, { month: 'long' }),
        year: date.getFullYear()
    };
};

export const formatShortDate = (dateString: string, locale: string = 'pt-BR'): string => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: '2-digit' });
};

export const formatFriendlyDate = (dateString: string, locale: string = 'pt-BR'): string => {
    const date = new Date(dateString + 'T00:00:00');
    const day = date.getDate();
    const month = date.toLocaleString(locale, { month: 'long' });
    return `${day} de ${month}`;
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
};

export const getInitialDateForForm = (currentDate: Date): string => {
  const now = new Date();
  if (isSameMonth(now, currentDate)) {
    return toYYYYMMDD(now);
  }
  return toYYYYMMDD(currentDate);
};

export const fromYYYYMMDD = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

export const getPreviousMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

export const getNextMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

export const setMonth = (date: Date, monthIndex: number): Date => {
  return new Date(date.getFullYear(), monthIndex, 1);
};

export const getToday = (): Date => {
  return new Date();
};

export const toYYYYMM = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};