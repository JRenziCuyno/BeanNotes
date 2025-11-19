/* replace your current BeanNotes component with this file (only tiny style changes) */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit3, Trash2, Save, X, FileText } from 'lucide-react';
import logo from './assets/logo.png';
import DonateButton from './components/DonateButton';

const API_BASE = 'http://localhost:5000';
const API_URL = '/notes';

const pastelPalettes = [
  { from: '#FFDFD3', to: '#FFC1E3', text: '#1F2937' },
  { from: '#D8FFF2', to: '#BFF1E1', text: '#064E3B' },
  { from: '#EAD7FF', to: '#D6BEEB', text: '#3C1361' },
  { from: '#DFF6FF', to: '#C8E6FF', text: '#083344' },
  { from: '#FFF7D9', to: '#FFE6A7', text: '#4A2F00' },
  { from: '#FFEFE6', to: '#FFD3C4', text: '#4B1A00' },
  { from: '#E6FFF2', to: '#CFFFE0', text: '#004D40' },
  { from: '#FFEAF6', to: '#FFD9F0', text: '#2C0F1E' }
];

const getPalette = (index = 0) => pastelPalettes[index % pastelPalettes.length];
const PURPOSES = ['all', 'school', 'personal', 'home'];

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 7000
});

const BeanNotes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', purpose: 'personal' });
  const [dailyQuote, setDailyQuote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
    setDailyQuote(getRandomQuote());
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get(API_URL);
      setNotes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching notes:', err?.response?.data ?? err.message);
    }
  };

  const createNote = async () => {
    if (!formData.title.trim()) return;
    setIsSaving(true);
    const newNote = {
      title: formData.title,
      content: formData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      colorIndex: Math.floor(Math.random() * pastelPalettes.length),
      purpose: formData.purpose
    };
    try {
      const res = await api.post(API_URL, newNote);
      if (res?.data) setNotes(prev => [res.data, ...prev]);
      else await fetchNotes();
      closeModal();
    } catch (err) {
      console.error('Error creating note:', err?.response?.data ?? err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateNote = async () => {
    if (!formData.title.trim() || !editingNote) return;
    setIsSaving(true);
    const payload = {
      ...editingNote,
      title: formData.title,
      content: formData.content,
      purpose: formData.purpose,
      updatedAt: new Date().toISOString()
    };
    try {
      const res = await api.put(`${API_URL}/${editingNote.id}`, payload);
      if (res?.data && res.data.id !== undefined) {
        setNotes(prev => prev.map(n => (n.id === res.data.id ? res.data : n)));
      } else {
        await fetchNotes();
      }
      closeModal();
    } catch (err) {
      console.error('Error updating note:', err?.response?.data ?? err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`${API_URL}/${id}`);
      await fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err?.response?.data ?? err.message);
    }
  };

  const handleSave = () => {
    if (isSaving) return;
    editingNote ? updateNote() : createNote();
  };

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
    setIsSaving(false);
  };

  const getRandomQuote = () => {
    const quotes = [
    'Productivity is never an accident. It is always the result of a commitment to excellence.',
    'The way to get started is to quit talking and begin doing.',
    'Innovation distinguishes between a leader and a follower.',
    "Your limitation—it's only your imagination.",
    'Great things never come from comfort zones.',
    'Dream it. Wish it. Do it.',
    "Success doesn\'t just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Don't stop when you're tired. Stop when you're done.",
    'Wake up with determination. Go to bed with satisfaction.',
    'Do something today that your future self will thank you for.',
    'Little things make big days.',
    "It's going to be hard, but hard does not mean impossible.",
    "Don't wait for opportunity. Create it.",
    "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
    'The key to success is to focus on goals, not obstacles.',
    'Dream bigger. Do bigger.',
    "Don't be afraid to give up the good to go for the great.",
    'The only impossible journey is the one you never begin.',
    'In the middle of difficulty lies opportunity.',
    'Small progress is still progress.',
    'Discipline is the bridge between goals and accomplishment.',
    'Push yourself, because no one else is going to do it for you.',
    "Success is the sum of small efforts repeated day in and day out.",
    'Fall seven times and stand up eight.',
    'Big journeys begin with small steps.',
    'Every day is a chance to get better.',
    'If you want it, work for it.',
    'Consistency is what transforms average into excellence.',
    "Don't limit your challenges. Challenge your limits.",
    "Nothing will work unless you do.",
    'Perseverance is not a long race; it\'s many short races one after the other.',
    "When you feel like quitting, remember why you started.",
    'Energy and persistence conquer all things.',
    "If it doesn\'t challenge you, it won\'t change you.",
    'Your future is created by what you do today, not tomorrow.',
    'The secret of getting ahead is getting started.',
    'Do it with passion or not at all.',
    'Winners are not people who never fail, but people who never quit.',
    'Stay positive, work hard, make it happen.',
    "Opportunities don't happen. You create them.",
    "Success usually comes to those who are too busy to be looking for it.",
    "Don\'t be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    'What you do today can improve all your tomorrows.',
    'Act as if what you do makes a difference. It does.',
    'Motivation gets you going, but discipline keeps you growing.',
    'The secret of change is to focus all your energy not on fighting the old, but on building the new.',
    'Your only limit is you.',
    'Success is not for the lazy.'
  ];

    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = (note.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPurpose = selectedPurpose === 'all' ? true : note.purpose === selectedPurpose;
    return matchesSearch && matchesPurpose;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)' }}>
      {/* Header */}
      <header className="max-w-6xl mx-auto rounded-xl p-4 mb-6 shadow-2xl" style={{ background: 'linear-gradient(90deg, #FFD6EA 0%, #D6FFF8 100%)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))' }}>
              {/* <FileText className="w-7 h-7" /> */}
              <img src={logo} alt="BeanNotes Logo" className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold" style={{ color: '#3B0D3A' }}>BeanNotes</h1>
              <p className="text-sm mt-1 opacity-90" style={{ color: '#2D334A' }}>{dailyQuote}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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
              type="button"
              onClick={openCreateModal}
              className="px-4 py-2 rounded-full font-semibold shadow-lg transform hover:-translate-y-1 transition-all flex items-center space-x-2"
              style={{ background: 'linear-gradient(90deg,#FFAFBD 0%,#FFC3A0 100%)', color: '#3B0836' }}
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* Purpose filters */}
        <div className="mt-4 flex items-center gap-3">
          {PURPOSES.map(p => (
            <button
              key={p}
              type="button"
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

      <div className="max-w-6xl mx-auto mb-6">
        <DonateButton />
      </div>

      {/* Notes Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-12 rounded-xl shadow-lg" style={{ background: 'linear-gradient(180deg,#FFF6F0,#F0FFF8)' }}>
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">{searchTerm ? 'No notes found' : 'No notes yet'}</h3>
            <p className="mb-4 opacity-90">{searchTerm ? 'Try adjusting your search terms' : 'Create your first note to get started'}</p>
            {!searchTerm && (
              <button type="button" onClick={openCreateModal} className="px-6 py-3 rounded-full font-semibold shadow-md" style={{ background: 'linear-gradient(90deg,#FDE68A,#FB923C)', color: '#2F2F2F' }}>Create First Note</button>
            )}
          </div>
        ) : (
          filteredNotes.map(note => {
            const palette = getPalette(note.colorIndex);
            return (
              <article
                key={note.id ?? `${note.title}-${Math.random()}`}
                className="rounded-2xl p-6 shadow-2xl transform hover:-translate-y-2 transition-all relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
                  color: palette.text
                }}
              >
                {/* decorative circle — pointerEvents disabled so it can't block clicks */}
                <div
                  className="absolute -top-6 -right-10 w-40 h-40 opacity-20 rounded-full"
                  style={{ background: palette.to, pointerEvents: 'none', zIndex: 0 }}
                />
                <div className="flex justify-between items-start mb-3">
                  <div className="max-w-[70%]">
                    <h3 className="text-lg font-bold leading-tight">{note.title}</h3>
                    <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.25)', color: palette.text }}>
                      {note.purpose ? note.purpose.charAt(0).toUpperCase() + note.purpose.slice(1) : 'General'}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(note)}
                      aria-label="edit"
                      style={{ color: palette.text, position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      aria-label="delete"
                      style={{ color: palette.text, position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm mb-4 opacity-95" style={{ color: palette.text }}>{note.content || 'No content'}</p>

                <div className="text-xs opacity-90 mt-4" style={{ color: palette.text }}>
                  <p>Created: {formatDate(note.createdAt)}</p>
                  {note.updatedAt !== note.createdAt && <p>Updated: {formatDate(note.updatedAt)}</p>}
                </div>

                {/* note id intentionally removed */}
              </article>
            );
          })
        )}
      </main>

      {/* Modal (unchanged) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.85))' }}>
            <div className="flex items-center justify-between p-5" style={{ background: editingNote ? `linear-gradient(90deg, ${getPalette(editingNote.colorIndex).from}, ${getPalette(editingNote.colorIndex).to})` : 'linear-gradient(90deg,#FFDAB9,#E6E6FA)' }}>
              <h2 className="text-xl font-bold" style={{ color: editingNote ? getPalette(editingNote.colorIndex).text : '#3B0D3A' }}>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
              <button type="button" onClick={closeModal} aria-label="close">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-5">
                <label htmlFor="title" className="block font-medium mb-2">Title</label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none shadow-inner"
                  placeholder="Enter note title..."
                />
              </div>

              <div className="mb-5">
                <label htmlFor="content" className="block font-medium mb-2">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none shadow-inner resize-vertical"
                  placeholder="Write your note content here..."
                />
              </div>

              <div className="mb-5">
                <label htmlFor="purpose" className="block font-medium mb-2">Purpose</label>
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl focus:outline-none shadow-inner"
                >
                  <option value="personal">Personal</option>
                  <option value="school">School</option>
                  <option value="home">Home</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-full font-medium shadow" style={{ background: 'rgba(0,0,0,0.06)' }}>Cancel</button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!formData.title.trim() || isSaving}
                  className="px-4 py-2 rounded-full font-bold shadow transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(90deg,#A78BFA,#F472B6)',
                    color: '#fff',
                    opacity: (!formData.title.trim() || isSaving) ? 0.6 : 1,
                    cursor: (!formData.title.trim() || isSaving) ? 'not-allowed' : 'pointer'
                  }}
                >
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