import { useState, useEffect, useCallback } from 'react';
import type { AILevel, SDLCPhase, Role, InvolvementType } from '../data/types';
import { matrixData } from '../data/matrix';
import { ToolCard } from './ToolCard';
import { ResourceLink } from './ResourceLink';

interface Props {
  phase: SDLCPhase;
  role: Role;
  level: AILevel;
  involvement: InvolvementType;
  onClose: () => void;
  onEdit: () => void;
}

const LEVEL_STYLES: Record<AILevel, { label: string; bg: string; text: string; border: string }> = {
  'ai-enabled': { label: 'AI Enabled', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'ai-first': { label: 'AI-First', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'ai-native': { label: 'AI Native', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
};

const INVOLVEMENT_STYLES: Record<InvolvementType, { label: string; class: string }> = {
  'lead': { label: 'Lead', class: 'bg-blue-100 text-blue-800' },
  'active': { label: 'Active', class: 'bg-teal-100 text-teal-800' },
  'review': { label: 'Review', class: 'bg-amber-100 text-amber-800' },
  'on-demand': { label: 'On-demand', class: 'bg-slate-100 text-slate-700' },
  'none': { label: 'None', class: 'bg-slate-100 text-slate-500' },
};

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const mins = Math.ceil(words / 200);
  return `~${mins} min read`;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-3 px-0 text-left group"
      >
        <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{title}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export function CardPanel({ phase, role, level, involvement, onClose, onEdit }: Props) {
  const phaseInfo = matrixData.phases.find(p => p.id === phase);
  const roleInfo = matrixData.roles.find(r => r.id === role);
  const cell = matrixData.cells.find(c => c.phase === phase && c.role === role);
  const card = cell?.cards[level];

  const levelStyle = LEVEL_STYLES[level];
  const invStyle = INVOLVEMENT_STYLES[involvement];

  // Keyboard: close on Escape
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Lock body scroll on mobile
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!card || !phaseInfo || !roleInfo) return null;

  const readTime = estimateReadTime(
    [card.title, ...card.practices, card.expectations?.minimum, card.expectations?.normal, card.expectations?.advanced, ...card.antipatterns].join(' ')
  );

  const today = new Date();
  const nextReview = new Date(today);
  nextReview.setMonth(nextReview.getMonth() + 3);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 md:bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className="fixed z-50 bg-white shadow-2xl flex flex-col
          bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl
          md:top-0 md:bottom-0 md:left-auto md:right-0 md:w-[580px] md:max-h-none md:rounded-none md:rounded-l-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${roleInfo.label} at ${phaseInfo.label}`}
      >
        {/* Drag handle (mobile) */}
        <div className="md:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-3 pb-4 border-b border-slate-100">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
            <span>{phaseInfo.label}</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-slate-600">{roleInfo.label}</span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900 leading-snug flex-1">{card.title}</h2>
            <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
                aria-label="Edit cell"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close panel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${invStyle.class}`}>
              {invStyle.label}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}>
              {levelStyle.label}
            </span>
            <span className="text-xs text-slate-400 ml-auto">{readTime}</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 scrollbar-thin">
          {card.shift && (
            <div className="my-4 rounded-xl bg-violet-50 border border-violet-200 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-1">
                Key shift from {LEVEL_STYLES[level].label}
              </p>
              <p className="text-sm text-violet-900 leading-relaxed">{card.shift}</p>
            </div>
          )}
          <Section title="Tools">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {card.tools.map(tool => (
                <ToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </Section>

          <Section title="Read / Watch">
            <div>
              {card.links.map(link => (
                <ResourceLink key={link.url || link.title} link={link} />
              ))}
            </div>
          </Section>

          <Section title="Do differently">
            <ol className="space-y-2.5">
              {card.practices.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{p}</p>
                </li>
              ))}
            </ol>
            {card.metrics && card.metrics.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {card.metrics.map((m, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex flex-col gap-1 text-center">
                    <span className="text-[10px] text-slate-400 leading-snug">{m.label}</span>
                    <span className="text-sm font-bold text-slate-800">{m.target}</span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {card.expectations && (
          <Section title="Team expectations">
            <div className="grid grid-cols-3 gap-2">
              {(['minimum', 'normal', 'advanced'] as const).map(tier => (
                <div key={tier} className="rounded-lg bg-slate-50 border border-slate-100 p-3 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tier}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.expectations?.[tier]}</p>
                </div>
              ))}
            </div>
          </Section>
          )}

          <Section title="Anti-patterns" defaultOpen={true}>
            <ul className="space-y-2.5">
              {card.antipatterns.map((a, i) => (
                <li key={i} className="flex gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
                  <svg className="flex-shrink-0 w-4 h-4 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xs text-red-800 leading-relaxed">{a}</p>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Last updated: {today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
          <span className="text-xs text-slate-400">
            Next review: {nextReview.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </aside>
    </>
  );
}
