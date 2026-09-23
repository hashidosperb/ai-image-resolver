import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Shield, AlertCircle, FileCheck, Layers } from 'lucide-react';
import { SAMPLE_IMAGES, SampleItem } from '../utils/sampleImages';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  onSampleSelected: (sample: SampleItem) => void;
  isLoadingSample: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  onSampleSelected,
  isLoadingSample,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData?.items) return;
      const files: File[] = [];
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        const item = e.clipboardData.items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        onFilesSelected(files);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFilesSelected]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
      // Reset input value so same file can be re-selected if needed
      e.target.value = '';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Primary Dropzone */}
      <div
        id="image-dropzone-container"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 group ${
          isDragActive
            ? 'border-emerald-400 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          id="file-upload-input"
        />

        <div className="max-w-md mx-auto flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center text-zinc-300 group-hover:text-emerald-400 group-hover:scale-105 transition-all shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 font-mono">
              Drop AI image here or <span className="text-emerald-400 underline underline-offset-4">browse files</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Neutralize invisible SynthID grids, purge C2PA metadata, and disrupt classifiers
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-mono text-zinc-400">
            <span className="px-2.5 py-1 rounded-md bg-zinc-800/90 border border-zinc-700/50">JPEG / JPG</span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-800/90 border border-zinc-700/50">PNG</span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-800/90 border border-zinc-700/50">WEBP</span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-800/90 border border-zinc-700/50">Paste (Ctrl+V)</span>
          </div>

          <div className="pt-2 flex items-center space-x-1.5 text-xs text-zinc-400 font-mono">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Files are processed purely in client memory and never uploaded</span>
          </div>
        </div>
      </div>

      {/* Simulated AI Samples for Instant 1-Click Testing */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
              Quick Test: Pre-Configured Synthetic AI Samples
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 hidden sm:inline font-mono">
            Click to test perturbation pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              id={`sample-btn-${sample.id}`}
              disabled={isLoadingSample}
              onClick={(e) => {
                e.stopPropagation();
                onSampleSelected(sample);
              }}
              className="flex flex-col text-left p-3 rounded-lg bg-zinc-950/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/40 transition group relative overflow-hidden"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-medium text-zinc-200 group-hover:text-emerald-300 font-mono">
                  {sample.name}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {sample.category}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-1">
                {sample.subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
