
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../db';
import { getAIAssistance } from '../services/geminiService';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Syringe, 
  ClipboardList, 
  Pill, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Save
} from 'lucide-react';
import { MedicalRecord, Animal, Owner } from '../types';

const AnimalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [history, setHistory] = useState<MedicalRecord[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);

  // New Record Form State
  const [newRecord, setNewRecord] = useState({
    title: '',
    type: 'Note' as MedicalRecord['type'],
    description: '',
    date: new Date().toISOString().split('T')[0],
    nextDoseDate: '',
    lot: ''
  });

  useEffect(() => {
    if (id) {
      const foundAnimal = db.getAnimals().find(a => a.id === id);
      if (foundAnimal) {
        setAnimal(foundAnimal);
        setOwner(db.getOwners().find(o => o.id === foundAnimal.ownerId) || null);
        loadHistory();
      }
    }
  }, [id]);

  const loadHistory = () => {
    if (id) {
      setHistory(db.getHistory().filter(h => h.animalId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  const handleFetchAiInsight = async () => {
    if (!animal) return;
    setIsAiLoading(true);
    const insight = await getAIAssistance(animal, history);
    setAiInsight(insight || '');
    setIsAiLoading(false);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    const record: MedicalRecord = {
      ...newRecord,
      id: Math.random().toString(36).substr(2, 9),
      animalId: id
    };

    const currentHistory = db.getHistory();
    db.saveHistory([...currentHistory, record]);
    
    // If it was a vaccine, maybe update inventory? (Simulated logic)
    
    loadHistory();
    setShowAddRecord(false);
    setNewRecord({
      title: '',
      type: 'Note',
      description: '',
      date: new Date().toISOString().split('T')[0],
      nextDoseDate: '',
      lot: ''
    });
  };

  if (!animal) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <Link to="/animals" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
        <ArrowLeft size={20} />
        Voltar para a lista
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center font-bold text-3xl mb-4">
                {animal.name?.charAt(0) || '#'}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{animal.name || 'Sem Nome'}</h2>
              <p className="text-slate-500 font-medium">{animal.species} • {animal.breed}</p>
              <div className="mt-4 flex gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  {animal.internalId}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${animal.sex === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                  {animal.sex === 'M' ? 'Macho' : 'Fêmea'}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4 pt-6 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Proprietário</label>
                <p className="font-semibold text-slate-800">{owner?.name || 'Não informado'}</p>
                <p className="text-sm text-slate-500">{owner?.phone}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Fazenda / Local</label>
                <p className="font-semibold text-slate-800">{animal.farmName || owner?.farmName || 'N/A'}</p>
              </div>
              {animal.notes && (
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Observações</label>
                  <p className="text-sm text-slate-600 italic">{animal.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Insight Widget */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles size={80} />
            </div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 relative z-10">
              <Sparkles size={20} />
              Insight da IA
            </h3>
            <p className="text-indigo-100 text-sm mb-4 relative z-10">
              Analise o histórico para receber sugestões de saúde e alertas.
            </p>
            {aiInsight ? (
              <div className="bg-white/10 p-4 rounded-xl text-xs leading-relaxed relative z-10 border border-white/20">
                {aiInsight}
              </div>
            ) : (
              <button 
                onClick={handleFetchAiInsight}
                disabled={isAiLoading}
                className="w-full py-2.5 bg-white text-indigo-700 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors disabled:opacity-50 relative z-10"
              >
                {isAiLoading ? 'Analisando...' : 'Gerar Análise'}
              </button>
            )}
          </div>
        </div>

        {/* History Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">Histórico Veterinário</h3>
            <button 
              onClick={() => setShowAddRecord(!showAddRecord)}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
            >
              {showAddRecord ? <ChevronUp size={18} /> : <Plus size={18} />}
              {showAddRecord ? 'Cancelar' : 'Novo Registro'}
            </button>
          </div>

          {showAddRecord && (
             <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-lg animate-in slide-in-from-top duration-300">
               <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <ClipboardList className="text-emerald-500" size={18} />
                 Novo Registro Clínico
               </h4>
               <form onSubmit={handleSaveRecord} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Título / Procedimento</label>
                   <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                    placeholder="Ex: Vacinação Aftosa ou Consulta Geral"
                    value={newRecord.title}
                    onChange={e => setNewRecord({...newRecord, title: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tipo</label>
                   <select 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                    value={newRecord.type}
                    onChange={e => setNewRecord({...newRecord, type: e.target.value as any})}
                   >
                     <option value="Note">Nota/Observação</option>
                     <option value="Vaccine">Vacina</option>
                     <option value="Medication">Medicamento</option>
                     <option value="Procedure">Procedimento</option>
                     <option value="Diagnosis">Diagnóstico</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Data</label>
                   <input 
                    type="date" 
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                    value={newRecord.date}
                    onChange={e => setNewRecord({...newRecord, date: e.target.value})}
                   />
                 </div>
                 {newRecord.type === 'Vaccine' && (
                   <>
                     <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Lote</label>
                       <input 
                        type="text" 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                        placeholder="Ex: L12345"
                        value={newRecord.lot}
                        onChange={e => setNewRecord({...newRecord, lot: e.target.value})}
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Próxima Dose (Reforço)</label>
                       <input 
                        type="date" 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                        value={newRecord.nextDoseDate}
                        onChange={e => setNewRecord({...newRecord, nextDoseDate: e.target.value})}
                       />
                     </div>
                   </>
                 )}
                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descrição / Notas</label>
                   <textarea 
                    rows={2}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none"
                    placeholder="Descreva os detalhes do atendimento..."
                    value={newRecord.description}
                    onChange={e => setNewRecord({...newRecord, description: e.target.value})}
                   />
                 </div>
                 <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                    <button 
                      type="submit" 
                      className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-all"
                    >
                      <Save size={18} />
                      Salvar Registro
                    </button>
                 </div>
               </form>
             </div>
          )}

          <div className="space-y-4">
            {history.length > 0 ? history.map((record) => (
              <div key={record.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 hover:border-emerald-200 transition-colors">
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                  ${record.type === 'Vaccine' ? 'bg-purple-100 text-purple-600' : 
                    record.type === 'Medication' ? 'bg-blue-100 text-blue-600' :
                    record.type === 'Procedure' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-100 text-slate-600'}
                `}>
                  {record.type === 'Vaccine' && <Syringe size={24} />}
                  {record.type === 'Medication' && <Pill size={24} />}
                  {record.type === 'Procedure' && <ClipboardList size={24} />}
                  {record.type === 'Diagnosis' && <AlertCircle size={24} />}
                  {record.type === 'Note' && <ClipboardList size={24} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900">{record.title}</h4>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(record.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{record.description}</p>
                  
                  {record.nextDoseDate && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">
                      Reforço: {new Date(record.nextDoseDate).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {record.lot && <p className="mt-2 text-[10px] text-slate-400 font-mono">Lote: {record.lot}</p>}
                </div>
              </div>
            )) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <p className="text-slate-400">Nenhum registro encontrado para este animal.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetails;
