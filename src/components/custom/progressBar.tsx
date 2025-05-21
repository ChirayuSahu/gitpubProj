import { useEffect, useState } from "react";

interface AnimatedProgressBarProps {
  start: number;
  end: number;
  current: number;
  color?: string;
  glowColor?: string;
  barBackgroundColor?: string;
}

export const AnimatedProgressBar = ({
  start,
  end,
  current,
  color = "#40C776",
  glowColor,
  barBackgroundColor = "#E5E7EB",
}: AnimatedProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const clamped = Math.min(Math.max(current, start), end);
    const percentage = ((clamped - start) / (end - start)) * 100;
    setTimeout(() => setProgress(percentage), 100);
  }, [start, end, current]);

  return (
    <div
      className="w-full h-4 2xl:h-8 rounded-full overflow-hidden shadow-inner"
      style={{
        backgroundColor: barBackgroundColor,
        boxShadow: glowColor
          ? `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`
          : undefined,
      }}
    >
      <div
        className="h-2 2xl:h-6 m-1 rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: color,
        }}
      />
    </div>

  );
};
