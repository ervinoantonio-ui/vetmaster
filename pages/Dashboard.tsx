
import React, { useMemo } from 'react';
import { db } from '../db';
import { 
  Dog, 
  CircleDollarSign, 
  Package, 
  Syringe, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const animals = db.getAnimals();
  const owners = db.getOwners();
  const finance = db.getFinance();
  const inventory = db.getInventory();
  const history = db.getHistory();

  const stats = useMemo(() => {
    const totalAnimals = animals.length;
    const pendingPayments = finance.filter(f => f.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);
    const lowStockItems = inventory.filter(i => i.quantity <= i.minStock).length;
    const upcomingVaccines = history.filter(h => h.type === 'Vaccine' && h.nextDoseDate && new Date(h.nextDoseDate) > new Date()).length;

    return { totalAnimals, pendingPayments, lowStockItems, upcomingVaccines };
  }, [animals, finance, inventory, history]);

  const financialSummary = useMemo(() => {
    // Basic aggregation by month for the chart
    const data = [
      { name: 'Jan', value: 4000 },
      { name: 'Fev', value: 3000 },
      { name: 'Mar', value: 2000 },
      { name: 'Abr', value: 2780 },
      { name: 'Mai', value: 1890 },
      { name: 'Jun', value: 2390 },
    ];
    return data;
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Bem-vindo, Dr(a).</h2>
        <p className="text-slate-500">Confira o resumo das atividades da sua clínica hoje.</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Dog size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center">
              +12% <ArrowUpRight size={14} className="ml-1" />
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total de Animais</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalAnimals}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <CircleDollarSign size={24} />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full flex items-center">
              Pendente
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Pagamentos Pendentes</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">R$ {stats.pendingPayments.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Syringe size={24} />
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full flex items-center">
              Próximos
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Vacinas Agendadas</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.upcomingVaccines}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <Package size={24} />
            </div>
            {stats.lowStockItems > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-full animate-pulse">
                Crítico
              </span>
            )}
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Estoque Baixo</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.lowStockItems} itens</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-500" />
              Desempenho Financeiro
            </h3>
            <select className="bg-slate-100 border-none text-xs font-semibold rounded-lg px-3 py-2 outline-none">
              <option>Últimos 6 meses</option>
              <option>Último ano</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialSummary}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {financialSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === financialSummary.length - 1 ? '#10b981' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts / Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            Alertas de Atenção
          </h3>
          <div className="space-y-4">
            {stats.lowStockItems > 0 && (
              <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                <Package className="text-rose-600" size={20} />
                <div>
                  <p className="text-sm font-semibold text-rose-900">Itens em falta</p>
                  <p className="text-xs text-rose-600">Verifique o estoque de medicamentos.</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <Calendar className="text-blue-600" size={20} />
              <div>
                <p className="text-sm font-semibold text-blue-900">Vacinas de Amanhã</p>
                <p className="text-xs text-blue-600">3 animais agendados para reforço.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <CircleDollarSign className="text-slate-600" size={20} />
              <div>
                <p className="text-sm font-semibold text-slate-900">Faturamento Mensal</p>
                <p className="text-xs text-slate-500">Até agora: R$ 12.450,00</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors">
            Ver Todos os Alertas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
