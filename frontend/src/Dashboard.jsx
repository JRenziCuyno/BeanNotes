{/*Ako gi refactor ang code kung makabantay mo naa nay two new folders ang hooks ang utils sa hooks naa diha atong useBlockchain og useNotes
// useBlockcahin = naa diri tanan transaction logic ayaw  kung ang error naa diha na file ayaw namo panghilabot sa laing file 
// useNotes = naa diri tanan axios calls  nya mga local og  state management  PLEASE DI MAGPATAKA OG PUSH NYA BASAHA SA UNA ANG ERROR
// utils = naa diri ang mga cheche bureche sa atong app mga helper functions rana ayaw rasad na pasagdi kay mga anik-anik ra ang sulod diha 
// 
// FINALLY ANG DASHBOARD.JSX NATO MAO NI ATO MAIN COMPONENT DIRI GI HANDLE ANG MGA UI NYA MGA LOGIC OG STATE MANAGEMENT DI MAG PATAKA OG PUSH PLEASE 
*/}

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Save, X, FileText } from 'lucide-react';
import { CardanoWallet } from '@meshsdk/react';
import logo from './assets/logo.png';
import { useBlockchain } from './hooks/useBlockchain';
import { useNotes } from './hooks/useNotes';
import { getPalette, getRandomQuote, formatDate, PURPOSES } from './utils/statics';

