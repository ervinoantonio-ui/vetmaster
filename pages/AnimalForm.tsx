
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../db';
import { Species, Category, Animal } from '../types';
import { ArrowLeft, Save, Dog, Info } from 'lucide-react';

const AnimalForm: React.FC = () => {
  const navigate = useNavigate();
  const owners = db.getOwners();

  const [formData, setFormData] = useState({
    internalId: '',
    name: '',
    species: Species.BOVINE,
    category: Category.LARGE,
    breed: '',
    sex: 'M' as 'M' | 'F',
    birthDate: '',
    ownerId: owners[0]?.id || '',
    farmName: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const animals = db.getAnimals();
    const newAnimal: Animal = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    db.saveAnimals([...animals, newAnimal]);
    navigate('/animals');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom duration-500">
      <Link to="/animals" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
        <ArrowLeft size={20} />
        Voltar
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
              <Dog size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Cadastrar Novo Animal</h2>
              <p className="text-sm text-slate-500">Preencha os dados básicos para iniciar o acompanhamento.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Número de Identificação (ID)</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                placeholder="Ex: 1024"
                value={formData.internalId}
                onChange={e => setFormData({...formData, internalId: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nome (Opcional)</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                placeholder="Ex: Mimosa"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Espécie</label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                value={formData.species}
                onChange={e => setFormData({...formData, species: e.target.value as Species})}
              >
                {Object.values(Species).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Categoria</label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
              >
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Raça</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                placeholder="Ex: Nelore"
                value={formData.breed}
                onChange={e => setFormData({...formData, breed: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Sexo</label>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, sex: 'M'})}
                  className={`flex-1 py-2.5 rounded-xl font-bold border transition-all ${formData.sex === 'M' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  Macho
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, sex: 'F'})}
                  className={`flex-1 py-2.5 rounded-xl font-bold border transition-all ${formData.sex === 'F' ? 'bg-pink-600 text-white border-pink-600 shadow-md' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  Fêmea
                </button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Info size={18} className="text-emerald-500" />
                Vínculo de Propriedade
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Proprietário</label>
                  <select 
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    value={formData.ownerId}
                    onChange={e => setFormData({...formData, ownerId: e.target.value})}
                  >
                    {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Fazenda / Localidade</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Ex: Fazenda Bela Vista"
                    value={formData.farmName}
                    onChange={e => setFormData({...formData, farmName: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Observações Gerais</label>
              <textarea 
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                placeholder="Informações adicionais relevantes..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/animals')}
              className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
            >
              <Save size={20} />
              Salvar Animal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnimalForm;
