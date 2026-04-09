import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Plus, Trash2, FileText, Loader2 } from 'lucide-react';
import { db, collection, onSnapshot, addDoc, deleteDoc, doc, query, where, auth, handleFirestoreError, OperationType } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export default function Notes({ profile }: { profile: UserProfile | null }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    if (!auth.currentUser) return;
    const path = `users/${auth.currentUser.uid}/notes`;
    const q = query(collection(db, 'users', auth.currentUser.uid, 'notes'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
      setNotes(notesData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const handleAddNote = async () => {
    if (!newNote.title || !auth.currentUser) return;
    await addDoc(collection(db, 'users', auth.currentUser.uid, 'notes'), {
      ...newNote,
      timestamp: new Date().toISOString()
    });
    setNewNote({ title: '', content: '' });
  };

  const handleDeleteNote = async (id: string) => {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'notes', id));
  };

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-slate-900">My Notes</h2>
      
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <input 
          type="text" 
          placeholder="Note Title" 
          className="w-full border-none focus:ring-0 font-bold text-lg"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <textarea 
          placeholder="Start writing..." 
          className="w-full border-none focus:ring-0 text-sm"
          rows={3}
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <button 
          onClick={handleAddNote}
          className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Save Note
        </button>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div 
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{note.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{note.content}</p>
                </div>
              </div>
              <button onClick={() => handleDeleteNote(note.id)} className="text-slate-300 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
