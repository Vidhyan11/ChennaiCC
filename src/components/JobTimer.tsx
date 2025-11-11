import { useEffect, useState } from 'react';
import { Job } from '../types';

interface JobTimerProps {
  job: Job;
  compact?: boolean;
}

export const JobTimer: React.FC<JobTimerProps> = ({ job, compact = false }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isOvertime, setIsOvertime] = useState(false);

  useEffect(() => {
    if (!job.timerStartedAt || !job.timerDuration || job.status !== 'accepted') {
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - job.timerStartedAt!) / 1000); // seconds
      const totalSeconds = job.timerDuration! * 60; // convert minutes to seconds
      const remaining = totalSeconds - elapsed;

      if (remaining <= 0) {
        setIsOvertime(true);
        setTimeRemaining(Math.abs(remaining));
      } else {
        setIsOvertime(false);
        setTimeRemaining(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [job]);

  if (!job.timerStartedAt || !job.timerDuration || job.status !== 'accepted') {
    return null;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getTimerColor = () => {
    if (isOvertime) return 'text-red-600 bg-red-50 border-red-300';
    if (timeRemaining < 600) return 'text-orange-600 bg-orange-50 border-orange-300'; // less than 10 min
    return 'text-green-600 bg-green-50 border-green-300';
  };

  if (compact) {
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold border ${getTimerColor()}`}>
        {isOvertime ? '⏱️ +' : '⏱️ '}{formatTime(timeRemaining)}
      </span>
    );
  }

  return (
    <div className={`px-4 py-3 rounded-lg border-2 ${getTimerColor()}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium mb-1">
            {isOvertime ? 'OVERTIME' : 'TIME REMAINING'}
          </div>
          <div className="text-2xl font-bold">
            {isOvertime ? '+' : ''}{formatTime(timeRemaining)}
          </div>
        </div>
        <div className="text-4xl">
          {isOvertime ? '⚠️' : '⏱️'}
        </div>
      </div>
      <div className="text-xs mt-2 opacity-75">
        Duration: {job.timerDuration === 60 ? '1 hour' : job.timerDuration === 120 ? '2 hours' : '4 hours'} ({job.garbageLevel} level)
      </div>
    </div>
  );
};
