export type EvasionPreset = 
  | 'social-stealth'
  | 'synthid-disruptor'
  | 'metadata-purge'
  | 'maximum-scramble'
  | 'custom-pro';

export type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export type ViewMode = 'split' | 'side-by-side' | 'diff' | 'frequency' | 'metadata';

export interface EvasionSettings {
  preset: EvasionPreset;
  // Module A: Metadata
  stripMetadata: boolean;
  // Module B: Scale Jittering & Spatial Warping
  scaleJitterPercent: number; // e.g. 0.8% (+-0.8%)
  subpixelShift: boolean;     // bilinear subpixel phase displacement
  borderCropPx: number;       // 0 to 4 px crop to break origin alignment
  // Module C: Procedural Noise Injection
  noiseIntensity: number;     // 0 to 10 (amplitude in pixel values)
  noiseType: 'uniform' | 'gaussian' | 'chroma-dominant';
  // Module D: Lossy Randomization
  lossyQualityMin: number;    // e.g. 0.92
  lossyQualityMax: number;    // e.g. 0.97
  targetFormat: OutputFormat;
  // Performance & safety
  maxDimensionCap: number;    // e.g. 4096
}

export interface MetadataAudit {
  hasExif: boolean;
  hasC2pa: boolean;
  hasXmp: boolean;
  hasIptc: boolean;
  detectedTags: string[];
  rawByteLength: number;
  verdict: 'FLAGGED' | 'NEUTRALIZED' | 'CLEAN';
}

export interface ProcessingMetrics {
  durationMs: number;
  originalSize: number;
  processedSize: number;
  originalDimensions: { width: number; height: number };
  processedDimensions: { width: number; height: number };
  psnrDb: number;        // Peak signal to noise ratio
  fidelityPercent: number; // Estimated perceptual fidelity (0-100%)
  jitterApplied: number; // actual % scale shift
  qualityApplied: number;
  noiseRms: number;
}

export interface ProcessedImageItem {
  id: string;
  name: string;
  originalBlob: Blob;
  originalUrl: string;
  originalImage: HTMLImageElement;
  metadataAudit: MetadataAudit;
  
  processedBlob: Blob | null;
  processedUrl: string | null;
  metrics: ProcessingMetrics | null;
  
  diffMapUrl: string | null;
  frequencyMapUrl: string | null;
  
  status: 'idle' | 'processing' | 'ready' | 'error';
  errorMessage?: string;
}
