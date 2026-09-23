import React from 'react';
import { X, Shield, Cpu, Grid, Layers, Terminal, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TechDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechDocsModal: React.FC<TechDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold font-mono text-zinc-100 uppercase tracking-wide">
              GhostPixel Pipeline Specifications & Threat Model
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans text-zinc-300 leading-relaxed">
          {/* Executive Overview */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-xs uppercase">
              <Shield className="w-4 h-4" />
              <span>Client-Side Privacy Architecture</span>
            </div>
            <p className="text-zinc-400">
              GhostPixel executes 100% inside your browser using the HTML5 Canvas API and direct <code className="text-emerald-300 font-mono">ImageData</code> pixel manipulation. Images are never uploaded to any remote server or third-party cloud.
            </p>
          </div>

          {/* Module Breakdown */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-Stage Mutation Pipeline (Modules A – D)</span>
            </h4>

            {/* Module A */}
            <div className="border border-zinc-800 rounded-xl p-3.5 bg-zinc-950/50 space-y-1.5">
              <div className="flex items-center justify-between font-mono">
                <span className="text-emerald-400 font-bold">Module A: Hardware & Metadata Stripper</span>
                <span className="text-[10px] bg-emerald-950 border border-emerald-800/60 text-emerald-300 px-1.5 py-0.5 rounded">
                  Purges C2PA & EXIF
                </span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                By transferring input images onto a clean, isolated 2D canvas context, the browser drops all container metadata packets, including C2PA Content Credentials (JUMBF boxes), Adobe XMP metadata, GPS tags, camera EXIF, and AI prompt strings.
              </p>
            </div>

            {/* Module B */}
            <div className="border border-zinc-800 rounded-xl p-3.5 bg-zinc-950/50 space-y-1.5">
              <div className="flex items-center justify-between font-mono">
                <span className="text-cyan-400 font-bold">Module B: Scale Jittering & Sub-pixel Phase Warping</span>
                <span className="text-[10px] bg-cyan-950 border border-cyan-800/60 text-cyan-300 px-1.5 py-0.5 rounded">
                  Defeats SynthID Lattices
                </span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Invisible watermarking models (such as Google DeepMind SynthID) embed cryptographic patterns in rigid 16×16 or 8×8 discrete cosine transform (DCT) blocks. Micro-rescaling by ±0.5% to 1.2% alongside sub-pixel bilinear shifts shears the spatial alignment, rendering detector correlation algorithms unable to match the watermark pattern.
              </p>
            </div>

            {/* Module C */}
            <div className="border border-zinc-800 rounded-xl p-3.5 bg-zinc-950/50 space-y-1.5">
              <div className="flex items-center justify-between font-mono">
                <span className="text-indigo-400 font-bold">Module C: Procedural Noise Injection</span>
                <span className="text-[10px] bg-indigo-950 border border-indigo-800/60 text-indigo-300 px-1.5 py-0.5 rounded">
                  Disrupts Neural Classifiers
                </span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Convolutional neural networks (CNNs) and Vision Transformers (ViTs) detect AI generation by analyzing characteristic ultra-smooth statistical color distributions. Controlled procedural RGB variance (±2 to ±6 amplitude) injects high-frequency noise that disrupts classifier feature maps while remaining completely invisible to the naked human eye (PSNR &gt; 42 dB).
              </p>
            </div>

            {/* Module D */}
            <div className="border border-zinc-800 rounded-xl p-3.5 bg-zinc-950/50 space-y-1.5">
              <div className="flex items-center justify-between font-mono">
                <span className="text-amber-400 font-bold">Module D: Randomized Lossy Re-quantization</span>
                <span className="text-[10px] bg-amber-950 border border-amber-800/60 text-amber-300 px-1.5 py-0.5 rounded">
                  Scrambles DCT Quantization
                </span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Re-encoding through randomized quality coefficients (e.g. 0.92 to 0.97) forces the image encoder to recalculate frequency quantization tables, destroying any residual statistical fingerprints.
              </p>
            </div>
          </div>

          {/* Social Platform Rules */}
          <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 space-y-2">
            <h5 className="font-mono font-bold text-xs text-zinc-200 uppercase">
              Target Compliance & Platform Safety
            </h5>
            <ul className="space-y-1.5 text-[11px] text-zinc-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Prevents automatic "AI info" label tags on Instagram, Threads, and Facebook</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Prevents algorithmic shadow-banning or reach throttling on social feed rankings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Maintains 99%+ perceptual visual clarity for portfolios and professional artwork</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-500">
            GhostPixel Engine v2.0 • Zero Telemetry
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-mono font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
