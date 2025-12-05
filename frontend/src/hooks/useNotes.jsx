{/*
    NYA NAA SAD SA Dashboard.jsx ang unsay sulod diri
    PA EXPLAIN NLNG MO SA AI UNSAY NAHITABO DIRI
    
*/}
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE, API_URL, pastelPalettes } from '../utils/statics';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 7000
});

export const useNotes = (syncBlockChain) => {
  const [notes, setNotes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await api.get(API_URL);
      setNotes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching notes:', err?.response?.data ?? err.message);
    }
  };

  const createNote = async (formData) => {
    if (!formData.title.trim()) return false;
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
      const savedNote = res?.data;

      if (savedNote) {
        setNotes(prev => [savedNote, ...prev]);
        // Trigger Blockchain Sync
        syncBlockChain('CREATE', savedNote.title, savedNote.id);
        return true; // Success
      } else {
        await fetchNotes();
        return true;
      }
    } catch (err) {
      console.error('Error in create note: ', err?.response?.data ?? err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateNote = async (editingNote, formData) => {
    if (!formData.title.trim() || !editingNote) return false;
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
        syncBlockChain('UPDATE', res.data.title, res.data.id);
      } else {
        await fetchNotes();
      }
      return true;
    } catch (err) {
      console.error('Error on updating note: ', err?.response?.data ?? err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    const noteToDelete = notes.find(n => n.id === id);
    const titleForChain = noteToDelete ? noteToDelete.title : 'Unknown Note';

    try {
      await api.delete(`${API_URL}/${id}`);
      setNotes(prev => prev.filter(n => n.id !== id));
      syncBlockChain('DELETE', titleForChain, id);
    } catch (err) {
      console.error('Error on delete: ', err);
      await fetchNotes();
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return { notes, createNote, updateNote, deleteNote, isSaving };
};