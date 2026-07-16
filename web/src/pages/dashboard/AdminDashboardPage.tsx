import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { projectsApi } from '../../api/projects.api';
import { allocationsApi } from '../../api/allocations.api';
import { usersApi } from '../../api/users.api';
import { CreateUserForm } from '../../components/users/CreateUserForm';
import { CreateProjectForm } from '../../components/projects/CreateProjectForm';
import { ProjectList } from '../../components/projects/ProjectList';
import { CreateAllocationForm } from '../../components/allocations/CreateAllocationForm';
import { AllocationList } from '../../components/allocations/AllocationList';
import { DeveloperList } from '../../components/developers/DeveloperList';
import type { Project, Allocation, DeveloperListItem } from '../../types';

type Aba = 'usuarios' | 'projetos' | 'alocacoes' | 'developers';

const ABAS: { key: Aba; label: string }[] = [
  { key: 'usuarios', label: 'Usuários' },
  { key: 'projetos', label: 'Projetos' },
  { key: 'alocacoes', label: 'Alocações' },
  { key: 'developers', label: 'Developers' },
];

export function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [aba, setAba] = useState<Aba>('usuarios');
  const [projects, setProjects] = useState<Project[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [developers, setDevelopers] = useState<DeveloperListItem[]>([]);

  useEffect(() => {
    projectsApi.list().then(setProjects).catch(() => {});
    allocationsApi.list().then(setAllocations).catch(() => {});
    usersApi.listDevelopers().then(setDevelopers).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <div className="bg-fc-navy border-b border-white/10 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-white">Alocação</h1>
          <p className="text-xs text-white/40">{user?.role}</p>
        </div>
        <button onClick={logout} className="text-sm text-white/60 hover:text-white">
          Sair
        </button>
      </div>

      {/* abas */}
      <div className="bg-fc-navy px-8 border-b border-white/10">
        <div className="flex gap-1">
          {ABAS.map((a) => (
            <button
              key={a.key}
              onClick={() => setAba(a.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                aba === a.key
                  ? 'border-fc-orange text-white'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* conteúdo */}
      <div className="p-8 max-w-2xl mx-auto">
        {aba === 'usuarios' && <CreateUserForm />}

        {aba === 'projetos' && (
          <>
            <CreateProjectForm onCreated={(p) => setProjects((prev) => [p, ...prev])} />
            <ProjectList projects={projects} />
          </>
        )}

        {aba === 'alocacoes' && (
          <>
            <CreateAllocationForm onCreated={(a) => setAllocations((prev) => [a, ...prev])} />
            <AllocationList allocations={allocations} projects={projects} developers={developers} />
          </>
        )}

        {aba === 'developers' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Developers cadastrados</h2>
            <DeveloperList developers={developers} />
          </div>
        )}
      </div>
    </div>
  );
}