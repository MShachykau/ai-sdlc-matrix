import type { ResourceLink as ResourceLinkType } from '../data/types';

interface Props {
  link: ResourceLinkType;
}

const TYPE_STYLES: Record<ResourceLinkType['type'], { label: string; class: string }> = {
  article: { label: 'Article', class: 'bg-blue-50 text-blue-700 border-blue-100' },
  video: { label: 'Video', class: 'bg-red-50 text-red-700 border-red-100' },
  course: { label: 'Course', class: 'bg-purple-50 text-purple-700 border-purple-100' },
  docs: { label: 'Docs', class: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export function ResourceLink({ link }: Props) {
  const typeStyle = TYPE_STYLES[link.type];

  return (
    <div className="flex flex-col gap-1.5 py-2.5 border-b border-slate-100 last:border-0">
      <div className="flex items-start gap-2">
        <span className={`flex-shrink-0 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded border uppercase tracking-wide ${typeStyle.class}`}>
          {typeStyle.label}
        </span>
        <div className="flex-1 min-w-0">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors leading-snug line-clamp-2"
          >
            {link.title}
          </a>
        </div>
        <span className="flex-shrink-0 text-xs text-slate-400 font-mono">{link.duration}</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed ml-[calc(theme(spacing.10)+theme(spacing.2))] pl-0">
        {link.why}
      </p>
    </div>
  );
}
