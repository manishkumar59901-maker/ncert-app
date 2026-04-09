import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronDown, BookOpen, Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';

export interface MindMapNode {
  id?: string;
  label: string;
  type?: 'chapter' | 'topic' | 'subtopic';
  children?: MindMapNode[];
}

interface MindMapProps {
  node: MindMapNode;
  level?: number;
  index?: number;
}

export const MindMap: React.FC<MindMapProps> = ({ node, level = 0, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(level < 1);

  const hasChildren = node.children && node.children.length > 0;
  const nodeId = node.id || `node-${level}-${index}`;

  return (
    <div className="flex flex-col ml-4 border-l border-slate-200 pl-4 my-2">
      <div 
        className={cn(
          "flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-200",
          level === 0 ? "bg-indigo-600 text-white shadow-lg" : 
          level === 1 ? "bg-white border border-slate-200 text-slate-800 shadow-sm" :
          "bg-slate-50 text-slate-600 text-sm"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </motion.div>
        )}
        
        {level === 0 ? <BookOpen size={18} /> : <Lightbulb size={16} />}
        <span className="font-medium">{node.label}</span>
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children?.map((child, idx) => (
              <MindMap key={`${nodeId}-${idx}`} node={child} level={level + 1} index={idx} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
