
import React, { useState } from 'react';
import { db } from '../db';
import { Users, Plus, Search, Phone, Mail, MapPin, ChevronRight } from 'lucide-react';

const OwnersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const owners = db.getOwners();
  const animals = db.getAnimals();

  const filteredOwners = owners.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.farmName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Proprietários</h2>
          <p className="text-slate-500">Gestão da base de clientes e produtores.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all">
          <Plus size={20} />
          Novo Proprietário
        </button>
      </header>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou fazenda..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOwners.map((owner) => {
          const ownerAnimals = animals.filter(a => a.ownerId === owner.id);
          return (
            <div key={owner.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-emerald-200 transition-all">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 font-bold text-xl group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                      {owner.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{owner.name}</h3>
                      <p className="text-xs text-slate-500">Cliente desde {new Date(owner.createdAt).getFullYear()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    {owner.phone}
                  </div>
                  {owner.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail size={14} className="text-slate-400" />
                      {owner.email}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={14} className="text-slate-400" />
                    {owner.farmName || 'Sem fazenda vinculada'}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="text-xs font-bold text-slate-400 uppercase">
                    {ownerAnimals.length} Animais vinculados
                  </div>
                  <button className="text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1">
                    Ver Detalhes <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OwnersList;
