import type { Allocation, Project, DeveloperListItem } from '../../types';

interface Props {
  allocations: Allocation[];
  projects: Project[];
  developers: DeveloperListItem[];
}

export function AllocationList({ allocations, projects, developers }: Props) {
  if (!allocations.length) {
    return <p className="text-gray-400 text-sm text-center py-4">Nenhuma alocação ainda.</p>;
  }

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? id;
  const devName = (id: string) => developers.find((d) => d.id === id)?.name ?? id;

  return (
    <div className="flex flex-col gap-3 mt-4">
      {allocations.map((a) => (
        <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-800">{projectName(a.projectId)}</p>
              <p className="text-sm text-gray-500">{devName(a.developerId)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{a.startDate}</p>
              <p className="text-xs text-gray-400">{a.endDate}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}