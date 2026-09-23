import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Lock, HelpCircle, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenDocs: () => void;
  onReset: () => void;
  hasActiveImage: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDocs, onReset, hasActiveImage }) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-mono">
                Ghost<span className="text-emerald-400">Pixel</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-medium">
                v2.0 PRO
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans hidden sm:block">
              AI Detection Evasion & SynthID / C2PA Neutralizer
            </p>
          </div>
        </div>

        {/* Center Sandbox Indicator */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 font-mono">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>100% In-Browser Memory</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> Zero Server Storage
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {hasActiveImage && (
            <button
              id="reset-workspace-btn"
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800 transition"
              title="Clear current workspace"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Image</span>
            </button>
          )}

          <button
            id="open-pipeline-specs-btn"
            onClick={onOpenDocs}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 transition shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pipeline Specs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
