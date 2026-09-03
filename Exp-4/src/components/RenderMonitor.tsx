import React from 'react';
import { CalendarEvent } from '../types';

interface RenderMonitorProps {
  events: CalendarEvent[];
  renderCounts: Record<string, number>;
}

export const RenderMonitor: React.FC<RenderMonitorProps> = ({
  events,
  renderCounts
}) => {
  const totalRenders = Object.values(renderCounts).reduce((acc, c) => acc + c, 0);
  const activeCount = Object.values(renderCounts).filter((c) => c > 0).length;
  const maxRender = Math.max(...Object.values(renderCounts), 1);

  return (
    <aside className="monitor-deck">
      <div className="panel-header-row">
        <span className="section-tag">Telemetry Profiler</span>
        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Active</span>
      </div>

      <div className="stats-card-grid">
        <div className="metric-box">
          <div className="metric-val cyan">{totalRenders}</div>
          <div className="metric-name">Renders Logged</div>
        </div>
        <div className="metric-box">
          <div className="metric-val emerald">
            {activeCount}/{events.length}
          </div>
          <div className="metric-name">Active Nodes</div>
        </div>
      </div>

      <div className="monitor-entries">
        {events.map((ev) => {
          const count = renderCounts[ev.id] || 0;
          const pct = Math.min((count / maxRender) * 100, 100);

          return (
            <div key={ev.id} className="entry-row">
              <div className="entry-info">
                <span className="entry-title">{ev.title}</span>
                <span className="entry-count">{count} r</span>
              </div>
              <div className="progress-base">
                <div className="progress-accent" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};