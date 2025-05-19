import { create } from 'zustand';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  startTimer: (seconds: number) => void;
  tick: () => void;
  resetTimer: () => void;
  setTimeLeft: (seconds: number) => void;
  setIsRunning: (running: boolean) => void;   // <-- add this
}

export const useTimerStore = create<TimerState>((set) => ({
  timeLeft: 0,
  isRunning: false,

  startTimer: (seconds) => set({ timeLeft: seconds, isRunning: true }),

  tick: () =>
    set((state) => {
      if (state.timeLeft <= 1) {
        return { timeLeft: 0, isRunning: false };
      }
      return { timeLeft: state.timeLeft - 1 };
    }),

  resetTimer: () => set({ timeLeft: 0, isRunning: false }),

  setTimeLeft: (seconds) => set({ timeLeft: seconds }),

  setIsRunning: (running) => set({ isRunning: running }),
}));

