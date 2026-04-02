import { useCallback, useState } from 'react';
import type { SDLCPhase, Role } from './data/types';

const SP_SITE = 'https://maksimshachykau.sharepoint.com/sites/AI-SDLCRoleMatrix';
const SP_FOLDER = '/sites/AI-SDLCRoleMatrix/SitePages/ai-sdlc-matrix';

type SPFile = { Name: string; ServerRelativeUrl: string };
type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; files: SPFile[] }
  | { status: 'error'; message: string };

function SharePointButton() {
  const [state, setState] = useState<FetchState>({ status: 'idle' });

  const handleFetch = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const res = await fetch(
        `${SP_SITE}/_api/web/GetFolderByServerRelativeUrl('${SP_FOLDER}')/Files`,
        {
          headers: { Accept: 'application/json;odata=verbose' },
          credentials: 'include',
        }
      );
      if (!res.ok) {
        setState({ status: 'error', message: `HTTP ${res.status}` });
        return;
      }
      const data = await res.json();
      const files: SPFile[] = data?.d?.results ?? [];
      console.log('[SharePoint] files:', files);
      setState({ status: 'ok', files });
    } catch (err) {
      setState({ status: 'error', message: err instanceof Error ? err.message : 'Network error' });
    }
  }, []);

  const colors =
    state.status === 'ok'      ? 'bg-emerald-600 hover:bg-emerald-500 text-white' :
    state.status === 'error'   ? 'bg-red-600 hover:bg-red-500 text-white' :
    'bg-slate-700 hover:bg-slate-600 text-slate-200';

  const label =
    state.status === 'loading' ? 'Fetching…' :
    state.status === 'ok'      ? `${state.files.length} file${state.files.length !== 1 ? 's' : ''}` :
    state.status === 'error'   ? state.message :
    'Fetch SP Files';

  return (
    <button
      onClick={handleFetch}
      disabled={state.status === 'loading'}
      title={state.status === 'ok' ? state.files.map(f => f.Name).join('\n') : undefined}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-60 cursor-pointer ${colors}`}
    >
      {state.status === 'loading' ? (
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      )}
      {label}
    </button>
  );
}
import { matrixData, involvementMap } from './data/matrix';
import { useMatrixState } from './hooks/useMatrixState';
import { useAuth } from './hooks/useAuth';
import { LevelSelector } from './components/LevelSelector';
import { RoleGroupFilter } from './components/RoleGroupFilter';
import { MatrixTable } from './components/MatrixTable';
import { CardPanel } from './components/CardPanel';
import { Legend } from './components/Legend';
import { CellEditorModal } from './components/CellEditorModal';
import { AuthModal } from './components/AuthModal';

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

  const { isAuthenticated, showAuthModal, login, dismissModal } = useAuth();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorPhase, setEditorPhase] = useState<SDLCPhase | undefined>(undefined);
  const [editorRole, setEditorRole] = useState<Role | undefined>(undefined);

  const openEditor = useCallback((phase?: SDLCPhase, role?: Role) => {
    if (!isAuthenticated) return;
    setEditorPhase(phase);
    setEditorRole(role);
    setEditorOpen(true);
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 shadow-xl shadow-slate-900/30">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-blue-400 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-none tracking-tight">AI-SDLC Role Matrix</h1>
                <p className="text-xs text-slate-400 mt-1 hidden sm:block">Interactive cheatsheet for AI-era delivery roles</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SharePointButton />
            <LevelSelector value={level} onChange={setLevel} />
          </div>
        </div>
      </header>

      {/* Role group filter — part of dark nav zone */}
      <div className="bg-slate-800 border-b border-slate-700/80">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-2.5">
          <RoleGroupFilter activeGroup={activeGroup} onGroupChange={setActiveGroup} />
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
        <p className="text-xs text-slate-400 mb-3">
          Click any cell to open the role cheatsheet. Showing <strong className="text-slate-600">{matrixData.cells.length}</strong> role–phase combinations.
        </p>

        <MatrixTable
          selectedPhase={selectedPhase}
          selectedRole={selectedRole}
          activeGroup={activeGroup}
          onCellClick={handleCellClick}
        />

        {/* Legend */}
        <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Legend />
        </div>

        {/* Add Cell button — visible only when authenticated */}
        {isAuthenticated && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => openEditor()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Fill / Edit Cell
            </button>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onLogin={login} onDismiss={dismissModal} />
      )}

      {/* Cell Editor Modal */}
      {editorOpen && isAuthenticated && (
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
          onEdit={isAuthenticated ? () => { closePanel(); openEditor(selectedPhase!, selectedRole!); } : undefined}
        />
      )}
    </div>
  );
}
