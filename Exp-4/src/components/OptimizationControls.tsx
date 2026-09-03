import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { toggleConfig } from '../store/schedulerSlice';
import { OptimizationConfig } from '../types';

interface OptimizationControlsProps {
  onResetCounters: () => void;
}

export const OptimizationControls: React.FC<OptimizationControlsProps> = ({
  onResetCounters
}) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.scheduler.config);

  const handleToggle = (key: keyof OptimizationConfig) => {
    dispatch(toggleConfig(key));
  };

  return (
    <section className="telemetry-panel">
      <div className="panel-header-row">
        <span className="section-tag">Performance Directives</span>
        <button
          onClick={onResetCounters}
          className="category-chip"
          style={{ padding: '4px 12px' }}
        >
          Reset Telemetry
        </button>
      </div>

      <div className="switches-container">
        <div
          className={`toggle-card ${config.useMemoCards ? 'active' : ''}`}
          onClick={() => handleToggle('useMemoCards')}
        >
          <div className="toggle-indicator">
            <span className="toggle-name">React.memo</span>
            <div className="status-dot" />
          </div>
          <p className="toggle-desc">
            Guards component boundary; skips card renders when its specific props are unchanged.
          </p>
        </div>

        <div
          className={`toggle-card ${config.useCallbackHandlers ? 'active' : ''}`}
          onClick={() => handleToggle('useCallbackHandlers')}
        >
          <div className="toggle-indicator">
            <span className="toggle-name">useCallback</span>
            <div className="status-dot" />
          </div>
          <p className="toggle-desc">
            Maintains stable pointer identity for drag callbacks so memoized nodes aren't invalidated.
          </p>
        </div>

        <div
          className={`toggle-card ${config.useMemoFilter ? 'active' : ''}`}
          onClick={() => handleToggle('useMemoFilter')}
        >
          <div className="toggle-indicator">
            <span className="toggle-name">useMemo Filter</span>
            <div className="status-dot" />
          </div>
          <p className="toggle-desc">
            Caches collection filtration; re-indexes only on categorical or temporal mutation.
          </p>
        </div>

        <div
          className={`toggle-card ${config.liveClock ? 'active' : ''}`}
          onClick={() => handleToggle('liveClock')}
        >
          <div className="toggle-indicator">
            <span className="toggle-name">Pulse Clock (450ms)</span>
            <div className="status-dot" />
          </div>
          <p className="toggle-desc">
            Injects unrelated external state ticks. Watch unmemoized components spike renders.
          </p>
        </div>
      </div>
    </section>
  );
};