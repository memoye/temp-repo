"use client";

import { useCallback, useEffect, useState } from "react";

export function useCountdown(
  initialSeconds: number,
  onEnd?: (seconds?: number) => void,
  activateOnMount?: boolean,
) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(activateOnMount);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isActive && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prev: number) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      onEnd?.(seconds);
      clearInterval(intervalId!);
    }

    return () => clearInterval(intervalId);
  }, [isActive, seconds, onEnd]);

  const restart = useCallback(() => {
    setSeconds(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const resume = useCallback(() => {
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  return { isActive, secondsLeft: seconds, restart, pause, resume, stop };
}
