
import React, { useState, useMemo } from 'react';
import { db } from '../db';
// Added Dog to the imports from lucide-react
import { Search, Plus, Filter, MoreHorizontal, ChevronRight, Hash, User, MapPin, Dog } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnimalsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const animals = db.getAnimals();
  const owners = db.getOwners();

  const filteredAnimals = useMemo(() => {
    return animals.filter(animal => {
      const owner = owners.find(o => o.id === animal.ownerId);
      const searchStr = `${animal.internalId} ${animal.name || ''} ${owner?.name || ''} ${animal.farmName || ''}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    });
  }, [animals, owners, searchTerm]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Animais</h2>
          <p className="text-slate-500">Gerencie todos os pacientes e animais de campo.</p>
        </div>
        <Link 
          to="/animals/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all"
        >
          <Plus size={20} />
          Novo Registro
        </Link>
      </header>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por ID, Nome, Proprietário ou Fazenda..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-all">
          <Filter size={20} />
          Filtros
        </button>
      </div>

      {/* Table/Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID / Animal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Espécie/Raça</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Proprietário / Local</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAnimals.length > 0 ? filteredAnimals.map((animal) => {
                const owner = owners.find(o => o.id === animal.ownerId);
                return (
                  <tr key={animal.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                          {animal.internalId.slice(-2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{animal.name || 'Sem Nome'}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Hash size={12} /> {animal.internalId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">{animal.species}</p>
                      <p className="text-xs text-slate-500">{animal.breed}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <User size={14} className="text-slate-400" /> {owner?.name}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" /> {animal.farmName || owner?.farmName || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                        Ativo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/animals/${animal.id}`}
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        <ChevronRight size={20} />
                      </Link>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Dog size={48} className="text-slate-200" />
                      <p className="text-slate-400 font-medium">Nenhum animal encontrado.</p>
                      <Link to="/animals/new" className="text-emerald-600 font-bold hover:underline">
                        Cadastrar novo animal
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnimalsList;