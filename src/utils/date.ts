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
