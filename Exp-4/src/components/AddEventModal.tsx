import React, { useState } from 'react';
import { CalendarEvent, Category, WeekDay } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  defaultDay: WeekDay;
  onClose: () => void;
  onAdd: (event: CalendarEvent) => void;
}

const CATEGORIES: Category[] = ['Meeting', 'Deadline', 'Focus block', 'Personal'];
const DAYS: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  defaultDay,
  onClose,
  onAdd
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00');
  const [day, setDay] = useState<WeekDay>(defaultDay);
  const [category, setCategory] = useState<Category>('Meeting');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      id: 'custom-' + Date.now().toString(),
      title,
      time,
      day,
      category
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-header">Add Schedule Event</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              required
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sprint Review & Retrospective"
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Day of Week</label>
              <select
                className="form-input"
                value={day}
                onChange={(e) => setDay(e.target.value as WeekDay)}
              >
                {DAYS.map((d) => (
                  <option key={d} value={d} style={{ background: '#092426' }}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Time (HH:MM)</label>
              <input
                type="text"
                required
                className="form-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="14:00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} style={{ background: '#092426' }}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};