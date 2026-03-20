import type { InvolvementType } from '../data/types';

const items: { type: InvolvementType; label: string; description: string }[] = [
  { type: 'lead', label: 'Lead', description: 'Owns and drives this phase' },
  { type: 'active', label: 'Active', description: 'Core contributor' },
  { type: 'review', label: 'Review', description: 'Reviews and approves outputs' },
  { type: 'on-demand', label: 'On-demand', description: 'Consulted when needed' },
];

function InvolvementDot({ type }: { type: InvolvementType }) {
  if (type === 'lead') return <span className="w-5 h-5 rounded-full border-2 border-blue-300 bg-blue-500 block" />;
  if (type === 'active') return <span className="w-4 h-4 rounded-full bg-teal-500 block" />;
  if (type === 'review') return <span className="w-3 h-3 rounded-full bg-amber-500 block" />;
  if (type === 'on-demand') return <span className="w-2 h-2 rounded-full bg-slate-400 block" />;
  return <span className="inline-block w-3 h-3 text-slate-300 text-center leading-none">—</span>;
}

export function Legend() {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Involvement</span>
      {items.map(item => (
        <div key={item.type} className="flex items-center gap-1.5">
          <InvolvementDot type={item.type} />
          <span className="text-sm font-medium text-slate-700">{item.label}</span>
          <span className="text-xs text-slate-400 hidden sm:inline">— {item.description}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 text-slate-300 font-bold text-center leading-3">—</span>
        <span className="text-sm font-medium text-slate-400">Not involved</span>
      </div>
    </div>
  );
}
