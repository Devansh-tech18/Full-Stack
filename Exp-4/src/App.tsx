import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import {
  moveEvent,
  addEvent,
  deleteEvent,
  tickClock,
  setSelectedCategory
} from './store/schedulerSlice';
import { CalendarEvent, Category, WeekDay } from './types';
import { OptimizationControls } from './components/OptimizationControls';
import { MemoizedEventCard, UnmemoizedEventCard } from './components/EventCard';
import { RenderMonitor } from './components/RenderMonitor';
import { AddEventModal } from './components/AddEventModal';

const DAYS: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CATEGORIES: Category[] = ['Meeting', 'Deadline', 'Focus block', 'Personal'];

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const { events, selectedCategory, config } = useSelector(
    (state: RootState) => state.scheduler
  );

  const renderLogRef = useRef<Record<string, number>>({});
  const [, setTickDisplay] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [targetModalDay, setTargetModalDay] = useState<WeekDay>('Mon');

  // Pulse Clock simulator (450ms)
  useEffect(() => {
    if (!config.liveClock) return;
    const timer = setInterval(() => {
      dispatch(tickClock());
      setTickDisplay((t) => t + 1);
    }, 450);
    return () => clearInterval(timer);
  }, [config.liveClock, dispatch]);

  const handleResetCounters = useCallback(() => {
    renderLogRef.current = {};
    setTickDisplay((t) => t + 1);
  }, []);

  // Stable vs. Unstable Drag Handlers
  const stableDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  }, []);

  const unstableDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const activeDragStart = config.useCallbackHandlers
    ? stableDragStart
    : unstableDragStart;

  // Stable vs. Unstable Delete Handlers
  const stableDelete = useCallback(
    (id: string) => {
      dispatch(deleteEvent(id));
      delete renderLogRef.current[id];
      setTickDisplay((t) => t + 1);
    },
    [dispatch]
  );

  const unstableDelete = (id: string) => {
    dispatch(deleteEvent(id));
    delete renderLogRef.current[id];
    setTickDisplay((t) => t + 1);
  };

  const activeDelete = config.useCallbackHandlers ? stableDelete : unstableDelete;

  // Guarded Drop Handler: prevents any state update or re-render if dropped on the same day
  const handleDrop = (e: React.DragEvent, targetDay: WeekDay) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;

    const currentEvent = events.find((ev) => ev.id === id);

    // If dropped back onto the same day, terminate without touching Redux or state
    if (!currentEvent || currentEvent.day === targetDay) {
      return;
    }

    dispatch(moveEvent({ id, targetDay }));
    setTickDisplay((t) => t + 1);
  };

  // Categorical Filtering with useMemo Switch
  const memoizedFiltered = useMemo(() => {
    if (selectedCategory === 'All') return events;
    return events.filter((e) => e.category === selectedCategory);
  }, [events, selectedCategory]);

  const unmemoizedFiltered =
    selectedCategory === 'All'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  const displayedEvents = config.useMemoFilter
    ? memoizedFiltered
    : unmemoizedFiltered;

  const CardComponent = config.useMemoCards
    ? MemoizedEventCard
    : UnmemoizedEventCard;

  const handleOpenAddModal = (day: WeekDay) => {
    setTargetModalDay(day);
    setModalOpen(true);
  };

  return (
    <div className="app-wrapper">
      <header className="top-header">
        <div>
          <div className="brand-badge">Engine Profiler v2.0</div>
          <h1 className="main-title">Temporal Telemetry & Scheduler</h1>
          <p className="main-subtitle">
            Manipulate calendar entries, filter channels, and audit React runtime memoization efficiency.
          </p>
        </div>
      </header>

      <OptimizationControls onResetCounters={handleResetCounters} />

      <div className="workspace-grid">
        <main className="calendar-frame">
          <div className="calendar-action-bar">
            <span className="section-tag">Week Distribution Matrix</span>
            <div className="filter-group">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    dispatch(
                      setSelectedCategory(selectedCategory === cat ? 'All' : cat)
                    );
                    setTickDisplay((t) => t + 1);
                  }}
                  className={`category-chip ${
                    selectedCategory === cat ? 'selected' : ''
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="days-matrix">
            {DAYS.map((day) => {
              const dayEvents = displayedEvents.filter((e) => e.day === day);

              return (
                <div
                  key={day}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, day)}
                  className="day-track"
                >
                  <div>
                    <div className="track-head">
                      <span className="day-tag">{day}</span>
                      <button
                        className="track-add-btn"
                        onClick={() => handleOpenAddModal(day)}
                        title={`Add event to ${day}`}
                      >
                        +
                      </button>
                    </div>

                    <div className="cards-container">
                      {dayEvents.map((ev) => (
                        <CardComponent
                          key={ev.id}
                          event={ev}
                          onDragStart={activeDragStart}
                          onDelete={activeDelete}
                          renderLog={renderLogRef.current}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    className="quick-append-btn"
                    onClick={() => handleOpenAddModal(day)}
                  >
                    + Schedule
                  </button>
                </div>
              );
            })}
          </div>
        </main>

        <RenderMonitor
          events={events}
          renderCounts={renderLogRef.current}
        />
      </div>

      <AddEventModal
        isOpen={modalOpen}
        defaultDay={targetModalDay}
        onClose={() => setModalOpen(false)}
        onAdd={(ev) => {
          dispatch(addEvent(ev));
          setTickDisplay((t) => t + 1);
        }}
      />
    </div>
  );
};

export default App;