import type { InvolvementType } from '../data/types';

interface Props {
  involvement: InvolvementType;
  isSelected: boolean;
  isDimmed: boolean;
  phaseLabel: string;
  roleLabel: string;
  onClick: () => void;
}

function InvolvementBadge({ type }: { type: InvolvementType }) {
  if (type === 'lead') {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="w-5 h-5 rounded-full border-2 border-blue-300 bg-blue-500 block" />
      </div>
    );
  }
  if (type === 'active') {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="w-4 h-4 rounded-full bg-teal-500 block" />
      </div>
    );
  }
   if (type === 'review') {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="w-3 h-3 rounded-full bg-amber-500 block" />
      </div>
    );
  }
  if (type === 'on-demand') {
    return (
      <div className="flex flex-col items-center">
        <span className="w-2 h-2 rounded-full bg-slate-400 block" />
      </div>
    );
  }
  return <span className="text-slate-300 text-lg font-light">—</span>;
}

export function MatrixCell({ involvement, isSelected, isDimmed, phaseLabel, roleLabel, onClick }: Props) {
  const isNone = involvement === 'none';
  const isClickable = !isNone;

  const baseClass = 'relative flex items-center justify-center w-full h-16 transition-all duration-150 rounded';
  const selectedClass = 'ring-2 ring-offset-1 ring-slate-700 bg-slate-100';
  const hoverClass = isClickable ? 'hover:bg-slate-50 hover:shadow-sm cursor-pointer' : 'cursor-default';
  const dimClass = isDimmed ? 'opacity-20' : '';

  const tooltip = isClickable
    ? `${roleLabel} · ${phaseLabel} · ${involvement}`
    : '';

  return (
    <div
      className={`${baseClass} ${isSelected ? selectedClass : ''} ${hoverClass} ${dimClass} group`}
      onClick={isClickable ? onClick : undefined}
      title={tooltip}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      aria-label={isClickable ? `Open ${roleLabel} at ${phaseLabel}` : undefined}
    >
      <InvolvementBadge type={involvement} />
    </div>
  );
}
