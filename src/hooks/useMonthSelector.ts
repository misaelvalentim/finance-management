import { useLayoutEffect, useRef } from 'react';
import { getPreviousMonth, getNextMonth, setMonth } from '@/utils/date';
import { MonthSelectorProps } from '@/components/shared/MonthSelector/MonthSelectorProps';

export const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export const useMonthSelector = ({ currentDate, setCurrentDate }: MonthSelectorProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentMonth = currentDate.getMonth();

  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedMonthButton = container.children[currentMonth] as HTMLElement;

      if (selectedMonthButton) {
        const containerWidth = container.offsetWidth;
        const buttonLeft = selectedMonthButton.offsetLeft;
        const buttonWidth = selectedMonthButton.offsetWidth;

        container.scrollTo({
          left: buttonLeft - (containerWidth / 2) + (buttonWidth / 2),
          behavior: 'smooth',
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
