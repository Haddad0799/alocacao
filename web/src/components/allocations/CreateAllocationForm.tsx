import { useEffect, useState } from 'react';
import { projectsApi } from '../../api/projects.api';
import { usersApi } from '../../api/users.api';
import { allocationsApi } from '../../api/allocations.api';
import { DeveloperList } from '../developers/DeveloperList';
import type { Project, DeveloperListItem, Allocation } from '../../types';

interface Props {
  onCreated: (allocation: Allocation) => void;
}

export function CreateAllocationForm({ onCreated }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<DeveloperListItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedDevId, setSelectedDevId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    projectsApi.list().then(setProjects).catch(() => {});
    usersApi.listDevelopers().then(setDevelopers).catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!selectedProjectId || !selectedDevId || !startDate || !endDate) {
      setErro('Preencha todos os campos.');
      return;
    }
    setErro(null);
    setEnviando(true);
    try {
      const allocation = await allocationsApi.create({
        projectId: selectedProjectId,
        developerId: selectedDevId,
        startDate,
        endDate,
      });
      onCreated(allocation);
      setSelectedProjectId(''); setSelectedDevId('');
      setStartDate(''); setEndDate('');
    } catch {
      setErro('Erro ao criar alocação.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-6">
      <h2 className="text-lg font-medium text-gray-700">Nova alocação</h2>

      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Selecione o projeto</p>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                selectedProjectId === p.id
                  ? 'border-fc-orange bg-fc-orange-light'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-sm font-medium text-gray-800">{p.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Selecione o developer</p>
        <div className="max-h-48 overflow-y-auto">
          <DeveloperList
            developers={developers}
            selectedId={selectedDevId}
            onSelect={(dev) => setSelectedDevId(dev.id)}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-xs text-gray-500 block mb-1">Data de início</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 block mb-1">Data de término</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <button onClick={handleCreate} disabled={enviando}
        className="bg-fc-orange text-white rounded-lg py-2 font-medium hover:bg-fc-orange-dark disabled:opacity-50">
        {enviando ? 'Alocando...' : 'Alocar developer'}
      </button>

      {erro && <p className="text-red-600 text-sm">{erro}</p>}
    </div>
  );
}