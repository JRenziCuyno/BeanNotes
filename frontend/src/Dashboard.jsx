import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit3, Trash2, Save, X, FileText } from 'lucide-react';
import logo from './assets/logo.png';
import DonateButton from './components/DonateButton';

const API_BASE = 'http://localhost:5000';
const API_URL = '/notes';

const PURPOSES = ['all', 'school', 'personal', 'home'];

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 7000
});

// 🎨 Random note colors
const COLORS = [
  '#fde2e4', // pink
  '#fad2e1', // light pink
  '#e2ece9', // mint
  '#bee1e6', // very light cyan
  '#f0efeb', // grayish
  '#dfe7fd', // pastel blue
  '#cddafd', // light blue
  '#fff1e6', // peach
  '#fdebd3', // light peach
  '#e3d5ca', // beige
];

const getColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

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

      // ADD RANDOM COLOR TO EACH NOTE IF NOT EXISTS
      const coloredNotes = res.data.map(n => ({
        ...n,
        color: n.color || getColor()
      }));

      setNotes(coloredNotes);
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
      purpose: formData.purpose,
      color: getColor() // 🎨 assign random color
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
      updatedAt: new Date().toISOString(),
      color: editingNote.color || getColor()
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
    setFormData({
      title: note.title || '',
      content: note.content || '',
      purpose: note.purpose || 'personal'
    });
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
      'Productivity is never an accident.',
      'The way to get started is to quit talking and begin doing.',
      'Dream it. Wish it. Do it.',
      'Small progress is still progress.',
      'Your only limit is you.',
      'Success is the sum of repeated effort.',
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      (note.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.content || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPurpose =
      selectedPurpose === 'all' ? true : note.purpose === selectedPurpose;

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
    <div
      className="min-h-screen p-4"
      style={{
        background: 'linear-gradient(135deg, #f5d0fe, #fbcfe8, #fef3c7, #dbeafe)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Header */}
      <header className="max-w-6xl mx-auto rounded-xl p-6 mb-6 shadow-lg bg-white bg-opacity-70 backdrop-blur-sm"
        style={{ border: '1px solid rgba(229, 231, 235, 0.7)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl shadow-md bg-white bg-opacity-60 backdrop-blur-sm">
              <img src={logo} alt="BeanNotes Logo" className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-purple-800">BeanNotes</h1>
              <p className="text-sm mt-1 text-gray-700">{dailyQuote}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 opacity-70" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 w-64 bg-white bg-opacity-70"
              />
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="px-4 py-2 rounded-full font-semibold shadow-md text-white bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:brightness-110 flex items-center space-x-2 transition-transform transform hover:-translate-y-1"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* Purpose Filters */}
        <div className="mt-4 flex items-center gap-3">
          {PURPOSES.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedPurpose(p)}
              className={`px-3 py-1 rounded-full font-medium shadow-sm transition-transform ${
                selectedPurpose === p
                  ? 'scale-105 bg-purple-200 text-purple-900'
                  : 'bg-white bg-opacity-60 text-gray-700'
              }`}
              style={{
                border: selectedPurpose === p
                  ? '1px solid #A78BFA'
                  : '1px solid rgba(0,0,0,0.05)'
              }}
            >
              {p === 'all'
                ? 'All'
                : p.charAt(0).toUpperCase() + p.slice(1)}
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
          <div className="col-span-full text-center py-12 rounded-xl shadow-md bg-white bg-opacity-60 backdrop-blur-sm">
            <FileText className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-80" />
            <h3 className="text-xl font-bold mb-2 text-purple-800">
              {searchTerm ? 'No notes found' : 'No notes yet'}
            </h3>
            {!searchTerm && (
              <button
                type="button"
                onClick={openCreateModal}
                className="px-6 py-3 rounded-full font-semibold shadow-md bg-gradient-to-r from-yellow-300 to-pink-300 text-gray-800 hover:brightness-110 transition"
              >
                Create First Note
              </button>
            )}
          </div>
        ) : (
          filteredNotes.map(note => (
            <article
              key={note.id}
              className="rounded-2xl p-6 shadow-lg relative hover:shadow-xl transition-transform hover:-translate-y-1"
              style={{
                background: note.color,     // 🎨 APPLY COLOR
                color: '#3b0764',           // deep purple text
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="max-w-[70%]">
                  <h3 className="text-lg font-bold leading-tight">{note.title}</h3>
                  <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                    {note.purpose ? note.purpose.charAt(0).toUpperCase() + note.purpose.slice(1) : 'General'}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(note)}
                    className="text-purple-700 hover:text-purple-900"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-purple-700 hover:text-purple-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-sm mb-4 text-gray-800">{note.content}</p>

              <div className="text-xs text-gray-600 mt-4">
                <p>Created: {formatDate(note.createdAt)}</p>
                {note.updatedAt !== note.createdAt && (
                  <p>Updated: {formatDate(note.updatedAt)}</p>
                )}
              </div>
            </article>
          ))
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden bg-white bg-opacity-90 backdrop-blur-md">
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-300 to-pink-300 text-purple-900 font-bold text-xl">
              <h2>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
              <button onClick={closeModal} className="hover:text-purple-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-5">
                <label className="font-semibold text-purple-900">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-purple-200 shadow-inner"
                />
              </div>

              <div className="mb-5">
                <label className="font-semibold text-purple-900">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-purple-200 shadow-inner resize-vertical"
                />
              </div>

              <div className="mb-5">
                <label className="font-semibold text-purple-900">Purpose</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-4 py-2 rounded-xl border border-purple-200 shadow-inner"
                >
                  <option value="personal">Personal</option>
                  <option value="school">School</option>
                  <option value="home">Home</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-full shadow hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={!formData.title.trim() || isSaving}
                  className="px-4 py-2 rounded-full font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 transition transform hover:scale-105 disabled:opacity-60"
                >
                  <Save className="inline-block w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : editingNote ? 'Update' : 'Save'}
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
