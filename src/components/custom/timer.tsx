"use client"

import React, { useState, useEffect } from "react";

type CountdownTimerProps = {
  minutes: number;
};

function CountdownTimer({ minutes }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;

  return (
    <div>
      Time left: {minutesLeft.toString().padStart(2, "0")}:
      {secondsLeft.toString().padStart(2, "0")}
    </div>
  );
}

export default CountdownTimer;
