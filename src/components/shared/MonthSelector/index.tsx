"use client";

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MonthSelectorProps } from './MonthSelectorProps';
import { useMonthSelector } from '@/hooks/useMonthSelector';

const MonthSelector = (props: MonthSelectorProps) => {
  const {
    scrollContainerRef,
    currentMonth,
    months,
    handlePrevMonth,
    handleNextMonth,
    handleMonthClick,
  } = useMonthSelector(props);

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
