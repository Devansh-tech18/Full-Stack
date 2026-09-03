import React from 'react';
import { CalendarEvent } from '../types';

interface EventCardProps {
  event: CalendarEvent;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDelete: (id: string) => void;
  renderLog: Record<string, number>;
}

const RawEventCard: React.FC<EventCardProps> = ({
  event,
  onDragStart,
  onDelete,
  renderLog
}) => {
  // Directly log this card's render execution without triggering React state loops
  renderLog[event.id] = (renderLog[event.id] || 0) + 1;

  const categoryClass = event.category.replace(' ', '-');

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, event.id)}
      className={`telemetry-card ${categoryClass}`}
    >
      <div className="card-top">
        <span className="card-time">{event.time}</span>
        <button
          className="card-close"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.id);
          }}
          title="Delete event"
        >
          ×
        </button>
      </div>
      <div className="card-name">{event.title}</div>
    </div>
  );
};

// Memoized with custom comparator: strictly checks payload & handler references,
// intentionally omitting renderLog identity to prevent cascade re-renders.
export const MemoizedEventCard = React.memo(
  RawEventCard,
  (prev, next) =>
    prev.event.id === next.event.id &&
    prev.event.title === next.event.title &&
    prev.event.time === next.event.time &&
    prev.event.day === next.event.day &&
    prev.event.category === next.event.category &&
    prev.onDragStart === next.onDragStart &&
    prev.onDelete === next.onDelete
);

export const UnmemoizedEventCard = RawEventCard;