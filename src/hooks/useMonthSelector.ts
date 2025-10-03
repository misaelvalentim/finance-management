import { useEffect, useRef } from 'react';
import { getPreviousMonth, getNextMonth, setMonth } from '@/utils/date';
import { MonthSelectorProps } from '@/components/shared/MonthSelector/MonthSelectorProps';

export const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export const useMonthSelector = ({ currentDate, setCurrentDate }: MonthSelectorProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedMonthButton = scrollContainerRef.current.children[currentMonth] as HTMLElement;
      if (selectedMonthButton) {
        selectedMonthButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentDate(getPreviousMonth(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(getNextMonth(currentDate));
  };

  const handleMonthClick = (monthIndex: number) => {
    setCurrentDate(setMonth(currentDate, monthIndex));
  };

  return {
    scrollContainerRef,
    currentMonth,
    months,
    handlePrevMonth,
    handleNextMonth,
    handleMonthClick,
  };
};
