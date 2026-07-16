import type { DeveloperListItem } from '../../types';

interface Props {
  developers: DeveloperListItem[];
  onSelect?: (dev: DeveloperListItem) => void;
  selectedId?: string;
}

export function DeveloperList({ developers, onSelect, selectedId }: Props) {
  if (!developers.length) {
    return <p className="text-gray-400 text-sm text-center py-4">Nenhum developer cadastrado.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {developers.map((dev) => (
        <div
          key={dev.id}
          onClick={() => onSelect?.(dev)}
          className={`border rounded-xl p-4 transition-colors ${
            onSelect ? 'cursor-pointer' : ''
          } ${
            selectedId === dev.id
              ? 'border-fc-orange bg-fc-orange-light'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <p className="font-medium text-gray-800">{dev.name}</p>
          <p className="text-sm text-gray-500">{dev.email}</p>
        </div>
      ))}
    </div>
  );
}