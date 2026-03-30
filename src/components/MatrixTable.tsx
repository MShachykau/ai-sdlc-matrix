import { useMemo } from 'react';
import type { SDLCPhase, Role, RoleGroup } from '../data/types';
import { matrixData, involvementMap } from '../data/matrix';
import { MatrixCell } from './MatrixCell';

interface Props {
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
    <div className="w-full overflow-x-auto scrollbar-thin rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-collapse" style={{ minWidth: 900 }}>
        <thead>
          {/* Group header row */}
          <tr className="bg-slate-50">
            <th className="sticky left-0 z-30 bg-slate-50 border-b border-r border-slate-200 w-36 min-w-36" />
            {roleGroups.map(({ group, roles: groupRoles }) => {
              const isDimmed = activeGroup !== null && activeGroup !== group;
              return (
                <th
                  key={group}
                  colSpan={groupRoles.length}
                  className={`border-b border-r border-slate-200 text-center py-2 px-2 transition-opacity duration-150 ${isDimmed ? 'opacity-20' : ''}`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {GROUP_LABELS[group]}
                  </span>
                </th>
              );
            })}
          </tr>
          {/* Role name header row */}
          <tr className="bg-white">
            <th className="sticky left-0 z-30 bg-white border-b border-r border-slate-200 w-36 min-w-36 py-2.5 px-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phase / Role</span>
            </th>
            {roles.map(role => {
              const isDimmed = activeGroup !== null && activeGroup !== role.group;
              const isSelected = selectedRole === role.id;
              return (
                <th
                  key={role.id}
                  className={`border-b border-r border-slate-100 text-center py-2.5 px-1 transition-opacity duration-150 ${isDimmed ? 'opacity-20' : ''}`}
                >
                  <span className={`text-[11px] font-semibold whitespace-nowrap ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                    {role.label}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {phases.map((phase, phaseIdx) => (
            <tr key={phase.id} className={phaseIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
              {/* Sticky phase label */}
              <td className={`sticky left-0 z-20 border-r border-b border-slate-100 py-1 px-3 min-w-36 w-36 ${phaseIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}>
                <span className={`text-[11px] font-bold whitespace-nowrap ${selectedPhase === phase.id ? 'text-slate-900' : 'text-slate-500'}`}>
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
