import React, { useEffect } from 'react';
import { useTimerStore } from '@/providers/timerStore'; // adjust path

interface CountdownTimerProps {
  minutes?: number;
  onTimeUp?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ minutes = 5, onTimeUp }) => {
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const isRunning = useTimerStore((state) => state.isRunning);
  const setTimeLeft = useTimerStore((state) => state.setTimeLeft);
  const setIsRunning = useTimerStore((state) => state.setIsRunning);

  // Initialize timeLeft on mount if not set yet
  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(minutes * 60);
      setIsRunning(true);
    }
  }, [minutes, timeLeft, setTimeLeft, setIsRunning]);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      if (onTimeUp) onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, isRunning, onTimeUp, setTimeLeft, setIsRunning]);

  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;

  return (
    <div className="flex items-center gap-2 font-bold text-[#F2B72D] text-2xl">
      {timeLeft > 0 ? (
        <>
          {minutesLeft.toString().padStart(2, '0')}:
          {secondsLeft.toString().padStart(2, '0')}
        </>
      ) : (
        <>Time&apos;s up!</>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#F2B72D"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
      </svg>
    </div>
  );
};

export default CountdownTimer;
