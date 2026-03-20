export type InvolvementType =
  | "lead"
  | "active"
  | "review"
  | "on-demand"
  | "none";

export type AILevel = "ai-enabled" | "ai-first" | "ai-native";

export type SDLCPhase =
  | "planning"
  | "requirements"
  | "design-architecture"
  | "development"
  | "testing"
  | "deployment-release"
  | "maintenance";

export type Role =
  | "link"
  | "po"
  | "pm"
  | "scrum-master"
  | "ba"
  | "ux-ui"
  | "architect"
  | "tech-lead"
  | "developer"
  | "dwa"
  | "qa"
  | "devops"
  | "tech-writer";

export type RoleGroup =
  | "management"
  | "analysis-design"
  | "architecture"
  | "implementation"
  | "quality"
  | "infra"
  | "docs";

export interface Tool {
  name: string;
  description: string;
  badge?: string;
  url?: string;
}

export interface Metric {
  label: string;
  target: string;
}

export interface ResourceLink {
  title: string;
  url: string;
  type: "article" | "video" | "course" | "docs";
  duration: string;
  why: string;
}

export interface ExpectationLevel {
  minimum: string;
  normal: string;
  advanced: string;
}

export interface CardContent {
  title: string;
  shift?: string;
  tools: Tool[];
  links: ResourceLink[];
  practices: string[];
  expectations: ExpectationLevel;
  antipatterns: string[];
  metrics?: Metric[];
}

export interface MatrixCell {
  phase: SDLCPhase;
  role: Role;
  involvement: InvolvementType;
  cards: Record<AILevel, CardContent>;
}

export interface MatrixData {
  phases: { id: SDLCPhase; label: string }[];
  roles: { id: Role; label: string; group: RoleGroup }[];
  cells: MatrixCell[];
}
