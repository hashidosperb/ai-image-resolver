import React, { useState, useRef, useEffect } from 'react';
import { ProcessedImageItem, ViewMode } from '../types';
import {
  Columns,
  SplitSquareVertical,
  Activity,
  Radio,
  FileSearch,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ShieldCheck,
  AlertTriangle,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface ComparisonViewerProps {
  item: ProcessedImageItem;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
}

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({
  item,
  viewMode,
  onChangeViewMode,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse / Touch handlers for split slider
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateSlider(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateSlider = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, []);

  const hasProcessed = !!item.processedUrl;

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Toolbar */}
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/70 flex flex-wrap items-center justify-between gap-3">
        {/* View Mode Buttons */}
        <div className="flex items-center space-x-1 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800">
          <button
            id="view-mode-split-btn"
            onClick={() => onChangeViewMode('split')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              viewMode === 'split'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>

          <button
            id="view-mode-side-btn"
            onClick={() => onChangeViewMode('side-by-side')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              viewMode === 'side-by-side'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>

          <button
            id="view-mode-diff-btn"
            onClick={() => onChangeViewMode('diff')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              viewMode === 'diff'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Delta Heatmap</span>
          </button>

          <button
            id="view-mode-frequency-btn"
            onClick={() => onChangeViewMode('frequency')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              viewMode === 'frequency'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Spatial Radar</span>
          </button>

          <button
            id="view-mode-metadata-btn"
            onClick={() => onChangeViewMode('metadata')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              viewMode === 'metadata'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Metadata Audit</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-zinc-950/80 px-2 py-1 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, parseFloat((z - 0.25).toFixed(2))))}
              className="p-1 hover:text-white transition disabled:opacity-30"
              disabled={zoomLevel <= 0.75}
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(3, parseFloat((z + 0.25).toFixed(2))))}
              className="p-1 hover:text-white transition disabled:opacity-30"
              disabled={zoomLevel >= 3}
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 1 && (
              <button
                onClick={() => setZoomLevel(1)}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 ml-1 underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Visual Display Canvas */}
      <div className="relative min-h-[420px] max-h-[640px] flex items-center justify-center p-4 overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-950 select-none">
        {/* Processing Spinner Overlay */}
        {item.status === 'processing' && (
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-emerald-400">
              Scrambling frequency lattices & purging headers in browser memory...
            </p>
          </div>
        )}

        {/* 1. SPLIT SLIDER VIEW */}
        {viewMode === 'split' && (
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative cursor-ew-resize overflow-hidden rounded-lg max-w-full max-h-[580px] shadow-xl"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            {/* Background: Original Image */}
            <img
              src={item.originalUrl}
              alt="Original AI Generated"
              className="block max-h-[580px] w-auto object-contain pointer-events-none"
            />

            {/* Foreground: Processed Neutralized Image clipped by sliderPos */}
            {item.processedUrl && (
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
              >
                <img
                  src={item.processedUrl}
                  alt="Neutralized Evasion Output"
                  className="block max-h-[580px] w-auto object-contain"
                />
              </div>
            )}

            {/* Slider Dividing Bar */}
            {item.processedUrl && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-20 pointer-events-none shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                style={{ left: `${sliderPos}%` }}
              >
                {/* Drag Handle Knob */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-zinc-900 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg text-[10px] font-mono font-bold">
                  ↔
                </div>
              </div>
            )}

            {/* Dynamic Corner Labels */}
            <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-rose-300 border border-rose-900/60 shadow-md pointer-events-none">
              ORIGINAL (AI Flagged)
            </div>
            <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-emerald-300 border border-emerald-900/60 shadow-md pointer-events-none">
              NEUTRALIZED (Evasion Active)
            </div>
          </div>
        )}

        {/* 2. SIDE BY SIDE VIEW */}
        {viewMode === 'side-by-side' && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-h-[580px] overflow-auto p-2"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            {/* Original Card */}
            <div className="flex flex-col items-center bg-zinc-900/40 p-3 rounded-xl border border-zinc-800">
              <div className="w-full flex items-center justify-between mb-2 text-xs font-mono text-zinc-400">
                <span className="text-rose-400 flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" /> Original Source
                </span>
                <span>{item.metrics?.originalDimensions.width} × {item.metrics?.originalDimensions.height} px</span>
              </div>
              <img
                src={item.originalUrl}
                alt="Original"
                className="max-h-[460px] object-contain rounded-lg border border-zinc-800/80"
              />
            </div>

            {/* Processed Card */}
            <div className="flex flex-col items-center bg-zinc-900/40 p-3 rounded-xl border border-zinc-800">
              <div className="w-full flex items-center justify-between mb-2 text-xs font-mono text-zinc-400">
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Neutralized Output
                </span>
                <span>{item.metrics?.processedDimensions.width} × {item.metrics?.processedDimensions.height} px</span>
              </div>
              {item.processedUrl && (
                <img
                  src={item.processedUrl}
                  alt="Neutralized"
                  className="max-h-[460px] object-contain rounded-lg border border-zinc-800/80"
                />
              )}
            </div>
          </div>
        )}

        {/* 3. DELTA HEATMAP VIEW */}
        {viewMode === 'diff' && (
          <div
            className="flex flex-col items-center space-y-3 max-h-[580px]"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            <div className="bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-indigo-900/60 text-xs font-mono text-indigo-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>18× Amplified Perturbation Map (Cyan/Magenta shows scrambled carrier frequencies)</span>
            </div>
            {item.diffMapUrl && (
              <img
                src={item.diffMapUrl}
                alt="Amplified Pixel Difference"
                className="max-h-[480px] object-contain rounded-lg border border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
              />
            )}
          </div>
        )}

        {/* 4. FREQUENCY SPECTRUM VIEW */}
        {viewMode === 'frequency' && (
          <div
            className="flex flex-col items-center space-y-3 max-h-[580px]"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            <div className="bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-cyan-900/60 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>2D Laplacian High-Frequency Radar (Confirms elimination of periodic SynthID harmonics)</span>
            </div>
            {item.frequencyMapUrl && (
              <img
                src={item.frequencyMapUrl}
                alt="Frequency Radar"
                className="max-h-[480px] object-contain rounded-lg border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
              />
            )}
          </div>
        )}

        {/* 5. METADATA AUDIT & FORENSICS */}
        {viewMode === 'metadata' && (
          <div className="w-full max-w-3xl bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-5 overflow-auto max-h-[540px]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileSearch className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold font-mono text-zinc-100 uppercase tracking-wide">
                  Metadata Forensics & Container Audit
                </h4>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 font-semibold">
                ALL C2PA & EXIF HEADERS DROPPED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original Metadata Analysis */}
              <div className="bg-zinc-950/80 p-4 rounded-xl border border-rose-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400">
                    ORIGINAL FILE HEADERS
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/50">
                    {item.metadataAudit.verdict}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-500">EXIF TIFF Headers:</span>
                    <span className={item.metadataAudit.hasExif ? 'text-rose-400 font-bold' : 'text-zinc-400'}>
                      {item.metadataAudit.hasExif ? 'DETECTED' : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-500">C2PA JUMBF Manifest:</span>
                    <span className={item.metadataAudit.hasC2pa ? 'text-rose-400 font-bold' : 'text-zinc-400'}>
                      {item.metadataAudit.hasC2pa ? 'DETECTED (Content Cred)' : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-500">XMP Metadata Packet:</span>
                    <span className={item.metadataAudit.hasXmp ? 'text-rose-400 font-bold' : 'text-zinc-400'}>
                      {item.metadataAudit.hasXmp ? 'DETECTED' : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-500">IPTC / Adobe Markers:</span>
                    <span className={item.metadataAudit.hasIptc ? 'text-rose-400 font-bold' : 'text-zinc-400'}>
                      {item.metadataAudit.hasIptc ? 'DETECTED' : 'None'}
                    </span>
                  </div>
                </div>

                {item.metadataAudit.detectedTags.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-zinc-400 block mb-1">Detected Identifiers:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.metadataAudit.detectedTags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 border border-rose-900/60 text-rose-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mutated / Neutralized Output Analysis */}
              <div className="bg-zinc-950/80 p-4 rounded-xl border border-emerald-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    MUTATED FILE OUTPUT
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    100% CLEAN
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-500">EXIF TIFF Headers:</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PURGED
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-500">C2PA JUMBF Manifest:</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> STRIPPED
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-500">XMP Metadata Packet:</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> DROPPED
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-500">Camera / Software Tags:</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ZERO BYTE RETENTION
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-zinc-400 leading-relaxed font-mono">
                  Module A extracts pure raw raster through an isolated context, ensuring no container signatures or tracking tags persist.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-2 border-t border-zinc-800/80 bg-zinc-950 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
        <span className="truncate">File: {item.name}</span>
        <span className="hidden sm:inline">Drag divider to compare original vs evasion output</span>
      </div>
    </div>
  );
};
