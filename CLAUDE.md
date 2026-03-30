# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # TypeScript type-check + Vite production build
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

There are no tests configured.

## Architecture

Single-page React 19 + TypeScript app styled with Tailwind CSS. No router — all state lives in the URL via query params (`?level=ai-enabled&phase=development&role=developer`).

### Data layer (`src/data/`)

- **`types.ts`** — all TypeScript interfaces. Key types: `AILevel` (3 tiers), `SDLCPhase` (7 phases), `Role` (13 roles), `RoleGroup` (6 groups), `MatrixCell`, `CardContent`.
- **`matrix.ts`** — the entire dataset as static TypeScript. Exports `matrixData: MatrixData` (phases/roles/cells) and `rawInvolvementMatrix` (a flat tuple array `[phase, role, involvement][]`). Every `MatrixCell.cards` is a `Record<AILevel, CardContent>` — three full card objects per cell.

### State (`src/hooks/useMatrixState.ts`)

`useMatrixState` is the single source of truth. Reads initial state from `window.location.search` and syncs back via `history.replaceState` on every change. Tracks: `level`, `selectedPhase`, `selectedRole`, `activeGroup` (role group filter — not URL-synced).

### Component flow

```
App
├── builds involvementMap (Map<"phase|role", InvolvementType>) from rawInvolvementMatrix
├── LevelSelector      — switches AILevel
├── RoleGroupFilter    — filters visible role columns by RoleGroup
├── MatrixTable        — renders the grid; each clickable cell is MatrixCell
├── Legend             — involvement color key, rendered below the matrix
├── CardPanel          — right-side drawer (desktop) / bottom sheet (mobile)
│   ├── ToolCard       — individual tool entry
│   └── ResourceLink   — article/video/course link
└── CellEditorModal    — form modal for creating/editing a cell's full content
```

`CardPanel` opens when a non-`none` cell is clicked. It reads `matrixData.cells` directly by `phase + role` key, then accesses `cell.cards[level]` for the current AI level's content.

`CellEditorModal` (opened via "Fill / Edit Cell" button or CardPanel's edit action) edits all three AI-level cards simultaneously. It **does not write to `matrix.ts`** — it downloads a JSON file matching the `MatrixCell` type, which must be manually integrated into `src/data/matrix.ts`.

### Adding new matrix data

All content lives in `src/data/matrix.ts`. To add a new `MatrixCell`:
1. Define a `const` of type `MatrixCell` with all three `cards` entries (`ai-enabled`, `ai-first`, `ai-native`).
2. Add it to the `cells` array in `matrixData`.
3. Add the corresponding `[phase, role, involvement]` tuple to `rawInvolvementMatrix`.

Cells with `involvement: 'none'` are rendered as empty/unclickable in the matrix.
