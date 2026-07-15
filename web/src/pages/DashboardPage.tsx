import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/users.api';
import type { Role } from '../types';

export function DashboardPage() {
  const { user, logout } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState<Role>('DEVELOPER');
  const [msg, setMsg] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const handleCreate = async () => {
    setMsg(null);
    setErro(null);
    try {
      const criado = await usersApi.create(targetRole, { name, email, password });
      setMsg(`Usuário ${criado.name} criado como ${criado.role}`);
      setName('');
      setEmail('');
      setPassword('');
    } catch (e: any) {
      const status = e.response?.status;
      if (status === 403) setErro('Você não tem permissão para criar este tipo de usuário.');
      else if (status === 409) setErro('Este e-mail já está cadastrado.');
      else setErro('Erro ao criar usuário.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Painel — {user?.role}
          </h1>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sair
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-medium text-gray-700">Criar usuário</h2>

          <input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />

          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value as Role)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="DEVELOPER">Developer</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700"
          >
            Criar
          </button>

          {msg && <p className="text-green-600 text-sm">{msg}</p>}
          {erro && <p className="text-red-600 text-sm">{erro}</p>}
        </div>
      </div>
    </div>
  );
}