import { useMemo } from 'react';
import type { AILevel, SDLCPhase, Role, RoleGroup } from '../data/types';
import { matrixData, rawInvolvementMatrix } from '../data/matrix';
import { MatrixCell } from './MatrixCell';

interface Props {
  level: AILevel;
  selectedPhase: SDLCPhase | null;
  selectedRole: Role | null;
  activeGroup: string | null;
  onCellClick: (phase: SDLCPhase, role: Role) => void;
}

const GROUP_LABELS: Record<RoleGroup, string> = {
  'management': 'Management',
  'analysis-design': 'Analysis & Design',
  'architecture': 'Architecture',
  'implementation': 'Implementation',
  'quality': 'Quality',
  'infra': 'Infrastructure',
  'docs': 'Docs',
};

// Build involvement lookup: phase|role -> involvement
const involvementMap = new Map<string, import('../data/types').InvolvementType>();
for (const [phase, role, inv] of rawInvolvementMatrix) {
  involvementMap.set(`${phase}|${role}`, inv);
}

export function MatrixTable({ selectedPhase, selectedRole, activeGroup, onCellClick }: Props) {
  const { phases, roles } = matrixData;

  // Group roles for header
  const roleGroups = useMemo(() => {
    const groups: { group: RoleGroup; roles: typeof roles }[] = [];
    let currentGroup: RoleGroup | null = null;
    let currentRoles: typeof roles = [];

    for (const role of roles) {
      if (role.group !== currentGroup) {
        if (currentGroup !== null) {
          groups.push({ group: currentGroup, roles: currentRoles });
        }
        currentGroup = role.group;
        currentRoles = [role];
      } else {
        currentRoles.push(role);
      }
    }
    if (currentGroup !== null) {
      groups.push({ group: currentGroup, roles: currentRoles });
    }
    return groups;
  }, [roles]);

  return (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-collapse" style={{ minWidth: 900 }}>
        <thead>
          {/* Group header row */}
          <tr>
            <th className="sticky left-0 z-30 bg-white border-b border-r border-slate-200 w-36 min-w-36" />
            {roleGroups.map(({ group, roles: groupRoles }) => {
              const isDimmed = activeGroup !== null && activeGroup !== group;
              return (
                <th
                  key={group}
                  colSpan={groupRoles.length}
                  className={`border-b border-r border-slate-100 text-center py-1.5 px-2 transition-opacity duration-150 ${isDimmed ? 'opacity-20' : ''}`}
                >
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {GROUP_LABELS[group]}
                  </span>
                </th>
              );
            })}
          </tr>
          {/* Role name header row */}
          <tr>
            <th className="sticky left-0 z-30 bg-white border-b border-r border-slate-200 w-36 min-w-36 py-2 px-3">
              <span className="text-xs font-medium text-slate-400">Phase / Role</span>
            </th>
            {roles.map(role => {
              const isDimmed = activeGroup !== null && activeGroup !== role.group;
              const isSelected = selectedRole === role.id;
              return (
                <th
                  key={role.id}
                  className={`border-b border-r border-slate-100 text-center py-2 px-1 transition-opacity duration-150 ${isDimmed ? 'opacity-20' : ''}`}
                >
                  <span className={`text-xs font-semibold whitespace-nowrap ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                    {role.label}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {phases.map((phase, phaseIdx) => (
            <tr key={phase.id} className={phaseIdx % 2 === 1 ? 'bg-slate-50/50' : ''}>
              {/* Sticky phase label */}
              <td className="sticky left-0 z-20 bg-inherit border-r border-b border-slate-100 py-1 px-3 min-w-36 w-36">
                <span className={`text-xs font-semibold whitespace-nowrap ${selectedPhase === phase.id ? 'text-slate-900' : 'text-slate-600'}`}>
                  {phase.label}
                </span>
              </td>
              {roles.map(role => {
                const key = `${phase.id}|${role.id}`;
                const involvement = involvementMap.get(key) ?? 'none';
                const isSelected = selectedPhase === phase.id && selectedRole === role.id;
                const isDimmed = activeGroup !== null && activeGroup !== role.group;

                return (
                  <td key={role.id} className="border-r border-b border-slate-100 p-1 text-center">
                    <MatrixCell
                      involvement={involvement}
                      isSelected={isSelected}
                      isDimmed={isDimmed}
                      phaseLabel={phase.label}
                      roleLabel={role.label}
                      onClick={() => onCellClick(phase.id, role.id)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
