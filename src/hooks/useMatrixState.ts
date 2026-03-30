import { useState, useCallback, useEffect } from 'react';
import type { AILevel, SDLCPhase, Role } from '../data/types';
import { matrixData } from '../data/matrix';

interface MatrixState {
  level: AILevel;
  selectedPhase: SDLCPhase | null;
  selectedRole: Role | null;
  activeGroup: string | null;
}

function getSearchParam<T extends string>(key: string, allowed: T[], fallback: T): T {
  const params = new URLSearchParams(window.location.search);
  const val = params.get(key) as T | null;
  return val && allowed.includes(val) ? val : fallback;
}

const AI_LEVELS: AILevel[] = ['ai-enabled', 'ai-first', 'ai-native'];
const VALID_PHASES = matrixData.phases.map(p => p.id);
const VALID_ROLES = matrixData.roles.map(r => r.id);

export function useMatrixState() {
  const [state, setState] = useState<MatrixState>(() => {
    const params = new URLSearchParams(window.location.search);
    const phase = params.get('phase') as SDLCPhase | null;
    const role = params.get('role') as Role | null;
    return {
      level: getSearchParam<AILevel>('level', AI_LEVELS, 'ai-enabled'),
      selectedPhase: phase && VALID_PHASES.includes(phase) ? phase : null,
      selectedRole: role && VALID_ROLES.includes(role) ? role : null,
      activeGroup: null,
    };
  });

  // Sync URL whenever state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('level', state.level);
    if (state.selectedPhase) params.set('phase', state.selectedPhase);
    if (state.selectedRole) params.set('role', state.selectedRole);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [state.level, state.selectedPhase, state.selectedRole]);

  const setLevel = useCallback((level: AILevel) => {
    setState(s => ({ ...s, level }));
  }, []);

  const selectCell = useCallback((phase: SDLCPhase, role: Role) => {
    setState(s => ({
      ...s,
      selectedPhase: phase,
      selectedRole: role,
    }));
  }, []);

  const closePanel = useCallback(() => {
    setState(s => ({ ...s, selectedPhase: null, selectedRole: null }));
  }, []);

  const setActiveGroup = useCallback((group: string | null) => {
    setState(s => ({ ...s, activeGroup: group }));
  }, []);

  return {
    ...state,
    setLevel,
    selectCell,
    closePanel,
    setActiveGroup,
  };
}
