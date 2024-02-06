import { useEffect, useState } from 'react';
import { useGlobalState } from '../../utils/useGlobalState';

function DateTimeWidget() {
  const { globalState } = useGlobalState();
  const [currentTime, setCurrentTime] = useState('00:00');
  const [currentDay, setCurrentDay] = useState(0);
  const [currentDayName, setCurrentDayName] = useState('');
  const [currentMonthName, setCurrentMonthName] = useState('');
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const refreshTimeInterval = 1000;
  const isActive = globalState.widgetDatetimeActive;

  function getTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    setCurrentTime(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
  }

  function getDate() {
    const date = new Date();
    const day = date.getDate();
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];

    setCurrentDay(day);
    setCurrentDayName(dayName);
    setCurrentMonthName(monthName);
  }

  setInterval(() => {
    getTime();
  }, refreshTimeInterval);

  useEffect(() => {
    getDate();
  }, []);

  if (!isActive) {
    return <></>;
  }

  return (
    <div className="absolute right-0 bottom-10 md:bottom-2 text-right">
      <div className="container px-4 pb-2">
        <h1
          className="text-6xl text-shadow-xs shadow-gray-700"
          data-testid="timeHeader"
        >
          {currentTime}
        </h1>
        <h2
          className="text-2xl text-shadow-xs shadow-gray-700"
          data-testid="dateHeader"
        >
          {currentDayName}, {currentDay} {currentMonthName}
        </h2>
      </div>
    </div>
  );
}

export default DateTimeWidget;
