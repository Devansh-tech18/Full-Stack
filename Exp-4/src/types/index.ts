export type Category = 'Meeting' | 'Deadline' | 'Focus block' | 'Personal';
export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  day: WeekDay;
  category: Category;
}

export interface OptimizationConfig {
  useMemoCards: boolean;
  useCallbackHandlers: boolean;
  useMemoFilter: boolean;
  liveClock: boolean;
}