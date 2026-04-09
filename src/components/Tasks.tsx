import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Plus, Trash2, CheckSquare, Loader2, Square } from 'lucide-react';
import { db, collection, onSnapshot, addDoc, deleteDoc, doc, query, updateDoc, auth, handleFirestoreError, OperationType } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function Tasks({ profile }: { profile: UserProfile | null }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;
    const path = `users/${auth.currentUser.uid}/tasks`;
    const q = query(collection(db, 'users', auth.currentUser.uid, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    if (!newTask || !auth.currentUser) return;
    await addDoc(collection(db, 'users', auth.currentUser.uid, 'tasks'), {
      title: newTask,
      completed: false,
      timestamp: new Date().toISOString()
    });
    setNewTask('');
  };

  const toggleTask = async (id: string, completed: boolean) => {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', id), {
      completed: !completed
    });
  };

  const handleDeleteTask = async (id: string) => {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', id));
  };

  if (loading) return <div className="p-6 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-slate-900">Study Tasks</h2>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Add a task..." 
          className="flex-1 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500/20"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button 
          onClick={handleAddTask}
          className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                task.completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTask(task.id, task.completed)} className="text-blue-600">
                  {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
                <span className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {task.title}
                </span>
              </div>
              <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
