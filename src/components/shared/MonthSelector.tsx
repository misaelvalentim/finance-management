"use client";

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useEffect, useRef } from 'react';

const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

interface MonthSelectorProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const MonthSelector = ({ currentDate, setCurrentDate }: MonthSelectorProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

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
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleMonthClick = (monthIndex: number) => {
    setCurrentDate(new Date(currentYear, monthIndex, 1));
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white">
      <button onClick={handlePrevMonth}><FaChevronLeft /></button>
      <div ref={scrollContainerRef} className="flex items-center space-x-4 overflow-x-auto w-full justify-center">
        {months.map((month, index) => (
          <button
            key={month}
            onClick={() => handleMonthClick(index)}
            className={`font-bold w-[inherit] !m-0 px-2 hover:text-black active:text-gray-400 focus:border-transparent focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-black ${index === currentMonth ? 'text-black' : 'text-gray-400'}`}
          >
            {month}
          </button>
        ))}
      </div>
      <button onClick={handleNextMonth}><FaChevronRight /></button>
    </div>
  );
};

export default MonthSelector;