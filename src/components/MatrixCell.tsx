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
      <span className="w-5 h-5 rounded-full bg-indigo-500 ring-[3px] ring-indigo-100 block shadow-sm shadow-indigo-500/40 group-hover:shadow-indigo-500/60 transition-shadow" />
    );
  }
  if (type === 'active') {
    return (
      <span className="w-4 h-4 rounded-full bg-teal-500 block shadow-sm shadow-teal-500/30 group-hover:shadow-teal-500/50 transition-shadow" />
    );
  }
  if (type === 'review') {
    return (
      <span className="w-3 h-3 rounded-full bg-amber-500 block shadow-sm shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow" />
    );
  }
  if (type === 'on-demand') {
    return (
      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 block" />
    );
  }
  return <span className="text-slate-200 text-lg font-extralight select-none">·</span>;
}

export function MatrixCell({ involvement, isSelected, isDimmed, phaseLabel, roleLabel, onClick }: Props) {
  const isNone = involvement === 'none';
  const isClickable = !isNone;

  const baseClass = 'relative flex items-center justify-center w-full h-14 transition-all duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-400 group';
  const selectedClass = 'ring-2 ring-slate-700 ring-offset-1 bg-slate-100 shadow-sm';
  const hoverClass = isClickable ? 'hover:bg-slate-100 hover:shadow-sm cursor-pointer' : 'cursor-default';
  const dimClass = isDimmed ? 'opacity-20' : '';

  const tooltip = isClickable
    ? `${roleLabel} · ${phaseLabel} · ${involvement}`
    : '';

  return (
    <div
      className={`${baseClass} ${isSelected ? selectedClass : ''} ${hoverClass} ${dimClass}`}
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
