import React from 'react';
import { EvasionPreset, EvasionSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/evasionEngine';
import { Sliders, ShieldCheck, Grid, Zap, Flame } from 'lucide-react';

interface PresetSelectorProps {
  currentPreset: EvasionPreset;
  onSelectPreset: (preset: EvasionPreset, newSettings: EvasionSettings) => void;
  isCustomized: boolean;
}

interface PresetOption {
  id: EvasionPreset;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
}

const PRESETS: PresetOption[] = [
  {
    id: 'social-stealth',
    title: 'Social Stealth',
    badge: 'Recommended',
    badgeColor: 'bg-emerald-950/80 border-emerald-800/80 text-emerald-400',
    description: 'Bypasses Instagram, Threads & TikTok algorithmic down-ranking while keeping visual fidelity at >99.4%.',
    icon: ShieldCheck,
    tagline: '±0.6% Jitter • Clean EXIF/C2PA • Amp ±3',
  },
  {
    id: 'synthid-disruptor',
    title: 'SynthID Disruptor',
    badge: 'Frequency Defense',
    badgeColor: 'bg-cyan-950/80 border-cyan-800/80 text-cyan-400',
    description: 'Disrupts 16x16 harmonic grid lattices & sub-pixel watermarking embeddings with chroma-dominant variance.',
    icon: Grid,
    tagline: '±0.9% Jitter • Phase Shift • Chroma Noise',
  },
  {
    id: 'metadata-purge',
    title: 'Metadata Purge Only',
    badge: '100% Lossless',
    badgeColor: 'bg-blue-950/80 border-blue-800/80 text-blue-400',
    description: 'Pure header scrubbing: eliminates C2PA JUMBF, EXIF, XMP and prompts without altering a single pixel.',
    icon: Zap,
    tagline: '0% Distortion • Zero Byte Retention',
  },
  {
    id: 'maximum-scramble',
    title: 'Max Classifier Scramble',
    badge: 'Heavy Evasion',
    badgeColor: 'bg-rose-950/80 border-rose-800/80 text-rose-400',
    description: 'Multi-stage perturbation + Gaussian noise + re-quantization to blind deep learning neural network classifiers.',
    icon: Flame,
    tagline: '±1.2% Jitter • Gaussian ±6 • DCT Scramble',
  },
];

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPreset,
  onSelectPreset,
  isCustomized,
}) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-1.5">
          <span>Evasion Strategy Presets</span>
          {isCustomized && currentPreset !== 'custom-pro' && (
            <span className="text-[10px] text-amber-400 font-normal font-sans">(Custom adjustments active)</span>
          )}
        </label>
        <span className="text-[11px] text-zinc-500 font-mono">
          Select profile or customize below
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PRESETS.map((p) => {
          const Icon = p.icon;
          const isSelected = currentPreset === p.id;

          return (
            <button
              key={p.id}
              id={`preset-btn-${p.id}`}
              onClick={() => onSelectPreset(p.id, { ...DEFAULT_SETTINGS[p.id] })}
              className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
                  : 'bg-zinc-950/60 hover:bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold font-mono text-zinc-100">
                      {p.title}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{p.tagline}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
