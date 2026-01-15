import React, { useState } from 'react';
import API_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.username);
        toast.success(`Bem-vindo, ${data.username}!`);
        onSuccess();
      } else {
        toast.error(data.message || 'Erro ao fazer login');
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white">
             <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>
          <h2 className="text-2xl font-black text-navy-blue">Acesso Restrito</h2>
          <p className="text-gray-500 text-sm mt-1">Entre para gerenciar o site</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Usuário</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-navy-blue outline-none"
                    placeholder="admin"
                    autoFocus
                />
            </div>
            
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Senha</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-navy-blue outline-none"
                    placeholder="••••••"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-navy-blue text-white py-3 rounded-xl font-bold hover:bg-navy-light transition-colors disabled:opacity-50"
            >
                {loading ? 'Verificando...' : 'Entrar no Painel'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
