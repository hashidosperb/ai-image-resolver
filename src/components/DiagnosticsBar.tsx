import React, { useState } from 'react';
import { ProcessingMetrics, OutputFormat } from '../types';
import { Download, Copy, Check, ShieldCheck, Gauge, Zap, FileText, ArrowRight } from 'lucide-react';

interface DiagnosticsBarProps {
  metrics: ProcessingMetrics | null;
  onDownload: () => void;
  onCopyClipboard: () => Promise<boolean>;
  targetFormat: OutputFormat;
  onChangeFormat: (fmt: OutputFormat) => void;
  isProcessing: boolean;
}

export const DiagnosticsBar: React.FC<DiagnosticsBarProps> = ({
  metrics,
  onDownload,
  onCopyClipboard,
  targetFormat,
  onChangeFormat,
  isProcessing,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await onCopyClipboard();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: PSNR (Signal-to-Noise Ratio) */}
        <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" /> PSNR Ratio
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">
              {metrics ? (metrics.psnrDb > 40 ? 'EXCELLENT' : 'HIGH') : '--'}
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-zinc-100 flex items-baseline gap-1">
            <span>{metrics ? `${metrics.psnrDb} dB` : '--'}</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            &gt;40 dB: Virtually imperceptible to human eyes
          </p>
        </div>

        {/* Metric 2: Perceptual Fidelity */}
        <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Visual Fidelity
            </span>
            <span className="text-[10px] text-cyan-400 font-bold">SSIM EST</span>
          </div>
          <div className="text-lg font-bold font-mono text-zinc-100 flex items-baseline gap-1">
            <span>{metrics ? `${metrics.fidelityPercent}%` : '--'}</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            Full color composition and clarity preserved
          </p>
        </div>

        {/* Metric 3: File Size Delta */}
        <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-400" /> File Size
            </span>
            <span className="text-[10px] text-indigo-400 font-bold">
              {metrics && metrics.processedSize < metrics.originalSize ? 'OPTIMIZED' : 'CLEAN'}
            </span>
          </div>
          <div className="text-xs font-mono text-zinc-200 flex items-center gap-1 pt-1">
            <span className="text-zinc-400">{metrics ? formatBytes(metrics.originalSize) : '--'}</span>
            <ArrowRight className="w-3 h-3 text-zinc-600" />
            <span className="font-bold text-emerald-400">{metrics ? formatBytes(metrics.processedSize) : '--'}</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            Container headers and tracking bytes purged
          </p>
        </div>

        {/* Metric 4: Execution Speed */}
        <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Latency
            </span>
            <span className="text-[10px] text-amber-400 font-bold">IN-BROWSER</span>
          </div>
          <div className="text-lg font-bold font-mono text-zinc-100 flex items-baseline gap-1">
            <span>{metrics ? `${metrics.durationMs} ms` : '--'}</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            Instant client canvas rendering
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
        {/* Format Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-zinc-400">Output:</span>
          <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
            {(['image/jpeg', 'image/png', 'image/webp'] as OutputFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => onChangeFormat(fmt)}
                className={`px-2.5 py-1 rounded uppercase transition ${
                  targetFormat === fmt
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {fmt.replace('image/', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            id="copy-to-clipboard-btn"
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-zinc-200 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Image'}</span>
          </button>

          <button
            id="download-mutated-image-btn"
            onClick={onDownload}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-zinc-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 transition shadow-[0_0_25px_rgba(16,185,129,0.35)] active:scale-[0.98] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download Mutated Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
