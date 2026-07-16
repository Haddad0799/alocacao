import type { Project } from '../../types';

interface Props {
  projects: Project[];
}

export function ProjectList({ projects }: Props) {
  if (!projects.length) {
    return <p className="text-gray-400 text-sm text-center py-4">Nenhum projeto criado ainda.</p>;
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      {projects.map((p) => (
        <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-medium text-gray-800">{p.name}</p>
          {p.description && <p className="text-sm text-gray-500 mt-1">{p.description}</p>}
          <p className="text-xs text-gray-300 mt-2 font-mono">{p.id}</p>
        </div>
      ))}
    </div>
  );
}