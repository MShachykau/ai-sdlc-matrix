import type { AILevel } from '../data/types';

interface Props {
  value: AILevel;
  onChange: (level: AILevel) => void;
}

const ICONS: Record<AILevel, React.ReactNode> = {
  'ai-enabled': (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  'ai-first': (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.268a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.895-.143z" clipRule="evenodd" />
    </svg>
  ),
  'ai-native': (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
    </svg>
  ),
};

const levels: { id: AILevel; label: string; activeClass: string }[] = [
  { id: 'ai-enabled', label: 'AI Enabled', activeClass: 'bg-[#1D9E75] text-white shadow-lg shadow-emerald-900/40' },
  { id: 'ai-first', label: 'AI-First', activeClass: 'bg-[#378ADD] text-white shadow-lg shadow-blue-900/40' },
  { id: 'ai-native', label: 'AI Native', activeClass: 'bg-[#7F77DD] text-white shadow-lg shadow-violet-900/40' },
];

export function LevelSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mr-0.5 hidden sm:block">Level</span>
      <div className="flex bg-white/10 rounded-xl p-1 gap-1 border border-white/10">
        {levels.map(l => (
          <button
            key={l.id}
            onClick={() => onChange(l.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer
              ${value === l.id ? l.activeClass : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
          >
            {ICONS[l.id]}
            <span>{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
