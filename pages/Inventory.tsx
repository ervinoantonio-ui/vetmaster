
import React, { useState } from 'react';
import { db } from '../db';
import { Package, Plus, AlertTriangle, ArrowDown, ArrowUp, Calendar, Trash2, X, Save } from 'lucide-react';
import { InventoryItem } from '../types';

const Inventory: React.FC = () => {
  const [items, setItems] = useState(db.getInventory());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'Medicamento',
    quantity: 0,
    unit: 'unidade' as InventoryItem['unit'],
    expiryDate: new Date().toISOString().split('T')[0],
    minStock: 5
  });

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: InventoryItem = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9)
    };
    const updated = [...items, item];
    db.saveInventory(updated);
    setItems(updated);
    setShowAddModal(false);
    setNewItem({
      name: '',
      type: 'Medicamento',
      quantity: 0,
      unit: 'unidade',
      expiryDate: new Date().toISOString().split('T')[0],
      minStock: 5
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este item do estoque?')) {
      const updated = items.filter(i => i.id !== id);
      db.saveInventory(updated);
      setItems(updated);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Estoque</h2>
          <p className="text-slate-500">Gestão de medicamentos e insumos.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-200"
        >
          <Plus size={20} />
          Novo Item
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isLowStock = item.quantity <= item.minStock;
          const isExpired = new Date(item.expiryDate) < new Date();

          return (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${isLowStock ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
                  <Package size={24} />
                </div>
                <div className="flex gap-2">
                  {isLowStock && <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Estoque Baixo</span>}
                  {isExpired && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Expirado</span>}
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{item.type}</p>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Quantidade</label>
                  <p className={`text-lg font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                    {item.quantity} {item.unit}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Validade</label>
                  <p className={`text-sm font-semibold flex items-center gap-1 ${isExpired ? 'text-amber-600' : 'text-slate-700'}`}>
                    <Calendar size={14} /> {new Date(item.expiryDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1">
                  <ArrowUp size={14} /> Entrada
                </button>
                <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1">
                  <ArrowDown size={14} /> Saída
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Cadastrar Novo Item no Estoque</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveItem} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nome do Medicamento/Insumo</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Ex: Vacina Contra Raiva"
                    value={newItem.name}
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tipo</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Ex: Vacina, Antibiótico, Insumo..."
                    value={newItem.type}
                    onChange={e => setNewItem({...newItem, type: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Qtd. Inicial</label>
                    <input 
                      type="number" 
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      value={newItem.quantity}
                      onChange={e => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Unidade</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      value={newItem.unit}
                      onChange={e => setNewItem({...newItem, unit: e.target.value as any})}
                    >
                      <option value="unidade">Unidade</option>
                      <option value="ml">ml</option>
                      <option value="mg">mg</option>
                      <option value="dose">Dose</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Data de Validade</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      value={newItem.expiryDate}
                      onChange={e => setNewItem({...newItem, expiryDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Estoque Mínimo (Alerta)</label>
                    <input 
                      type="number" 
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      value={newItem.minStock}
                      onChange={e => setNewItem({...newItem, minStock: parseInt(e.target.value) || 0})}
                    />
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
                  className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
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

export default Inventory;
