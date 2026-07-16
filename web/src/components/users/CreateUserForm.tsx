import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../api/users.api';
import type { Role } from '../../types';

export function CreateUserForm() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleAlvo, setRoleAlvo] = useState<Role>('DEVELOPER');
  const [msg, setMsg] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const rolesDisponiveis: Role[] =
    user?.role === 'ADMIN' ? ['DEVELOPER', 'MANAGER', 'ADMIN'] : ['DEVELOPER'];

  const handleCreate = async () => {
    setMsg(null);
    setErro(null);
    setEnviando(true);
    try {
      const criado = await usersApi.create(roleAlvo, { name, email, password });
      setMsg(`${criado.name} criado como ${criado.role}`);
      setName(''); setEmail(''); setPassword('');
    } catch (e: any) {
      const status = e.response?.status;
      if (status === 403) setErro('Sem permissão.');
      else if (status === 409) setErro('E-mail já cadastrado.');
      else setErro('Erro ao criar usuário.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4">
      <h2 className="text-lg font-medium text-gray-700">Criar usuário</h2>
      <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fc-orange" />
      <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fc-orange" />
      <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fc-orange" />
      <select value={roleAlvo} onChange={(e) => setRoleAlvo(e.target.value as Role)}
        className="border border-gray-300 rounded-lg px-3 py-2">
        {rolesDisponiveis.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <button onClick={handleCreate} disabled={enviando}
        className="bg-fc-orange text-white rounded-lg py-2 font-medium hover:bg-fc-orange-dark disabled:opacity-50">
        {enviando ? 'Criando...' : 'Criar usuário'}
      </button>
      {msg && <p className="text-green-600 text-sm">{msg}</p>}
      {erro && <p className="text-red-600 text-sm">{erro}</p>}
    </div>
  );
}