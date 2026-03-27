import { useCallback, useState } from 'react';
import type { SDLCPhase, Role } from './data/types';
import { matrixData, rawInvolvementMatrix } from './data/matrix';
import { useMatrixState } from './hooks/useMatrixState';
import { LevelSelector } from './components/LevelSelector';
import { RoleGroupFilter } from './components/RoleGroupFilter';
import { MatrixTable } from './components/MatrixTable';
import { CardPanel } from './components/CardPanel';
import { Legend } from './components/Legend';
import { CellEditorModal } from './components/CellEditorModal';

// Build involvement lookup
const involvementMap = new Map<string, import('./data/types').InvolvementType>();
for (const [phase, role, inv] of rawInvolvementMatrix) {
  involvementMap.set(`${phase}|${role}`, inv);
}

export default function App() {
  const {
    level,
    selectedPhase,
    selectedRole,
    activeGroup,
    setLevel,
    selectCell,
    closePanel,
    setActiveGroup,
  } = useMatrixState();

  const handleCellClick = useCallback((phase: SDLCPhase, role: Role) => {
    const inv = involvementMap.get(`${phase}|${role}`);
    if (!inv || inv === 'none') return;
    selectCell(phase, role);
  }, [selectCell]);

  const panelInvolvement = selectedPhase && selectedRole
    ? (involvementMap.get(`${selectedPhase}|${selectedRole}`) ?? 'none')
    : 'none';

  const panelOpen = selectedPhase !== null && selectedRole !== null && panelInvolvement !== 'none';

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorPhase, setEditorPhase] = useState<SDLCPhase | undefined>(undefined);
  const [editorRole, setEditorRole] = useState<Role | undefined>(undefined);

  const openEditor = useCallback((phase?: SDLCPhase, role?: Role) => {
    setEditorPhase(phase);
    setEditorRole(role);
    setEditorOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 via-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 leading-none">AI-SDLC Role Matrix</h1>
                <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Interactive cheatsheet for AI-era delivery roles</p>
              </div>
            </div>
          </div>
          <LevelSelector value={level} onChange={setLevel} />
        </div>
      </header>

      {/* Role group filter */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 border-b border-slate-200 bg-white">
        <RoleGroupFilter activeGroup={activeGroup} onGroupChange={setActiveGroup} />
      </div>

      {/* Main content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
        <p className="text-xs text-slate-400 mb-3">
          Click any cell to open the role cheatsheet. Showing <strong className="text-slate-600">{matrixData.cells.length}</strong> role–phase combinations.
        </p>

        <MatrixTable
          level={level}
          selectedPhase={selectedPhase}
          selectedRole={selectedRole}
          activeGroup={activeGroup}
          onCellClick={handleCellClick}
        />

        {/* Legend */}
        <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
          <Legend />
        </div>

        {/* Add Cell button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => openEditor()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <span className="text-base leading-none">+</span>
            Fill / Edit Cell
          </button>
        </div>
      </main>

      {/* Cell Editor Modal */}
      {editorOpen && (
        <CellEditorModal
          onClose={() => setEditorOpen(false)}
          initialPhase={editorPhase}
          initialRole={editorRole}
        />
      )}

      {/* Card Panel */}
      {panelOpen && (
        <CardPanel
          phase={selectedPhase!}
          role={selectedRole!}
          level={level}
          involvement={panelInvolvement}
          onClose={closePanel}
          onEdit={() => { closePanel(); openEditor(selectedPhase!, selectedRole!); }}
        />
      )}
    </div>
  );
}
