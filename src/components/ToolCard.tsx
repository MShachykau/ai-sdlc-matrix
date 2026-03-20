import type { Tool } from '../data/types';

interface Props {
  tool: Tool;
}

export function ToolCard({ tool }: Props) {
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-800 leading-tight flex items-center gap-1.5">
            {tool.name}
            {tool.badge && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-700 leading-none">
                {tool.badge}
              </span>
            )}
          </span>
        {tool.url && (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
            aria-label={`Open ${tool.name}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{tool.description}</p>
    </div>
  );
}
