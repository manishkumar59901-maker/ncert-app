import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  Search, 
  BookOpen, 
  ChevronRight, 
  ArrowLeft,
  Download,
  CheckCircle2,
  Loader2,
  Sparkles,
  FileText,
  HelpCircle,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, collection, onSnapshot, query, where, handleFirestoreError, OperationType } from '../firebase';
import { getChapterSummary } from '../services/geminiService';
import { MindMap } from './MindMap';
import { useNavigate } from 'react-router-dom';

interface StudyProps {
  profile: UserProfile | null;
}

interface Book {
  id: string;
  title: string;
  subtitle: string;
  subject: string;
  class: string;
}

interface Unit {
  id: string;
  title: string;
  progress: number;
  totalSize: string;
  downloadedSize: string;
  status: 'online' | 'downloading' | 'offline';
}

export default function Study({ profile }: StudyProps) {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [units] = useState<Unit[]>([
    { id: '1', title: 'ठोस अवस्था', progress: 50, totalSize: '21.3 MB', downloadedSize: '10.7 MB', status: 'downloading' },
    { id: '2', title: 'विलयन', progress: 91, totalSize: '1.1 MB', downloadedSize: '1.0 MB', status: 'offline' },
    { id: '3', title: 'वैद्युतरसायन', progress: 0, totalSize: '15.0 MB', downloadedSize: '0 MB', status: 'online' },
    { id: '4', title: 'रासायनिक बलगतिकी', progress: 54, totalSize: '695.9 KB', downloadedSize: '376.0 KB', status: 'downloading' },
  ]);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chapterData, setChapterData] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, 'books'), where('class', '==', profile?.class || '10'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
      setBooks(booksData.length > 0 ? booksData : [
        { id: 'demo1', title: 'Class 10 Science', subtitle: 'NCERT Textbook', subject: 'Science', class: '10' },
        { id: 'demo2', title: 'Class 10 Maths', subtitle: 'NCERT Textbook', subject: 'Maths', class: '10' }
      ]);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'books');
    });
    return () => unsubscribe();
  }, [profile?.class]);

  const handleOpenUnit = async (unit: Unit) => {
    setSelectedUnit(unit);
    setContentLoading(true);
    try {
      const data = await getChapterSummary(unit.title, selectedBook?.subject || 'Science', profile?.class || '10');
      setChapterData(data);
    } catch (error) {
      console.error('Failed to fetch chapter content', error);
    } finally {
      setContentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <AnimatePresence mode="wait">
        {!selectedBook ? (
          <motion.div 
            key="books-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">NCERT की किताबें</h2>
              <p className="text-slate-500">अपनी कक्षा की किताबें चुनें</p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="किताबें खोजें..." 
                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid gap-4">
              {books.map((book) => (
                <button
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <BookOpen size={28} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900">{book.title}</div>
                      <div className="text-xs text-slate-500">{book.subtitle}</div>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : !selectedUnit ? (
          <motion.div 
            key="units-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedBook(null)}
                className="p-2 bg-slate-100 rounded-full text-slate-600"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedBook.title}</h2>
                <p className="text-xs text-slate-500">विषय-सूची</p>
              </div>
            </div>

            <div className="space-y-4">
              {units.map((unit) => (
                <div key={unit.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">यूनिट {unit.id}</span>
                      <h3 className="font-bold text-slate-900">{unit.title}</h3>
                    </div>
                    {unit.status === 'offline' ? (
                      <CheckCircle2 className="text-green-500" size={20} />
                    ) : (
                      <Download className="text-slate-300" size={20} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>{unit.downloadedSize} / {unit.totalSize}</span>
                      <span>({unit.progress}% पूरा हो चुका है)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${unit.progress}%` }}
                        className="h-full bg-green-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenUnit(unit)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                    >
                      {unit.status === 'offline' ? 'खोलें' : 'डाउनलोड करें'}
                    </button>
                    <button 
                      onClick={() => handleOpenUnit(unit)}
                      className="flex-1 bg-green-500 text-white py-2 rounded-xl text-xs font-bold"
                    >
                      ऑनलाइन पढ़ें
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="unit-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <button 
              onClick={() => { setSelectedUnit(null); setChapterData(null); }}
              className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Units
            </button>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">{selectedUnit.title}</h2>
              <div className="flex gap-2">
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">{selectedBook.subject}</span>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">Class {profile?.class}</span>
              </div>
            </div>

            {contentLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-bold text-center">AI is preparing your study guide...<br/>(Hindi + English Mix)</p>
              </div>
            ) : chapterData && (
              <div className="space-y-8">
                {/* Summary Card */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Sparkles size={20} />
                    <h3 className="font-bold uppercase tracking-wider text-xs">AI Summary</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{chapterData.summary}</p>
                </div>

                {/* Mind Map Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <PlayCircle size={20} className="text-indigo-600" />
                    Chapter Mind Map
                  </h3>
                  <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-x-auto">
                    <MindMap node={chapterData.mindMap} />
                  </div>
                </div>

                {/* Key Points */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={20} className="text-orange-600" />
                    Key Points
                  </h3>
                  <div className="grid gap-3">
                    {chapterData.keyPoints.map((point: string, i: number) => (
                      <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3">
                        <div className="w-6 h-6 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm text-slate-700">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Questions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle size={20} className="text-green-600" />
                    Important Questions
                  </h3>
                  <div className="grid gap-3">
                    {chapterData.importantQuestions.map((q: string, i: number) => (
                      <div key={i} className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg">
                        <p className="text-sm font-medium leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quiz Action */}
                <button 
                  onClick={() => navigate(`/quiz/${selectedUnit.id}`)}
                  className="w-full bg-blue-600 text-white py-4 rounded-3xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  Start Chapter Quiz <ChevronRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
