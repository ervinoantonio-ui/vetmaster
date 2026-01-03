
import React, { useState, useMemo } from 'react';
import { db } from '../db';
import { CircleDollarSign, Plus, Search, Filter, Calendar, CheckCircle2, Clock, ArrowUpRight, TrendingUp, X, Save } from 'lucide-react';
import { Transaction } from '../types';

const Finance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [finance, setFinance] = useState(db.getFinance());
  const owners = db.getOwners();

  // Form State
  const [newTx, setNewTx] = useState({
    ownerId: owners[0]?.id || '',
    serviceName: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Pix',
    status: 'PENDING' as 'PAID' | 'PENDING'
  });

  const filteredFinance = useMemo(() => {
    return finance.filter(f => {
      const owner = owners.find(o => o.id === f.ownerId);
      return (
        f.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [finance, owners, searchTerm]);

  const stats = useMemo(() => {
    const total = finance.reduce((acc, curr) => acc + curr.amount, 0);
    const paid = finance.filter(f => f.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
    const pending = finance.filter(f => f.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);
    return { total, paid, pending };
  }, [finance]);

  const handleSaveTx = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9)
    };
    const updated = [...finance, transaction];
    db.saveFinance(updated);
    setFinance(updated);
    setShowAddModal(false);
    setNewTx({
      ownerId: owners[0]?.id || '',
      serviceName: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Pix',
      status: 'PENDING'
    });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Financeiro</h2>
          <p className="text-slate-500">Acompanhe pagamentos e histórico de serviços.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all hover:bg-slate-800"
        >
          <Plus size={20} />
          Novo Lançamento
        </button>
      </header>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 text-sm font-medium">Total Geral</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">R$ {stats.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-emerald-700 text-sm font-medium">Recebido</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-900">R$ {stats.paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-amber-700 text-sm font-medium">Pendente</span>
            <Clock size={16} className="text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-900">R$ {stats.pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por serviço ou cliente..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-400 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-all">
            <Filter size={18} />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Serviço / Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFinance.length > 0 ? filteredFinance.map((tx) => {
                const owner = owners.find(o => o.id === tx.ownerId);
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{tx.serviceName}</p>
                      <p className="text-xs text-slate-500">{owner?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 flex items-center gap-1">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(tx.date).toLocaleDateString('pt-BR')}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-slate-900">R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{tx.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${tx.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {tx.status === 'PAID' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <CircleDollarSign size={48} />
                      <p className="font-medium">Nenhum lançamento encontrado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Novo Lançamento Financeiro</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveTx} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Cliente / Proprietário</label>
                  <select 
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    value={newTx.ownerId}
                    onChange={e => setNewTx({...newTx, ownerId: e.target.value})}
                  >
                    {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Serviço Realizado</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Ex: Consulta Domiciliar"
                    value={newTx.serviceName}
                    onChange={e => setNewTx({...newTx, serviceName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Valor (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      placeholder="0,00"
                      value={newTx.amount}
                      onChange={e => setNewTx({...newTx, amount: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Data</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      value={newTx.date}
                      onChange={e => setNewTx({...newTx, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Forma de Pagamento</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      value={newTx.paymentMethod}
                      onChange={e => setNewTx({...newTx, paymentMethod: e.target.value})}
                    >
                      <option value="Pix">Pix</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Cartão de Débito">Cartão de Débito</option>
                      <option value="Transferência">Transferência</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Status</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      value={newTx.status}
                      onChange={e => setNewTx({...newTx, status: e.target.value as any})}
                    >
                      <option value="PENDING">Pendente</option>
                      <option value="PAID">Pago</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex items-center gap-2 bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all"
                >
                  <Save size={20} />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
