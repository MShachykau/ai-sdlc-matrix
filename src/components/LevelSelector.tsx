import type { AILevel } from '../data/types';

interface Props {
  value: AILevel;
  onChange: (level: AILevel) => void;
}

const levels: { id: AILevel; label: string; emoji: string; color: string; activeClass: string }[] = [
  { id: 'ai-enabled', label: 'AI Enabled', emoji: '🟢', color: 'text-emerald-700', activeClass: 'bg-emerald-600 text-white shadow-sm' },
  { id: 'ai-first', label: 'AI-First', emoji: '🔵', color: 'text-blue-700', activeClass: 'bg-blue-600 text-white shadow-sm' },
  { id: 'ai-native', label: 'AI Native', emoji: '🟣', color: 'text-violet-700', activeClass: 'bg-violet-600 text-white shadow-sm' },
];

export function LevelSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mr-1 hidden sm:block">AI Level</span>
      <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
        {levels.map(l => (
          <button
            key={l.id}
            onClick={() => onChange(l.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 whitespace-nowrap
              ${value === l.id ? l.activeClass : 'text-slate-600 hover:text-slate-900 hover:bg-white'}`}
          >
            <span className="text-base leading-none">{l.emoji}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
