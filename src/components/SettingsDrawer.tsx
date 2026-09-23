import React, { useState } from 'react';
import { EvasionSettings, OutputFormat } from '../types';
import { Sliders, Check, ChevronDown, ChevronUp, RotateCcw, Info } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../utils/evasionEngine';

interface SettingsDrawerProps {
  settings: EvasionSettings;
  onUpdateSettings: (newSettings: EvasionSettings) => void;
  onTriggerReprocess: () => void;
  isProcessing: boolean;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  settings,
  onUpdateSettings,
  onTriggerReprocess,
  isProcessing,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = <K extends keyof EvasionSettings>(key: K, value: EvasionSettings[K]) => {
    onUpdateSettings({
      ...settings,
      preset: 'custom-pro',
      [key]: value,
    });
  };

  const handleResetToPreset = () => {
    const defaultForPreset = DEFAULT_SETTINGS[settings.preset] || DEFAULT_SETTINGS['social-stealth'];
    onUpdateSettings({ ...defaultForPreset });
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden">
      {/* Header / Toggle Button */}
      <button
        id="toggle-pro-controls-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800/50 transition text-left"
      >
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold font-mono uppercase tracking-wider text-zinc-200">
            Fine-Tune Pipeline Controls (Modules A–D)
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
            {settings.preset.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-zinc-400">
          <span className="text-xs font-mono hidden sm:inline">
            {isOpen ? 'Collapse Controls' : 'Expand Advanced Sliders'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-zinc-800/80 space-y-6 bg-zinc-950/40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* MODULE A: Metadata Stripper */}
            <div className="space-y-3 bg-zinc-900/50 p-3.5 rounded-lg border border-zinc-800/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  MODULE A: Metadata Purge
                </span>
                <span className="text-[10px] font-mono text-zinc-400">Header Scrub</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Pans raster into fresh isolated Canvas to drop EXIF, C2PA JUMBF, and XMP packets.
              </p>
              <label className="flex items-center space-x-2 text-xs text-zinc-300 font-mono cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={settings.stripMetadata}
                  onChange={(e) => handleChange('stripMetadata', e.target.checked)}
                  className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span>Purge All Headers (100% Recommended)</span>
              </label>
            </div>

            {/* MODULE B: Scale Jittering & Micro-Warp */}
            <div className="space-y-3 bg-zinc-900/50 p-3.5 rounded-lg border border-zinc-800/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  MODULE B: Scale Jitter
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
                  ±{settings.scaleJitterPercent}%
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Micro-rescaling breaks SynthID 16x16 discrete spatial frequency grid alignment.
              </p>
              <input
                type="range"
                min="0"
                max="2.5"
                step="0.1"
                value={settings.scaleJitterPercent}
                onChange={(e) => handleChange('scaleJitterPercent', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-1.5 text-[11px] font-mono text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.subpixelShift}
                    onChange={(e) => handleChange('subpixelShift', e.target.checked)}
                    className="rounded bg-zinc-800 border-zinc-700 text-cyan-500"
                  />
                  <span>Sub-pixel Phase Warp</span>
                </label>
                <div className="text-[10px] font-mono text-zinc-400">
                  Crop: {settings.borderCropPx}px
                </div>
              </div>
            </div>

            {/* MODULE C: Procedural Noise Injection */}
            <div className="space-y-3 bg-zinc-900/50 p-3.5 rounded-lg border border-zinc-800/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400">
                  MODULE C: Pixel Perturbation
                </span>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800/60">
                  Amp ±{settings.noiseIntensity}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Subtle procedural RGB variation masks smooth frequency transitions from classifiers.
              </p>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={settings.noiseIntensity}
                onChange={(e) => handleChange('noiseIntensity', parseInt(e.target.value, 10))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
              <div className="flex gap-1.5 pt-1">
                {(['uniform', 'gaussian', 'chroma-dominant'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleChange('noiseType', mode)}
                    className={`flex-1 py-1 text-[9px] font-mono uppercase rounded border transition ${
                      settings.noiseType === mode
                        ? 'bg-indigo-950 border-indigo-500/80 text-indigo-300'
                        : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {mode.split('-')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* MODULE D: Lossy Randomization & Format */}
            <div className="space-y-3 bg-zinc-900/50 p-3.5 rounded-lg border border-zinc-800/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">
                  MODULE D: Lossy Re-encode
                </span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
                  {Math.round(settings.lossyQualityMin * 100)}–{Math.round(settings.lossyQualityMax * 100)}%
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Randomized quality breaks residual DCT quantization fingerprints.
              </p>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {(['image/jpeg', 'image/png', 'image/webp'] as OutputFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleChange('targetFormat', fmt)}
                    className={`py-1 text-[10px] font-mono uppercase rounded border transition ${
                      settings.targetFormat === fmt
                        ? 'bg-amber-950/80 border-amber-500/80 text-amber-300'
                        : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {fmt.replace('image/', '')}
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between pt-1">
                <span>Safe Res Cap:</span>
                <select
                  value={settings.maxDimensionCap}
                  onChange={(e) => handleChange('maxDimensionCap', parseInt(e.target.value, 10))}
                  className="bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 font-mono"
                >
                  <option value={2048}>2048 px</option>
                  <option value={4096}>4096 px (Default)</option>
                  <option value={8192}>8192 px (High RAM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-zinc-800/60 gap-3">
            <button
              onClick={handleResetToPreset}
              className="flex items-center space-x-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset parameters to preset defaults</span>
            </button>

            <button
              id="reprocess-pipeline-btn"
              disabled={isProcessing}
              onClick={onTriggerReprocess}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold font-mono transition shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Processing in Memory...' : 'Apply & Reprocess Image'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
