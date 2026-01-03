
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AnimalsList from './pages/AnimalsList';
import AnimalDetails from './pages/AnimalDetails';
import AnimalForm from './pages/AnimalForm';
import OwnersList from './pages/OwnersList';
import Finance from './pages/Finance';
import Inventory from './pages/Inventory';
import { db } from './db';
import { User } from './types';
import { LogIn, UserPlus, Dog } from 'lucide-react';

const LoginPage: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: 'u1',
      name: 'Dr. Ricardo Almeida',
      email: email || 'contato@vetmaster.com',
      clinicName: 'Clínica Saúde Animal'
    };
    db.saveUser(mockUser);
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <div className="hidden md:flex flex-1 bg-emerald-600 text-white p-12 flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <Dog className="w-[500px] h-[500px] -rotate-12 absolute -top-20 -left-20" />
        </div>
        <div className="max-w-md relative z-10">
          <h1 className="text-5xl font-black mb-6">VetMaster Pro</h1>
          <p className="text-xl text-emerald-50 leading-relaxed mb-8">
            A gestão definitiva para veterinários que buscam excelência no campo e na clínica.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-emerald-700/50 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="p-2 bg-emerald-500 rounded-lg"><Dog size={24} /></div>
              <p className="font-semibold">Histórico Clínico Completo</p>
            </div>
            <div className="flex items-center gap-4 bg-emerald-700/50 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="p-2 bg-emerald-500 rounded-lg"><LogIn size={24} /></div>
              <p className="font-semibold">Controle Financeiro & Estoque</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex flex-col items-center mb-10 text-emerald-600">
            <Dog size={64} />
            <h1 className="text-3xl font-black">VetMaster</h1>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Bem-vindo de volta!</h2>
          <p className="text-slate-500 mb-8">Acesse sua conta para gerenciar seus pacientes.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">E-mail</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="exemplo@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Senha</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
            >
              Entrar
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4 text-center">
            <p className="text-sm text-slate-500">Esqueceu sua senha?</p>
            <button className="text-emerald-600 font-bold hover:underline flex items-center justify-center gap-2">
              <UserPlus size={18} />
              Criar conta de veterinário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(db.getUser());

  const handleLogout = () => {
    db.saveUser(null);
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/animals" element={<AnimalsList />} />
          <Route path="/animals/new" element={<AnimalForm />} />
          <Route path="/animals/:id" element={<AnimalDetails />} />
          <Route path="/owners" element={<OwnersList />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
