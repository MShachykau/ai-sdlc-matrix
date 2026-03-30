import type { InvolvementType } from '../data/types';

const items: { type: InvolvementType; label: string; description: string }[] = [
  { type: 'lead', label: 'Lead', description: 'Owns and drives this phase' },
  { type: 'active', label: 'Active', description: 'Core contributor' },
  { type: 'review', label: 'Review', description: 'Reviews and approves outputs' },
  { type: 'on-demand', label: 'On-demand', description: 'Consulted when needed' },
];

function InvolvementDot({ type }: { type: InvolvementType }) {
  if (type === 'lead') return <span className="w-5 h-5 rounded-full bg-indigo-500 ring-[3px] ring-indigo-100 block flex-shrink-0 shadow-sm shadow-indigo-500/30" />;
  if (type === 'active') return <span className="w-4 h-4 rounded-full bg-teal-500 block flex-shrink-0 shadow-sm shadow-teal-500/30" />;
  if (type === 'review') return <span className="w-3 h-3 rounded-full bg-amber-500 block flex-shrink-0 shadow-sm shadow-amber-500/30" />;
  if (type === 'on-demand') return <span className="w-2.5 h-2.5 rounded-full bg-slate-300 block flex-shrink-0" />;
  return null;
}

export function Legend() {
  return (
    <div className="flex flex-wrap gap-5 items-center">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Involvement</span>
      {items.map(item => (
        <div key={item.type} className="flex items-center gap-2">
          <InvolvementDot type={item.type} />
          <span className="text-xs font-semibold text-slate-700">{item.label}</span>
          <span className="text-xs text-slate-400 hidden sm:inline">— {item.description}</span>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-200 block flex-shrink-0" />
        <span className="text-xs font-semibold text-slate-400">Not involved</span>
      </div>
    </div>
  );
}
