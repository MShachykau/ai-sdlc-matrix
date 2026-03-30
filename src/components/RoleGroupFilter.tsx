import type { RoleGroup } from '../data/types';

interface Props {
  activeGroup: string | null;
  onGroupChange: (group: string | null) => void;
}

const groups: { id: RoleGroup; label: string }[] = [
  { id: 'management', label: 'Management' },
  { id: 'analysis-design', label: 'Analysis & Design' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'implementation', label: 'Implementation' },
  { id: 'quality', label: 'Quality' },
  { id: 'infra', label: 'Infrastructure' },
  { id: 'docs', label: 'Docs' },
];

export function RoleGroupFilter({ activeGroup, onGroupChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-1">Filter</span>
      <button
        onClick={() => onGroupChange(null)}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer
          ${activeGroup === null
            ? 'bg-white text-slate-900 shadow-sm'
            : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
      >
        All roles
      </button>
      {groups.map(g => (
        <button
          key={g.id}
          onClick={() => onGroupChange(activeGroup === g.id ? null : g.id)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer
            ${activeGroup === g.id
              ? 'bg-white text-slate-900 shadow-sm'
              : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}
