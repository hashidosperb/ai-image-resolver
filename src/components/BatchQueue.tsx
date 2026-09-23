import React from 'react';
import { ProcessedImageItem } from '../types';
import { Image as ImageIcon, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface BatchQueueProps {
  items: ProcessedImageItem[];
  activeId: string;
  onSelectItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onDownloadAll: () => void;
}

export const BatchQueue: React.FC<BatchQueueProps> = ({
  items,
  activeId,
  onSelectItem,
  onRemoveItem,
  onDownloadAll,
}) => {
  if (items.length <= 1) return null;

  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 sm:p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
            Batch Image Queue ({items.length})
          </span>
        </div>

        <button
          onClick={onDownloadAll}
          className="text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition"
        >
          Download All Neutralized →
        </button>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              className={`flex-shrink-0 flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition ${
                isActive
                  ? 'bg-zinc-800 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-zinc-950/60 border-zinc-800 hover:bg-zinc-800/50'
              }`}
            >
              <img
                src={item.originalUrl}
                alt={item.name}
                className="w-8 h-8 rounded object-cover border border-zinc-700"
              />
              <div className="text-left max-w-[120px]">
                <p className="text-[11px] font-mono text-zinc-200 truncate">{item.name}</p>
                <div className="flex items-center space-x-1 text-[9px] font-mono">
                  {item.status === 'ready' && (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle className="w-2.5 h-2.5" /> Ready
                    </span>
                  )}
                  {item.status === 'processing' && (
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5 animate-spin" /> Processing
                    </span>
                  )}
                  {item.status === 'error' && (
                    <span className="text-rose-400 flex items-center gap-0.5">
                      <AlertCircle className="w-2.5 h-2.5" /> Error
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(item.id);
                }}
                className="p-1 hover:text-rose-400 text-zinc-500 transition"
                title="Remove from batch"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
