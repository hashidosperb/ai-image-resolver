import React, { useState, useEffect, useCallback } from 'react';
import {
  EvasionPreset,
  EvasionSettings,
  ProcessedImageItem,
  ViewMode,
  OutputFormat,
} from './types';
import {
  DEFAULT_SETTINGS,
  auditMetadata,
  processEvasionPipeline,
} from './utils/evasionEngine';
import { SampleItem } from './utils/sampleImages';
import { Header } from './components/Header';
import { Dropzone } from './components/Dropzone';
import { PresetSelector } from './components/PresetSelector';
import { SettingsDrawer } from './components/SettingsDrawer';
import { ComparisonViewer } from './components/ComparisonViewer';
import { DiagnosticsBar } from './components/DiagnosticsBar';
import { BatchQueue } from './components/BatchQueue';
import { TechDocsModal } from './components/TechDocsModal';
import {
  ShieldCheck,
  EyeOff,
  Lock,
  Layers,
  Sparkles,
  AlertCircle,
  FileCheck,
  Zap,
} from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [settings, setSettings] = useState<EvasionSettings>(DEFAULT_SETTINGS['social-stealth']);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoadingSample, setIsLoadingSample] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeItem = items.find((it) => it.id === activeItemId) || null;

  /**
   * Process a specific image item through the evasion pipeline
   */
  const processItem = useCallback(
    async (item: ProcessedImageItem, currentSettings: EvasionSettings) => {
      try {
        setIsProcessing(true);
        setErrorMessage(null);

        // Update item status to processing
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: 'processing' } : it))
        );

        const result = await processEvasionPipeline(
          item.originalImage,
          item.originalBlob,
          currentSettings
        );

        const processedUrl = URL.createObjectURL(result.processedBlob);
        const diffMapUrl = URL.createObjectURL(result.diffMapBlob);
        const frequencyMapUrl = URL.createObjectURL(result.frequencyMapBlob);

        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  processedBlob: result.processedBlob,
                  processedUrl,
                  diffMapUrl,
                  frequencyMapUrl,
                  metrics: result.metrics,
                  status: 'ready',
                }
              : it
          )
        );
      } catch (err: any) {
        console.error('Evasion processing failed:', err);
        setErrorMessage(err?.message || 'Processing failed');
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? { ...it, status: 'error', errorMessage: err?.message || 'Processing error' }
              : it
          )
        );
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  /**
   * Ingest and initiate pipeline for raw files
   */
  const handleFilesSelected = async (files: File[]) => {
    setErrorMessage(null);
    const newItems: ProcessedImageItem[] = [];

    for (const file of files) {
      try {
        const metadataAudit = await auditMetadata(file);
        const originalUrl = URL.createObjectURL(file);

        const img = new Image();
        img.crossOrigin = 'anonymous';

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
          img.src = originalUrl;
        });

        const id = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newItem: ProcessedImageItem = {
          id,
          name: file.name,
          originalBlob: file,
          originalUrl,
          originalImage: img,
          metadataAudit,
          processedBlob: null,
          processedUrl: null,
          metrics: null,
          diffMapUrl: null,
          frequencyMapUrl: null,
          status: 'idle',
        };

        newItems.push(newItem);
      } catch (err: any) {
        console.error('File load error:', err);
        setErrorMessage(`Could not read ${file.name}: ${err.message}`);
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      const targetItem = newItems[0];
      setActiveItemId(targetItem.id);

      // Process target item
      processItem(targetItem, settings);
    }
  };

  /**
   * Ingest synthetic sample image
   */
  const handleSampleSelected = async (sample: SampleItem) => {
    try {
      setIsLoadingSample(true);
      setErrorMessage(null);

      const blob = await sample.generate();
      const metadataAudit = await auditMetadata(blob);
      const originalUrl = URL.createObjectURL(blob);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to render sample image'));
        img.src = originalUrl;
      });

      const id = `sample-${Date.now()}`;
      const newItem: ProcessedImageItem = {
        id,
        name: `${sample.name}.jpg`,
        originalBlob: blob,
        originalUrl,
        originalImage: img,
        metadataAudit,
        processedBlob: null,
        processedUrl: null,
        metrics: null,
        diffMapUrl: null,
        frequencyMapUrl: null,
        status: 'idle',
      };

      setItems([newItem]);
      setActiveItemId(id);

      await processItem(newItem, settings);
    } catch (err: any) {
      console.error('Failed to load sample:', err);
      setErrorMessage(err.message || 'Failed to generate test sample');
    } finally {
      setIsLoadingSample(false);
    }
  };

  /**
   * Change Evasion preset
   */
  const handleSelectPreset = (preset: EvasionPreset, newSettings: EvasionSettings) => {
    setSettings(newSettings);
    if (activeItem) {
      processItem(activeItem, newSettings);
    }
  };

  /**
   * Fine-tune settings from drawer
   */
  const handleUpdateSettings = (newSettings: EvasionSettings) => {
    setSettings(newSettings);
  };

  /**
   * Reprocess current image with latest settings
   */
  const handleTriggerReprocess = () => {
    if (activeItem) {
      processItem(activeItem, settings);
    }
  };

  /**
   * Download single processed image
   */
  const handleDownload = () => {
    if (!activeItem || !activeItem.processedBlob) return;
    const ext = settings.targetFormat === 'image/png' ? 'png' : settings.targetFormat === 'image/webp' ? 'webp' : 'jpg';
    const baseName = activeItem.name.replace(/\.[^/.]+$/, '');
    const filename = `${baseName}_clean.${ext}`;

    const a = document.createElement('a');
    a.href = URL.createObjectURL(activeItem.processedBlob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  /**
   * Copy clean image to clipboard
   */
  const handleCopyClipboard = async (): Promise<boolean> => {
    if (!activeItem || !activeItem.processedBlob) return false;

    try {
      // Browsers generally require 'image/png' for ClipboardItem
      let copyBlob = activeItem.processedBlob;
      if (copyBlob.type !== 'image/png') {
        const canvas = document.createElement('canvas');
        canvas.width = activeItem.originalImage.naturalWidth;
        canvas.height = activeItem.originalImage.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        const tempImg = new Image();
        tempImg.src = activeItem.processedUrl!;
        await new Promise((r) => (tempImg.onload = r));
        ctx.drawImage(tempImg, 0, 0);

        copyBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b || new Blob()), 'image/png');
        });
      }

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': copyBlob }),
      ]);
      return true;
    } catch (err) {
      console.warn('Clipboard write failed, fallback or unsupported browser:', err);
      return false;
    }
  };

  /**
   * Change target format
   */
  const handleChangeFormat = (fmt: OutputFormat) => {
    const updated = { ...settings, targetFormat: fmt };
    setSettings(updated);
    if (activeItem) {
      processItem(activeItem, updated);
    }
  };

  /**
   * Download all images in batch queue
   */
  const handleDownloadAll = () => {
    items.forEach((item, index) => {
      if (item.processedBlob) {
        setTimeout(() => {
          const ext = settings.targetFormat === 'image/png' ? 'png' : settings.targetFormat === 'image/webp' ? 'webp' : 'jpg';
          const baseName = item.name.replace(/\.[^/.]+$/, '');
          const a = document.createElement('a');
          a.href = URL.createObjectURL(item.processedBlob!);
          a.download = `${baseName}_clean.${ext}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, index * 200);
      }
    });
  };

  /**
   * Reset workspace
   */
  const handleReset = () => {
    items.forEach((it) => {
      if (it.originalUrl) URL.revokeObjectURL(it.originalUrl);
      if (it.processedUrl) URL.revokeObjectURL(it.processedUrl);
      if (it.diffMapUrl) URL.revokeObjectURL(it.diffMapUrl);
      if (it.frequencyMapUrl) URL.revokeObjectURL(it.frequencyMapUrl);
    });
    setItems([]);
    setActiveItemId(null);
    setErrorMessage(null);
  };

  const isCustomized = settings.preset === 'custom-pro';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-zinc-950">
      {/* Navigation Header */}
      <Header
        onOpenDocs={() => setIsDocsOpen(true)}
        onReset={handleReset}
        hasActiveImage={!!activeItem}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Global Error Banner */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-300 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Workspace State: Empty vs Active Image */}
        {!activeItem ? (
          <div className="space-y-8 max-w-4xl mx-auto py-4">
            {/* Hero / Value Proposition */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Anti-Flagging • SynthID Neutralizer • C2PA Stripper</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono">
                Neutralize Invisible Watermarks & Classifiers
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Prevent algorithmic reach-throttling and false positives on Instagram, Threads, and social platforms. Zero server uploads—executed 100% in local browser memory.
              </p>
            </div>

            {/* Dropzone & Sample Trigger */}
            <Dropzone
              onFilesSelected={handleFilesSelected}
              onSampleSelected={handleSampleSelected}
              isLoadingSample={isLoadingSample}
            />

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Module A: Header Purge</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Drops C2PA Content Credentials, Adobe XMP, EXIF, and generation prompt metadata packets.
                </p>
              </div>

              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold">
                  <EyeOff className="w-4 h-4" />
                  <span>Module B: Lattice Jitter</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Micro-rescales (±0.8%) and phase shifts pixels to shatter rigid 16×16 SynthID frequency grids.
                </p>
              </div>

              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Module C: Classifier Blur</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Injects controlled imperceptible procedural noise to disrupt neural network classifier activations.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Batch Selector if multiple images */}
            <BatchQueue
              items={items}
              activeId={activeItem.id}
              onSelectItem={(id) => setActiveItemId(id)}
              onRemoveItem={(id) => {
                setItems((prev) => prev.filter((it) => it.id !== id));
                if (activeItemId === id) {
                  const remaining = items.filter((it) => it.id !== id);
                  setActiveItemId(remaining.length > 0 ? remaining[0].id : null);
                }
              }}
              onDownloadAll={handleDownloadAll}
            />

            {/* Presets Bar */}
            <PresetSelector
              currentPreset={settings.preset}
              onSelectPreset={handleSelectPreset}
              isCustomized={isCustomized}
            />

            {/* Fine-Tune Drawer (Modules A-D) */}
            <SettingsDrawer
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onTriggerReprocess={handleTriggerReprocess}
              isProcessing={isProcessing}
            />

            {/* Visual Comparison Stage */}
            <ComparisonViewer
              item={activeItem}
              viewMode={viewMode}
              onChangeViewMode={(mode) => setViewMode(mode)}
            />

            {/* Metrics & Download Action Bar */}
            <DiagnosticsBar
              metrics={activeItem.metrics}
              onDownload={handleDownload}
              onCopyClipboard={handleCopyClipboard}
              targetFormat={settings.targetFormat}
              onChangeFormat={handleChangeFormat}
              isProcessing={isProcessing}
            />
          </div>
        )}
      </main>

      {/* Pipeline Technical Specifications Modal */}
      <TechDocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      {/* Sticky Bottom Privacy Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GhostPixel Privacy-First Client Evasion Engine • Zero Server Retention</span>
          <div className="flex items-center space-x-3 text-[11px] text-zinc-400">
            <span>HTML5 Canvas API</span>
            <span>•</span>
            <span>Sub-pixel Warping</span>
            <span>•</span>
            <span>C2PA JUMBF Purge</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
