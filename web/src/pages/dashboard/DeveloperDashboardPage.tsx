import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { developersApi } from '../../api/developers.api';
import { allocationsApi } from '../../api/allocations.api';
import type { DeveloperProfile, Seniority, Skill, Allocation } from '../../types';
import { SENIORITY_OPTIONS } from '../../types';

type Aba = 'perfil' | 'alocacoes';

interface Props {
  profile: DeveloperProfile | null;
  onProfileSaved: (profile: DeveloperProfile) => void;
}

function Stars({ level }: { level: number }) {
  return (
    <span className="text-yellow-400 text-sm tracking-wide">
      {'★'.repeat(level)}
      <span className="text-gray-300">{'★'.repeat(5 - level)}</span>
    </span>
  );
}

function initials(id: string) {
  return id.slice(0, 2).toUpperCase();
}

export function DeveloperDashboardPage({ profile, onProfileSaved }: Props) {
  const { user, logout } = useAuth();
  const [aba, setAba] = useState<Aba>('perfil');
  const [editando, setEditando] = useState(!profile);
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  const [seniority, setSeniority] = useState<Seniority>(profile?.seniority ?? 'JUNIOR');
  const [stackInput, setStackInput] = useState('');
  const [stack, setStack] = useState<string[]>(profile?.stack ?? []);
  const [skills, setSkills] = useState<Skill[]>(profile?.skills ?? []);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(3);
  const [msg, setMsg] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    allocationsApi.list()
      .then(setAllocations)
      .catch(() => setAllocations([]));
  }, []);

  const addStack = () => {
    if (!stackInput.trim()) return;
    setStack((prev) => [...prev, stackInput.trim()]);
    setStackInput('');
  };

  const removeStack = (i: number) => setStack((prev) => prev.filter((_, idx) => idx !== i));

  const addSkill = () => {
    if (!skillName.trim()) return;
    setSkills((prev) => [...prev, { name: skillName.trim(), level: skillLevel }]);
    setSkillName('');
    setSkillLevel(3);
  };

  const removeSkill = (i: number) => setSkills((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setMsg(null);
    setErro(null);
    setEnviando(true);
    try {
      const dados = {
        seniority,
        stack,
        skills: skills.map(({ name, level }) => ({ name, level })),
      };
      const saved = profile
        ? await developersApi.updateProfile(dados)
        : await developersApi.createProfile(dados);
      onProfileSaved(saved);
      setMsg('Perfil salvo!');
      setEditando(false);
    } catch {
      setErro('Erro ao salvar perfil.');
    } finally {
      setEnviando(false);
    }
  };

  const nomeUsuario = user?.id ?? 'Developer';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <div className="bg-fc-navy border-b border-white/10 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-white">Alocação</h1>
          <p className="text-xs text-white/40">DEVELOPER</p>
        </div>
        <button onClick={logout} className="text-sm text-white/60 hover:text-white">
          Sair
        </button>
      </div>

      {/* abas */}
      <div className="bg-fc-navy px-8 border-b border-white/10">
        <div className="flex gap-1">
          {(['perfil', 'alocacoes'] as Aba[]).map((a) => (
            <button
              key={a}
              onClick={() => setAba(a)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                aba === a
                  ? 'border-fc-orange text-white'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              {a === 'perfil' ? 'Meu Perfil' : 'Alocações'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-lg mx-auto">
        {aba === 'perfil' && (
          <>
            {!profile && !editando && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800 text-sm mb-4">
                Você ainda não tem perfil técnico. Preencha para aparecer nas alocações.
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-fc-orange-light flex items-center justify-center text-fc-orange font-medium text-sm">
                    {initials(nomeUsuario)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{nomeUsuario}</p>
                    <p className="text-xs text-gray-400">Developer</p>
                  </div>
                </div>
                {!editando && profile && (
                  <button
                    onClick={() => setEditando(true)}
                    className="text-sm text-fc-orange border border-fc-orange-light rounded-lg px-3 py-1 hover:bg-fc-orange-light"
                  >
                    Editar
                  </button>
                )}
              </div>

              {!editando && profile && (
                <>
                  <span className="inline-block bg-fc-orange-light text-fc-orange-dark text-xs font-medium px-3 py-1 rounded-full w-fit">
                    {profile.seniority}
                  </span>

                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.stack.map((s) => (
                        <span key={s} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Skills</p>
                    <div className="flex flex-col divide-y divide-gray-100">
                      {profile.skills.map((s, i) => (
                        <div key={i} className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-700">{s.name}</span>
                          <Stars level={s.level} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    <span className="text-xs text-gray-500">Disponível para alocação</span>
                  </div>
                </>
              )}

              {editando && (
                <>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Senioridade</label>
                    <select value={seniority} onChange={(e) => setSeniority(e.target.value as Seniority)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      {SENIORITY_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Stack</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {stack.map((s, i) => (
                        <span key={i} className="flex items-center gap-1 bg-fc-orange-light text-fc-orange-dark text-xs px-3 py-1 rounded-full">
                          {s}
                          <button onClick={() => removeStack(i)} className="hover:opacity-70">×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input placeholder="Adicionar tecnologia" value={stackInput}
                        onChange={(e) => setStackInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addStack()}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      <button onClick={addStack} className="border border-gray-300 rounded-lg px-3 hover:bg-gray-50 text-sm">+</button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Skills</label>
                    <div className="flex flex-col gap-2 mb-2">
                      {skills.map((s, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input value={s.name}
                            onChange={(e) => { const u = [...skills]; u[i] = { ...u[i], name: e.target.value }; setSkills(u); }}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                          <select value={s.level}
                            onChange={(e) => { const u = [...skills]; u[i] = { ...u[i], level: Number(e.target.value) }; setSkills(u); }}
                            className="border border-gray-300 rounded-lg px-2 py-2 text-sm w-16">
                            {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
                          </select>
                          <button onClick={() => removeSkill(i)} className="text-gray-400 hover:text-gray-700 text-sm">×</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input placeholder="Nome da skill" value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      <select value={skillLevel}
                        onChange={(e) => setSkillLevel(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-2 py-2 text-sm w-16">
                        {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <button onClick={addSkill} className="border border-gray-300 rounded-lg px-3 hover:bg-gray-50 text-sm">+</button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={handleSave} disabled={enviando}
                      className="flex-1 bg-fc-orange text-white rounded-lg py-2 text-sm font-medium hover:bg-fc-orange-dark disabled:opacity-50">
                      {enviando ? 'Salvando...' : 'Salvar'}
                    </button>
                    {profile && (
                      <button onClick={() => { setEditando(false); setMsg(null); setErro(null); }}
                        className="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50">
                        Cancelar
                      </button>
                    )}
                  </div>

                  {msg && <p className="text-green-600 text-sm">{msg}</p>}
                  {erro && <p className="text-red-600 text-sm">{erro}</p>}
                </>
              )}
            </div>
          </>
        )}

        {aba === 'alocacoes' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Minhas alocações</h2>
            {allocations.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Nenhuma alocação ainda.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {allocations.map((a) => (
                  <div key={a.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Projeto</p>
                        <p className="text-xs text-gray-400 font-mono">{a.projectId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{String(a.startDate).slice(0, 10)}</p>
                        <p className="text-xs text-gray-400">{String(a.endDate).slice(0, 10)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}