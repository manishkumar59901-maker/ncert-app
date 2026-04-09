import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { Camera, Send, Image as ImageIcon, Loader2, Sparkles, User, Bot } from 'lucide-react';
import { solveDoubt } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface DoubtSolverProps {
  profile: UserProfile | null;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
  image?: string;
}

export default function DoubtSolver({ profile }: DoubtSolverProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const response = await solveDoubt(userMessage.content, userMessage.image);
      const aiMessage: Message = {
        role: 'ai',
        content: response || 'I am sorry, I could not process that.'
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Doubt solving failed', error);
    } finally {
      setLoading(false);
    }
  };

  const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Sparkles className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Ask your AI Guru</h3>
              <p className="text-sm text-slate-500 max-w-[200px]">Type a question or upload a photo of your textbook problem.</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-indigo-100 text-indigo-600'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] space-y-2`}>
              {msg.image && (
                <img src={msg.image} alt="Doubt" className="rounded-2xl w-full object-cover border border-slate-200" />
              )}
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200 space-y-4">
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 80, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative inline-block"
            >
              <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-xl border-2 border-blue-500" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
              >
                <ImageIcon size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors"
          >
            <Camera size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onImageSelect} 
            accept="image/*" 
            className="hidden" 
          />
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a doubt..."
            className="flex-1 bg-slate-100 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20"
          />
          <button 
            onClick={handleSend}
            disabled={loading || (!input.trim() && !selectedImage)}
            className="p-3 bg-blue-600 text-white rounded-2xl disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
