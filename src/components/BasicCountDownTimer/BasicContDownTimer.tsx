import React, { useEffect, useState } from 'react';

interface CountdownProps {
  startTime: string; 
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const BasicCountdownTimer: React.FC<CountdownProps> = ({ startTime }) => {
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = new Date(startTime).getTime() - new Date().getTime();

    if (difference <= 0) return null;

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTime = calculateTimeLeft();
      setTimeLeft(updatedTime);

      if (!updatedTime) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  if (!timeLeft) {
    return <span>Going On</span>;
  }

  const { hours, minutes, seconds } = timeLeft;

  return (
    <span>
      {String(hours).padStart(2, '0')}h {String(minutes).padStart(2, '0')}m {String(seconds).padStart(2, '0')}s
    </span>
  );
};

export default BasicCountdownTimer;
