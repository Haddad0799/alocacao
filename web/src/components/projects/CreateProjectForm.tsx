import { useState } from 'react';
import { projectsApi } from '../../api/projects.api';
import type { Project } from '../../types';

interface Props {
  onCreated: (project: Project) => void;
}

export function CreateProjectForm({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setErro(null);
    setEnviando(true);
    try {
      const project = await projectsApi.create({ name, description });
      onCreated(project);
      setName(''); setDescription('');
    } catch {
      setErro('Erro ao criar projeto.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4">
      <h2 className="text-lg font-medium text-gray-700">Criar projeto</h2>
      <input placeholder="Nome do projeto" value={name} onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fc-orange" />
      <textarea placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)}
        rows={3} className="border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-fc-orange" />
      <button onClick={handleCreate} disabled={enviando}
        className="bg-fc-orange text-white rounded-lg py-2 font-medium hover:bg-fc-orange-dark disabled:opacity-50">
        {enviando ? 'Criando...' : 'Criar projeto'}
      </button>
      {erro && <p className="text-red-600 text-sm">{erro}</p>}
    </div>
  );
}