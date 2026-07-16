import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setErro(null);
    setEnviando(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setErro('E-mail ou senha inválidos');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-fc-orange rounded-lg" />
            <span className="text-xl font-semibold text-fc-navy">Alocação</span>
          </div>
          <p className="text-sm text-gray-400">Plataforma de alocação de developers</p>
        </div>

        {/* card */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 flex flex-col gap-4">
          <h1 className="text-lg font-semibold text-gray-800">Entrar</h1>

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fc-orange"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fc-orange"
          />

          <button
            onClick={handleSubmit}
            disabled={enviando}
            className="bg-fc-orange text-white rounded-lg py-2 font-medium hover:bg-fc-orange-dark disabled:opacity-50 transition-colors"
          >
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>

          {erro && <p className="text-red-600 text-sm">{erro}</p>}
        </div>

      </div>
    </div>
  );
}