import schedulerReducer, {
  moveEvent,
  toggleConfig,
  tickClock
} from '../store/schedulerSlice';

describe('Scheduler Redux Slice & Profiler Logic', () => {
  const initialState = {
    events: [
      { id: '1', title: 'Design review', time: '10:00', day: 'Mon' as const, category: 'Meeting' as const }
    ],
    selectedCategory: 'All' as const,
    config: {
      useMemoCards: true,
      useCallbackHandlers: true,
      useMemoFilter: true,
      liveClock: false
    },
    clockTick: 0
  };

  it('moves event across days correctly upon drag-and-drop', () => {
    const nextState = schedulerReducer(
      initialState,
      moveEvent({ id: '1', targetDay: 'Wed' })
    );
    expect(nextState.events[0].day).toBe('Wed');
  });

  it('toggles optimization switches', () => {
    const nextState = schedulerReducer(
      initialState,
      toggleConfig('useMemoCards')
    );
    expect(nextState.config.useMemoCards).toBe(false);
  });

  it('increments clock tick state on ticker trigger', () => {
    const nextState = schedulerReducer(initialState, tickClock());
    expect(nextState.clockTick).toBe(1);
  });
});