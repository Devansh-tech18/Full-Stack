import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarEvent, Category, WeekDay, OptimizationConfig } from '../types';

interface SchedulerState {
  events: CalendarEvent[];
  selectedCategory: Category | 'All';
  config: OptimizationConfig;
  clockTick: number;
}

const initialEvents: CalendarEvent[] = [
  { id: '1', title: 'Design review', time: '10:00', day: 'Mon', category: 'Meeting' },
  { id: '2', title: 'Ship v2.3', time: '16:00', day: 'Mon', category: 'Deadline' },
  { id: '3', title: '1:1 with Sam', time: '09:30', day: 'Tue', category: 'Meeting' },
  { id: '4', title: 'Write proposal', time: '13:00', day: 'Wed', category: 'Focus block' },
  { id: '5', title: 'Client demo', time: '15:00', day: 'Thu', category: 'Meeting' },
  { id: '6', title: 'Portfolio review', time: '18:00', day: 'Thu', category: 'Focus block' },
  { id: '7', title: 'Grocery run', time: '10:00', day: 'Sat', category: 'Personal' },
  { id: '8', title: 'Sprint planning', time: '11:00', day: 'Sun', category: 'Meeting' }
];

const initialState: SchedulerState = {
  events: initialEvents,
  selectedCategory: 'All',
  config: {
    useMemoCards: true,
    useCallbackHandlers: true,
    useMemoFilter: true,
    liveClock: false
  },
  clockTick: 0
};

export const schedulerSlice = createSlice({
  name: 'scheduler',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.events.push(action.payload);
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((e) => e.id !== action.payload);
    },
    moveEvent: (
      state,
      action: PayloadAction<{ id: string; targetDay: WeekDay }>
    ) => {
      const event = state.events.find((e) => e.id === action.payload.id);
      // Bail out immediately if the target day is the same as the current day
      if (!event || event.day === action.payload.targetDay) {
        return;
      }
      event.day = action.payload.targetDay;
    },
    toggleConfig: (state, action: PayloadAction<keyof OptimizationConfig>) => {
      state.config[action.payload] = !state.config[action.payload];
    },
    tickClock: (state) => {
      state.clockTick += 1;
    },
    setSelectedCategory: (state, action: PayloadAction<Category | 'All'>) => {
      state.selectedCategory = action.payload;
    }
  }
});

export const {
  addEvent,
  deleteEvent,
  moveEvent,
  toggleConfig,
  tickClock,
  setSelectedCategory
} = schedulerSlice.actions;

export default schedulerSlice.reducer;