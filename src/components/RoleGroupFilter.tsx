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
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Filter</span>
      <button
        onClick={() => onGroupChange(null)}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 border
          ${activeGroup === null
            ? 'bg-slate-700 text-white border-slate-700'
            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
      >
        All roles
      </button>
      {groups.map(g => (
        <button
          key={g.id}
          onClick={() => onGroupChange(activeGroup === g.id ? null : g.id)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 border
            ${activeGroup === g.id
              ? 'bg-slate-700 text-white border-slate-700'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}
