import { useState, useEffect, useCallback } from "react";
import type {
  AILevel,
  SDLCPhase,
  Role,
  InvolvementType,
  MatrixCell,
  CardContent,
  Tool,
  ResourceLink,
  Metric,
} from "../data/types";
import { matrixData } from "../data/matrix";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
  initialPhase?: SDLCPhase;
  initialRole?: Role;
}

// ─── Local form types (all fields as strings for controlled inputs) ───────────

interface ToolDraft {
  name: string;
  description: string;
  badge: string;
  url: string;
}

interface LinkDraft {
  title: string;
  url: string;
  type: "article" | "video" | "course" | "docs";
  duration: string;
  why: string;
}

interface MetricDraft {
  label: string;
  target: string;
}

interface CardDraft {
  title: string;
  shift: string;
  tools: ToolDraft[];
  practices: string[];
  expectations: { minimum: string; normal: string; advanced: string };
  antipatterns: string[];
  links: LinkDraft[];
  metrics: MetricDraft[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AI_LEVELS: { id: AILevel; label: string; color: string; activeClass: string }[] = [
  {
    id: "ai-enabled",
    label: "AI Enabled",
    color: "text-emerald-700",
    activeClass:
      "bg-emerald-600 text-white border-emerald-600 shadow-sm",
  },
  {
    id: "ai-first",
    label: "AI-First",
    color: "text-blue-700",
    activeClass: "bg-blue-600 text-white border-blue-600 shadow-sm",
  },
  {
    id: "ai-native",
    label: "AI Native",
    color: "text-violet-700",
    activeClass: "bg-violet-600 text-white border-violet-600 shadow-sm",
  },
];

const INVOLVEMENT_OPTIONS: InvolvementType[] = [
  "lead",
  "active",
  "review",
  "on-demand",
  "none",
];

const LINK_TYPE_OPTIONS: LinkDraft["type"][] = [
  "article",
  "video",
  "course",
  "docs",
];

function emptyTool(): ToolDraft {
  return { name: "", description: "", badge: "", url: "" };
}

function emptyLink(): LinkDraft {
  return { title: "", url: "", type: "article", duration: "", why: "" };
}

function emptyMetric(): MetricDraft {
  return { label: "", target: "" };
}

function emptyCard(): CardDraft {
  return {
    title: "",
    shift: "",
    tools: [],
    practices: [],
    expectations: { minimum: "", normal: "", advanced: "" },
    antipatterns: [],
    links: [],
    metrics: [],
  };
}

function draftFromCard(card: CardContent): CardDraft {
  return {
    title: card.title,
    shift: card.shift ?? "",
    tools: card.tools.map((t: Tool) => ({
      name: t.name,
      description: t.description,
      badge: t.badge ?? "",
      url: t.url ?? "",
    })),
    practices: [...card.practices],
    expectations: {
      minimum: card.expectations?.minimum ?? "",
      normal: card.expectations?.normal ?? "",
      advanced: card.expectations?.advanced ?? "",
    },
    antipatterns: [...card.antipatterns],
    links: card.links.map((l: ResourceLink) => ({
      title: l.title,
      url: l.url,
      type: l.type,
      duration: l.duration,
      why: l.why,
    })),
    metrics: (card.metrics ?? []).map((m: Metric) => ({
      label: m.label,
      target: m.target,
    })),
  };
}

function cardFromDraft(draft: CardDraft): CardContent {
  const card: CardContent = {
    title: draft.title,
    tools: draft.tools
      .filter((t) => t.name.trim() !== "")
      .map((t) => {
        const tool: Tool = { name: t.name, description: t.description };
        if (t.badge.trim()) tool.badge = t.badge;
        if (t.url.trim()) tool.url = t.url;
        return tool;
      }),
    practices: draft.practices.filter((p) => p.trim() !== ""),
    expectations: { ...draft.expectations },
    antipatterns: draft.antipatterns.filter((a) => a.trim() !== ""),
    links: draft.links
      .filter((l) => l.title.trim() !== "" || l.url.trim() !== "")
      .map((l) => ({
        title: l.title,
        url: l.url,
        type: l.type,
        duration: l.duration,
        why: l.why,
      })),
  };
  if (draft.shift.trim()) card.shift = draft.shift;
  const metrics = draft.metrics.filter((m) => m.label.trim() !== "");
  if (metrics.length > 0) card.metrics = metrics;
  return card;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-5 first:mt-0">
      {children}
    </p>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 border border-dashed border-slate-300 hover:border-slate-400 rounded-lg px-2.5 py-1 transition-colors mt-2 cursor-pointer"
    >
      <span className="text-sm leading-none font-bold">+</span>
      {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors text-base leading-none"
      aria-label="Remove item"
      title="Remove"
    >
      &times;
    </button>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full text-sm rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition ${className}`}
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full text-sm rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition resize-none"
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`text-sm rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ─── Tools sub-section ───────────────────────────────────────────────────────

function ToolsSection({
  tools,
  onChange,
}: {
  tools: ToolDraft[];
  onChange: (tools: ToolDraft[]) => void;
}) {
  function update(index: number, patch: Partial<ToolDraft>) {
    onChange(tools.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }

  function remove(index: number) {
    onChange(tools.filter((_, i) => i !== index));
  }

  return (
    <div>
      <SectionLabel>Tools</SectionLabel>
      <div className="space-y-3">
        {tools.map((tool, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs text-slate-400 font-medium">
                Tool {i + 1}
              </span>
              <RemoveButton onClick={() => remove(i)} />
            </div>
            <TextInput
              value={tool.name}
              onChange={(v) => update(i, { name: v })}
              placeholder="Name (e.g. GitHub Copilot)"
            />
            <TextArea
              value={tool.description}
              onChange={(v) => update(i, { description: v })}
              placeholder="Description"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-2">
              <TextInput
                value={tool.badge}
                onChange={(v) => update(i, { badge: v })}
                placeholder="Badge (optional)"
              />
              <TextInput
                value={tool.url}
                onChange={(v) => update(i, { url: v })}
                placeholder="URL (optional)"
              />
            </div>
          </div>
        ))}
      </div>
      <AddButton onClick={() => onChange([...tools, emptyTool()])} label="Add tool" />
    </div>
  );
}

// ─── String list sub-section ─────────────────────────────────────────────────

function StringListSection({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  function update(index: number, value: string) {
    onChange(items.map((it, i) => (i === index ? value : it)));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <TextArea
              value={item}
              onChange={(v) => update(i, v)}
              placeholder={placeholder}
              rows={2}
            />
            <RemoveButton onClick={() => remove(i)} />
          </div>
        ))}
      </div>
      <AddButton onClick={() => onChange([...items, ""])} label={`Add ${label.toLowerCase()}`} />
    </div>
  );
}

// ─── Links sub-section ───────────────────────────────────────────────────────

function LinksSection({
  links,
  onChange,
}: {
  links: LinkDraft[];
  onChange: (links: LinkDraft[]) => void;
}) {
  function update(index: number, patch: Partial<LinkDraft>) {
    onChange(links.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }

  function remove(index: number) {
    onChange(links.filter((_, i) => i !== index));
  }

  return (
    <div>
      <SectionLabel>Links</SectionLabel>
      <div className="space-y-3">
        {links.map((link, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs text-slate-400 font-medium">
                Link {i + 1}
              </span>
              <RemoveButton onClick={() => remove(i)} />
            </div>
            <TextInput
              value={link.title}
              onChange={(v) => update(i, { title: v })}
              placeholder="Title"
            />
            <TextInput
              value={link.url}
              onChange={(v) => update(i, { url: v })}
              placeholder="URL"
            />
            <div className="grid grid-cols-2 gap-2">
              <SelectInput
                value={link.type}
                onChange={(v) =>
                  update(i, { type: v as LinkDraft["type"] })
                }
                options={LINK_TYPE_OPTIONS.map((t) => ({
                  value: t,
                  label: t.charAt(0).toUpperCase() + t.slice(1),
                }))}
              />
              <TextInput
                value={link.duration}
                onChange={(v) => update(i, { duration: v })}
                placeholder="Duration (e.g. 8 min)"
              />
            </div>
            <TextArea
              value={link.why}
              onChange={(v) => update(i, { why: v })}
              placeholder="Why this resource?"
              rows={2}
            />
          </div>
        ))}
      </div>
      <AddButton onClick={() => onChange([...links, emptyLink()])} label="Add link" />
    </div>
  );
}

// ─── Metrics sub-section ─────────────────────────────────────────────────────

function MetricsSection({
  metrics,
  onChange,
}: {
  metrics: MetricDraft[];
  onChange: (metrics: MetricDraft[]) => void;
}) {
  function update(index: number, patch: Partial<MetricDraft>) {
    onChange(metrics.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  function remove(index: number) {
    onChange(metrics.filter((_, i) => i !== index));
  }

  return (
    <div>
      <SectionLabel>Metrics (optional)</SectionLabel>
      <div className="space-y-2">
        {metrics.map((metric, i) => (
          <div key={i} className="flex items-center gap-2">
            <TextInput
              value={metric.label}
              onChange={(v) => update(i, { label: v })}
              placeholder="Label (e.g. PR cycle time)"
            />
            <TextInput
              value={metric.target}
              onChange={(v) => update(i, { target: v })}
              placeholder="Target (e.g. < 2h)"
            />
            <RemoveButton onClick={() => remove(i)} />
          </div>
        ))}
      </div>
      <AddButton
        onClick={() => onChange([...metrics, emptyMetric()])}
        label="Add metric"
      />
    </div>
  );
}

// ─── Per-level card editor ────────────────────────────────────────────────────

function CardEditor({
  draft,
  onChange,
}: {
  draft: CardDraft;
  onChange: (patch: Partial<CardDraft>) => void;
}) {
  return (
    <div className="space-y-1 pb-4">
      {/* Title */}
      <SectionLabel>Title</SectionLabel>
      <TextInput
        value={draft.title}
        onChange={(v) => onChange({ title: v })}
        placeholder="Card title (required)"
      />

      {/* Shift */}
      <SectionLabel>Key Shift</SectionLabel>
      <TextArea
        value={draft.shift}
        onChange={(v) => onChange({ shift: v })}
        placeholder="What changes compared to the previous AI level? (optional)"
        rows={2}
      />

      {/* Tools */}
      <ToolsSection
        tools={draft.tools}
        onChange={(tools) => onChange({ tools })}
      />

      {/* Practices */}
      <StringListSection
        label="Practices"
        items={draft.practices}
        onChange={(practices) => onChange({ practices })}
        placeholder="Describe a practice or behaviour change..."
      />

      {/* Expectations */}
      <SectionLabel>Expectations</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {(["minimum", "normal", "advanced"] as const).map((tier) => (
          <div key={tier} className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {tier}
            </span>
            <TextArea
              value={draft.expectations[tier]}
              onChange={(v) =>
                onChange({ expectations: { ...draft.expectations, [tier]: v } })
              }
              placeholder={`${tier} expectation...`}
              rows={3}
            />
          </div>
        ))}
      </div>

      {/* Anti-patterns */}
      <StringListSection
        label="Anti-patterns"
        items={draft.antipatterns}
        onChange={(antipatterns) => onChange({ antipatterns })}
        placeholder="Describe an anti-pattern to avoid..."
      />

      {/* Links */}
      <LinksSection
        links={draft.links}
        onChange={(links) => onChange({ links })}
      />

      {/* Metrics */}
      <MetricsSection
        metrics={draft.metrics}
        onChange={(metrics) => onChange({ metrics })}
      />
    </div>
  );
}

// ─── Main modal ──────────────────────────────────────────────────────────────

type CardDraftMap = Record<AILevel, CardDraft>;

export function CellEditorModal({ onClose, initialPhase, initialRole }: Props) {
  // ── Header state ──────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<SDLCPhase>(
    initialPhase ?? matrixData.phases[0].id
  );
  const [role, setRole] = useState<Role>(initialRole ?? matrixData.roles[0].id);
  const [involvement, setInvolvement] = useState<InvolvementType>("active");

  // ── Tab state ─────────────────────────────────────────────────────────────
  const [activeLevel, setActiveLevel] = useState<AILevel>("ai-enabled");

  // ── Card drafts per level ─────────────────────────────────────────────────
  const [cards, setCards] = useState<CardDraftMap>(() => {
    // Pre-fill if an existing cell is found in the dataset
    const existing = matrixData.cells.find(
      (c) =>
        c.phase === (initialPhase ?? matrixData.phases[0].id) &&
        c.role === (initialRole ?? matrixData.roles[0].id)
    );

    if (existing) {
      return {
        "ai-enabled": draftFromCard(existing.cards["ai-enabled"]),
        "ai-first": draftFromCard(existing.cards["ai-first"]),
        "ai-native": draftFromCard(existing.cards["ai-native"]),
      };
    }

    return {
      "ai-enabled": emptyCard(),
      "ai-first": emptyCard(),
      "ai-native": emptyCard(),
    };
  });

  function patchCard(level: AILevel, patch: Partial<CardDraft>) {
    setCards((prev) => ({
      ...prev,
      [level]: { ...prev[level], ...patch },
    }));
  }

  // ── Reload cards when phase/role changes ──────────────────────────────────
  const [isExisting, setIsExisting] = useState<boolean>(() => {
    return matrixData.cells.some(
      (c) =>
        c.phase === (initialPhase ?? matrixData.phases[0].id) &&
        c.role === (initialRole ?? matrixData.roles[0].id)
    );
  });

  useEffect(() => {
    const existing = matrixData.cells.find(
      (c) => c.phase === phase && c.role === role
    );
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInvolvement(existing.involvement);
      setCards({
        "ai-enabled": draftFromCard(existing.cards["ai-enabled"]),
        "ai-first": draftFromCard(existing.cards["ai-first"]),
        "ai-native": draftFromCard(existing.cards["ai-native"]),
      });
      setIsExisting(true);
    } else {
      setInvolvement("active");
      setCards({
        "ai-enabled": emptyCard(),
        "ai-first": emptyCard(),
        "ai-native": emptyCard(),
      });
      setIsExisting(false);
    }
  }, [phase, role]);

  // ── Keyboard close ────────────────────────────────────────────────────────
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ── Download JSON ─────────────────────────────────────────────────────────
  function handleDownload() {
    const cell: MatrixCell = {
      phase,
      role,
      involvement,
      cards: {
        "ai-enabled": cardFromDraft(cards["ai-enabled"]),
        "ai-first": cardFromDraft(cards["ai-first"]),
        "ai-native": cardFromDraft(cards["ai-native"]),
      },
    };

    const json = JSON.stringify(cell, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${phase}-${role}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const activeLevelMeta = AI_LEVELS.find((l) => l.id === activeLevel)!;
  const allTitlesPresent = AI_LEVELS.every((l) => cards[l.id].title.trim() !== '');;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cell Editor"
        className="fixed z-50 inset-0 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="pointer-events-auto w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">

          {/* ── Modal header ───────────────────────────────────────────────── */}
          <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between gap-4 bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 via-blue-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white leading-none">
                  Cell Editor
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Define content for all three AI levels
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* ── Scrollable body ────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-5 space-y-5">

              {/* Existing / new badge */}
              {isExisting ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  Editing existing cell — data loaded from matrix
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  New cell
                </div>
              )}

              {/* Header fields: Phase / Role / Involvement */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Phase
                  </label>
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value as SDLCPhase)}
                    className="text-sm rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                  >
                    {matrixData.phases.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="text-sm rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                  >
                    {matrixData.roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Involvement
                  </label>
                  <select
                    value={involvement}
                    onChange={(e) =>
                      setInvolvement(e.target.value as InvolvementType)
                    }
                    className="text-sm rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                  >
                    {INVOLVEMENT_OPTIONS.map((inv) => (
                      <option key={inv} value={inv}>
                        {inv.charAt(0).toUpperCase() + inv.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-slate-100" />

              {/* AI Level tabs */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  AI Level Content
                </p>
                <div className="flex bg-slate-800 rounded-xl p-1 gap-1 w-fit border border-slate-700">
                  {AI_LEVELS.map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setActiveLevel(lvl.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer
                        ${
                          activeLevel === lvl.id
                            ? lvl.activeClass
                            : "text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active tab indicator */}
              <div
                className={`rounded-xl border px-4 py-3 text-xs font-medium
                  ${
                    activeLevelMeta.id === "ai-enabled"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : activeLevelMeta.id === "ai-first"
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-violet-50 border-violet-200 text-violet-700"
                  }`}
              >
                Editing content for{" "}
                <span className="font-bold">{activeLevelMeta.label}</span>
              </div>

              {/* Card editor for the active level */}
              <CardEditor
                draft={cards[activeLevel]}
                onChange={(patch) => patchCard(activeLevel, patch)}
              />
            </div>
          </div>

          {/* ── Modal footer ───────────────────────────────────────────────── */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400 hidden sm:block">
              Press <kbd className="px-1 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-mono">Esc</kbd> to close
            </p>
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!allTitlesPresent}
                title={!allTitlesPresent ? 'All three AI level cards must have a title before downloading' : undefined}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