const BeanNotes = () => {
  // 1. Setup Blockchain
  const { blockChainStatus, syncBlockChain } = useBlockchain();

  // 2. Setup Data (Pass sync function to notes)
  const { notes, createNote, updateNote, deleteNote, isSaving } = useNotes(syncBlockChain);

  // 3. UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', purpose: 'personal' });
  const [dailyQuote, setDailyQuote] = useState('');

  useEffect(() => {
    setDailyQuote(getRandomQuote());
  }, []);

  // 4. UI Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '', purpose: 'personal' });
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title || '', content: note.content || '', purpose: note.purpose || 'personal' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setFormData({ title: '', content: '', purpose: 'personal' });
  };

  const handleSave = async () => {
    if (isSaving) return;
    let success = false;
    
    if (editingNote) {
      success = await updateNote(editingNote, formData);
    } else {
      success = await createNote(formData);
    }

    if (success) closeModal();
  };

  // Filter Logic (View logic)
  const filteredNotes = notes.filter(note => {
    const matchesSearch = (note.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPurpose = selectedPurpose === 'all' ? true : note.purpose === selectedPurpose;
    return matchesSearch && matchesPurpose;
  });

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)' }}>
      
      {/* Header */}
      <header className="max-w-6xl mx-auto rounded-xl p-4 mb-6 shadow-2xl" style={{ background: 'linear-gradient(90deg, #FFD6EA 0%, #D6FFF8 100%)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))' }}>
              <img src={logo} alt="BeanNotes Logo" className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold" style={{ color: '#3B0D3A' }}>BeanNotes</h1>
              <p className="text-sm mt-1 opacity-90" style={{ color: '#2D334A' }}>{dailyQuote}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="z-10"> 
                  <CardanoWallet isDark={false} /> 
            </div> 
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-80" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full w-64 shadow-md focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)' }}
              />
            </div>

            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-full font-semibold shadow-lg transform hover:-translate-y-1 transition-all flex items-center space-x-2"
              style={{ background: 'linear-gradient(90deg,#FFAFBD 0%,#FFC3A0 100%)', color: '#3B0836' }}
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          </div>
        </div>
        
        {/* Blockchain Status Message */}
        {blockChainStatus && (
           <div className="mt-2 text-xs font-mono p-1 rounded text-center bg-white/50 text-purple-900">
             ⚡ {blockChainStatus}
           </div>
        )}

        {/* Purpose Filters */}
        <div className="mt-4 flex items-center gap-3">
          {PURPOSES.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPurpose(p)}
              className={`px-3 py-1 rounded-full font-medium shadow-sm transition-transform ${selectedPurpose === p ? 'scale-105' : ''}`}
              style={{
                background: selectedPurpose === p ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
                color: '#2D334A',
                border: selectedPurpose === p ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(0,0,0,0.03)'
              }}
            >
              {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-12 rounded-xl shadow-lg" style={{ background: 'linear-gradient(180deg,#FFF6F0,#F0FFF8)' }}>
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">{searchTerm ? 'No notes found' : 'No notes yet'}</h3>
            {!searchTerm && (
              <button onClick={openCreateModal} className="px-6 py-3 rounded-full font-semibold shadow-md" style={{ background: 'linear-gradient(90deg,#FDE68A,#FB923C)', color: '#2F2F2F' }}>Create First Note</button>
            )}
          </div>
        ) : (
          filteredNotes.map(note => {
            const palette = getPalette(note.colorIndex);
            return (
              <article
                key={note.id ?? `${note.title}-${Math.random()}`}
                className="rounded-2xl p-6 shadow-2xl transform hover:-translate-y-2 transition-all relative overflow-hidden"
                style={{ backgroundImage: `linear-gradient(135deg, ${palette.from}, ${palette.to})`, color: palette.text }}
              >
                <div className="absolute -top-6 -right-10 w-40 h-40 opacity-20 rounded-full" style={{ background: palette.to, pointerEvents: 'none', zIndex: 0 }} />
                <div className="flex justify-between items-start mb-3">
                  <div className="max-w-[70%]">
                    <h3 className="text-lg font-bold leading-tight">{note.title}</h3>
                    <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.25)', color: palette.text }}>
                      {note.purpose ? note.purpose.charAt(0).toUpperCase() + note.purpose.slice(1) : 'General'}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => openEditModal(note)} style={{ color: palette.text, position: 'relative', zIndex: 10 }}>
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteNote(note.id)} style={{ color: palette.text, position: 'relative', zIndex: 10 }}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm mb-4 opacity-95" style={{ color: palette.text }}>{note.content || 'No content'}</p>
                <div className="text-xs opacity-90 mt-4" style={{ color: palette.text }}>
                  <p>Created: {formatDate(note.createdAt)}</p>
                  {note.updatedAt !== note.createdAt && <p>Updated: {formatDate(note.updatedAt)}</p>}
                </div>
              </article>
            );
          })
        )}
      </main>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.85))' }}>
            <div className="flex items-center justify-between p-5" style={{ background: editingNote ? `linear-gradient(90deg, ${getPalette(editingNote.colorIndex).from}, ${getPalette(editingNote.colorIndex).to})` : 'linear-gradient(90deg,#FFDAB9,#E6E6FA)' }}>
              <h2 className="text-xl font-bold" style={{ color: editingNote ? getPalette(editingNote.colorIndex).text : '#3B0D3A' }}>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
              <button onClick={closeModal}><X className="w-6 h-6" /></button>
            </div>

            <div className="p-6">
              <div className="mb-5">
                <label className="block font-medium mb-2">Title</label>
                <input name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl focus:outline-none shadow-inner" placeholder="Enter note title..." />
              </div>

              <div className="mb-5">
                <label className="block font-medium mb-2">Content</label>
                <textarea name="content" value={formData.content} onChange={handleInputChange} rows={8} className="w-full px-4 py-3 rounded-xl focus:outline-none shadow-inner resize-vertical" placeholder="Write your note content here..." />
              </div>

              <div className="mb-5">
                <label className="block font-medium mb-2">Purpose</label>
                <select name="purpose" value={formData.purpose} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl focus:outline-none shadow-inner">
                  <option value="personal">Personal</option>
                  <option value="school">School</option>
                  <option value="home">Home</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button onClick={closeModal} className="px-4 py-2 rounded-full font-medium shadow" style={{ background: 'rgba(0,0,0,0.06)' }}>Cancel</button>
                <button onClick={handleSave} disabled={!formData.title.trim() || isSaving} className="px-4 py-2 rounded-full font-bold shadow transform hover:scale-105" style={{ background: 'linear-gradient(90deg,#A78BFA,#F472B6)', color: '#fff', opacity: (!formData.title.trim() || isSaving) ? 0.6 : 1 }}>
                  <Save className="w-4 h-4 inline-block mr-2" />
                  {isSaving ? 'Saving...' : (editingNote ? 'Update' : 'Save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeanNotes;