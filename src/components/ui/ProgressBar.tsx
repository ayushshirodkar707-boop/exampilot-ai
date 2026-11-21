'use client';

type ProgressColor = 'primary' | 'success' | 'warning' | 'danger';
type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;
  label?: string;
  color?: ProgressColor;
  size?: ProgressSize;
  showPercentage?: boolean;
}

const colorMap: Record<ProgressColor, string> = {
  primary: 'var(--color-primary, #6366f1)',
  success: 'var(--color-success, #22c55e)',
  warning: 'var(--color-warning, #f59e0b)',
  danger: 'var(--color-danger, #ef4444)',
};

const sizeMap: Record<ProgressSize, string> = {
  sm: '6px',
  md: '10px',
  lg: '16px',
};

export default function ProgressBar({
  value,
  label,
  color = 'primary',
  size = 'md',
  showPercentage = false,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const barHeight = sizeMap[size];
  const barColor = colorMap[color];

  return (
    <div className="progress-bar-wrapper" style={{ width: '100%' }}>
      {(label || showPercentage) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: '0.875rem',
          }}
        >
          {label && (
            <span className="progress-label" style={{ fontWeight: 500 }}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="progress-percentage" style={{ opacity: 0.7 }}>
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <div
        className="progress-track"
        style={{
          width: '100%',
          height: barHeight,
          backgroundColor: 'var(--color-surface-alt, rgba(128, 128, 128, 0.2))',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className="progress-fill"
          style={{
            width: `${clampedValue}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: '9999px',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
}
