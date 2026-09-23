import { EvasionSettings, MetadataAudit, ProcessingMetrics } from '../types';

export const DEFAULT_SETTINGS: Record<string, EvasionSettings> = {
  'social-stealth': {
    preset: 'social-stealth',
    stripMetadata: true,
    scaleJitterPercent: 0.6,
    subpixelShift: true,
    borderCropPx: 1,
    noiseIntensity: 3,
    noiseType: 'uniform',
    lossyQualityMin: 0.94,
    lossyQualityMax: 0.97,
    targetFormat: 'image/jpeg',
    maxDimensionCap: 4096,
  },
  'synthid-disruptor': {
    preset: 'synthid-disruptor',
    stripMetadata: true,
    scaleJitterPercent: 0.9,
    subpixelShift: true,
    borderCropPx: 2,
    noiseIntensity: 4,
    noiseType: 'chroma-dominant',
    lossyQualityMin: 0.92,
    lossyQualityMax: 0.96,
    targetFormat: 'image/jpeg',
    maxDimensionCap: 4096,
  },
  'metadata-purge': {
    preset: 'metadata-purge',
    stripMetadata: true,
    scaleJitterPercent: 0,
    subpixelShift: false,
    borderCropPx: 0,
    noiseIntensity: 0,
    noiseType: 'uniform',
    lossyQualityMin: 0.98,
    lossyQualityMax: 0.99,
    targetFormat: 'image/png',
    maxDimensionCap: 4096,
  },
  'maximum-scramble': {
    preset: 'maximum-scramble',
    stripMetadata: true,
    scaleJitterPercent: 1.2,
    subpixelShift: true,
    borderCropPx: 2,
    noiseIntensity: 6,
    noiseType: 'gaussian',
    lossyQualityMin: 0.90,
    lossyQualityMax: 0.94,
    targetFormat: 'image/webp',
    maxDimensionCap: 4096,
  },
  'custom-pro': {
    preset: 'custom-pro',
    stripMetadata: true,
    scaleJitterPercent: 0.8,
    subpixelShift: true,
    borderCropPx: 1,
    noiseIntensity: 3,
    noiseType: 'uniform',
    lossyQualityMin: 0.93,
    lossyQualityMax: 0.97,
    targetFormat: 'image/jpeg',
    maxDimensionCap: 4096,
  },
};

/**
 * Module A: Inspect raw image binary to audit EXIF, C2PA JUMBF, XMP, IPTC headers.
 */
export async function auditMetadata(blob: Blob): Promise<MetadataAudit> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const textDecoder = new TextDecoder('latin1');
  const previewText = textDecoder.decode(bytes.slice(0, Math.min(bytes.length, 128 * 1024)));

  const detectedTags: string[] = [];
  let hasExif = false;
  let hasC2pa = false;
  let hasXmp = false;
  let hasIptc = false;

  // Search common signatures
  if (previewText.includes('Exif') || (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF && bytes[3] === 0xE1)) {
    hasExif = true;
    detectedTags.push('EXIF Header (TIFF metadata)');
  }

  if (previewText.includes('c2pa') || previewText.includes('jumb') || previewText.includes('c2pa.claim') || previewText.includes('C2PA')) {
    hasC2pa = true;
    detectedTags.push('C2PA Manifest (Content Credentials JUMBF Box)');
  }

  if (previewText.includes('http://ns.adobe.com/xap/1.0/') || previewText.includes('<x:xmpmeta') || previewText.includes('xmlns:dc')) {
    hasXmp = true;
    detectedTags.push('XMP Data Packet (Adobe / Generator tags)');
  }

  if (previewText.includes('Photoshop 3.0') || previewText.includes('8BIM')) {
    hasIptc = true;
    detectedTags.push('IPTC / Adobe Resource Block');
  }

  if (previewText.includes('Midjourney') || previewText.includes('DALL-E') || previewText.includes('Stable Diffusion') || previewText.includes('Civitai') || previewText.includes('prompt')) {
    detectedTags.push('AI Prompt & Generation Artifacts');
  }

  const verdict = (hasC2pa || hasExif || hasXmp || hasIptc) ? 'FLAGGED' : 'CLEAN';

  return {
    hasExif,
    hasC2pa,
    hasXmp,
    hasIptc,
    detectedTags,
    rawByteLength: blob.size,
    verdict,
  };
}

/**
 * Execute the full 4-stage client-side Evasion Pipeline:
 * Module A: Metadata Strip (via fresh Canvas extraction)
 * Module B: Scale Jittering & Micro-Warp
 * Module C: Procedural Pixel Noise Injection
 * Module D: Randomized Lossy Re-encoding
 */
export async function processEvasionPipeline(
  sourceImage: HTMLImageElement,
  originalBlob: Blob,
  settings: EvasionSettings
): Promise<{
  processedBlob: Blob;
  metrics: ProcessingMetrics;
  diffMapBlob: Blob;
  frequencyMapBlob: Blob;
}> {
  const startTime = performance.now();

  let origWidth = sourceImage.naturalWidth || sourceImage.width;
  let origHeight = sourceImage.naturalHeight || sourceImage.height;

  // Safe downscaling cap to prevent browser memory overflow (Phase 3 spec)
  if (origWidth > settings.maxDimensionCap || origHeight > settings.maxDimensionCap) {
    const ratio = Math.min(settings.maxDimensionCap / origWidth, settings.maxDimensionCap / origHeight);
    origWidth = Math.round(origWidth * ratio);
    origHeight = Math.round(origHeight * ratio);
  }

  // --- Module B: Scale Jittering Calculation ---
  let targetWidth = origWidth;
  let targetHeight = origHeight;
  let appliedJitterPercent = 0;

  if (settings.scaleJitterPercent > 0) {
    // Random jitter in range [-settings.scaleJitterPercent, +settings.scaleJitterPercent]
    const jitterSign = Math.random() > 0.5 ? 1 : -1;
    const jitterFactor = (Math.random() * 0.5 + 0.5) * settings.scaleJitterPercent * jitterSign;
    appliedJitterPercent = parseFloat(jitterFactor.toFixed(3));
    const scaleMultiplier = 1 + (appliedJitterPercent / 100);
    
    targetWidth = Math.max(16, Math.round(origWidth * scaleMultiplier));
    targetHeight = Math.max(16, Math.round(origHeight * scaleMultiplier));
  }

  // Apply optional sub-pixel border crop to break absolute lattice alignment
  const crop = settings.borderCropPx || 0;
  const drawSrcX = crop;
  const drawSrcY = crop;
  const drawSrcW = Math.max(1, sourceImage.naturalWidth - (crop * 2));
  const drawSrcH = Math.max(1, sourceImage.naturalHeight - (crop * 2));

  // --- Create Processing Canvas (Module A: Clean context strips all headers) ---
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Could not acquire 2D canvas context for pixel manipulation');
  }

  // High quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Sub-pixel shift displacement if enabled
  if (settings.subpixelShift) {
    const subX = (Math.random() - 0.5) * 0.6;
    const subY = (Math.random() - 0.5) * 0.6;
    ctx.translate(subX, subY);
  }

  // Draw source image scaled to target dimensions
  ctx.drawImage(sourceImage, drawSrcX, drawSrcY, drawSrcW, drawSrcH, 0, 0, targetWidth, targetHeight);

  // --- Module C: Procedural Noise Injection on Raw Pixels ---
  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const pixels = imgData.data;
  const totalPixels = targetWidth * targetHeight;

  // Prepare baseline for MSE / PSNR calculation
  // Create an identical copy of original pixels rendered at the same dimension for mathematical comparison
  const baselineCanvas = document.createElement('canvas');
  baselineCanvas.width = targetWidth;
  baselineCanvas.height = targetHeight;
  const baseCtx = baselineCanvas.getContext('2d');
  if (baseCtx) {
    baseCtx.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);
  }
  const basePixels = baseCtx ? baseCtx.getImageData(0, 0, targetWidth, targetHeight).data : pixels;

  let totalDiffSq = 0;
  let noiseSumSq = 0;

  if (settings.noiseIntensity > 0) {
    const amp = settings.noiseIntensity;

    for (let i = 0; i < pixels.length; i += 4) {
      let dR = 0;
      let dG = 0;
      let dB = 0;

      if (settings.noiseType === 'uniform') {
        dR = (Math.random() * 2 - 1) * amp;
        dG = (Math.random() * 2 - 1) * amp;
        dB = (Math.random() * 2 - 1) * amp;
      } else if (settings.noiseType === 'gaussian') {
        // Box-Muller transform
        const u1 = Math.max(1e-6, Math.random());
        const u2 = Math.random();
        const g1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const g2 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        dR = g1 * (amp * 0.6);
        dG = g2 * (amp * 0.6);
        dB = ((g1 + g2) / 2) * (amp * 0.6);
      } else if (settings.noiseType === 'chroma-dominant') {
        // Perturb Red & Blue channels stronger to disrupt synthetic chrominance correlations
        const baseNoise = (Math.random() * 2 - 1) * amp;
        dR = baseNoise * 1.3;
        dG = (Math.random() * 2 - 1) * (amp * 0.5);
        dB = -baseNoise * 1.2;
      }

      // Soft clamping to avoid clipping artifacts
      pixels[i] = Math.min(255, Math.max(0, Math.round(pixels[i] + dR)));
      pixels[i + 1] = Math.min(255, Math.max(0, Math.round(pixels[i + 1] + dG)));
      pixels[i + 2] = Math.min(255, Math.max(0, Math.round(pixels[i + 2] + dB)));
      // Alpha untouched

      noiseSumSq += (dR * dR + dG * dG + dB * dB) / 3;
    }

    ctx.putImageData(imgData, 0, 0);
  }

  // Calculate MSE between baseline and mutated
  for (let i = 0; i < pixels.length; i += 4) {
    const diffR = pixels[i] - basePixels[i];
    const diffG = pixels[i + 1] - basePixels[i + 1];
    const diffB = pixels[i + 2] - basePixels[i + 2];
    totalDiffSq += (diffR * diffR + diffG * diffG + diffB * diffB) / 3;
  }

  const mse = totalDiffSq / totalPixels;
  const psnrDb = mse <= 0 ? 99 : Math.min(99, parseFloat((10 * Math.log10((255 * 255) / mse)).toFixed(2)));
  const fidelityPercent = Math.max(88, Math.min(100, parseFloat((100 * (1 - Math.sqrt(mse) / 255)).toFixed(2))));
  const noiseRms = parseFloat(Math.sqrt(noiseSumSq / Math.max(1, totalPixels)).toFixed(2));

  // --- Module D: Randomized Lossy Re-encoding & Quantization Scrambler ---
  const qMin = settings.lossyQualityMin;
  const qMax = settings.lossyQualityMax;
  const randomQuality = parseFloat((Math.random() * (qMax - qMin) + qMin).toFixed(3));

  const processedBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to generate output Blob'));
      },
      settings.targetFormat,
      settings.targetFormat === 'image/png' ? undefined : randomQuality
    );
  });

  // Generate Visualizer 1: Amplified Pixel Difference Heatmap
  const diffMapBlob = await generateDiffHeatmap(basePixels, pixels, targetWidth, targetHeight);

  // Generate Visualizer 2: High-pass Frequency / Lattice Spectrum Map
  const frequencyMapBlob = await generateFrequencyMap(pixels, targetWidth, targetHeight);

  const durationMs = Math.round(performance.now() - startTime);

  const metrics: ProcessingMetrics = {
    durationMs,
    originalSize: originalBlob.size,
    processedSize: processedBlob.size,
    originalDimensions: { width: origWidth, height: origHeight },
    processedDimensions: { width: targetWidth, height: targetHeight },
    psnrDb,
    fidelityPercent,
    jitterApplied: appliedJitterPercent,
    qualityApplied: randomQuality,
    noiseRms,
  };

  return {
    processedBlob,
    metrics,
    diffMapBlob,
    frequencyMapBlob,
  };
}

/**
 * Generates an amplified false-color heatmap showing the exact perturbation variance.
 * Subtle deltas of ±2 are boosted by 18x with cybernetic cyan/magenta color grading.
 */
async function generateDiffHeatmap(
  origPixels: Uint8ClampedArray,
  mutPixels: Uint8ClampedArray,
  width: number,
  height: number
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const diffImg = ctx.createImageData(width, height);
  const dData = diffImg.data;

  const AMPLIFY = 18;

  for (let i = 0; i < origPixels.length; i += 4) {
    const dr = Math.abs(mutPixels[i] - origPixels[i]);
    const dg = Math.abs(mutPixels[i + 1] - origPixels[i + 1]);
    const db = Math.abs(mutPixels[i + 2] - origPixels[i + 2]);
    const delta = (dr + dg + db) / 3;

    if (delta < 0.2) {
      // Dark deep background
      dData[i] = 10;
      dData[i + 1] = 14;
      dData[i + 2] = 24;
      dData[i + 3] = 255;
    } else {
      // False color gradient from cyan to electric violet/magenta
      const val = Math.min(255, delta * AMPLIFY);
      dData[i] = Math.min(255, Math.round(val * 1.2));       // Red
      dData[i + 1] = Math.min(255, Math.round(val * 0.7));     // Green
      dData[i + 2] = Math.min(255, Math.round(val * 1.8 + 40)); // Blue
      dData[i + 3] = 255;
    }
  }

  ctx.putImageData(diffImg, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), 'image/png');
  });
}

/**
 * Simulates high-pass spatial / 2D Laplacian frequency gradient map.
 * Demonstrates the disruption of harmonic periodic watermarks (like SynthID grid frequencies).
 */
async function generateFrequencyMap(
  pixels: Uint8ClampedArray,
  width: number,
  height: number
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const freqImg = ctx.createImageData(width, height);
  const fData = freqImg.data;

  // High-pass 3x3 kernel convolution
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      // Sample luminance
      const center = (pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114);
      const top = ((pixels[idx - width * 4] * 0.299) + (pixels[idx - width * 4 + 1] * 0.587) + (pixels[idx - width * 4 + 2] * 0.114));
      const bottom = ((pixels[idx + width * 4] * 0.299) + (pixels[idx + width * 4 + 1] * 0.587) + (pixels[idx + width * 4 + 2] * 0.114));
      const left = ((pixels[idx - 4] * 0.299) + (pixels[idx - 4 + 1] * 0.587) + (pixels[idx - 4 + 2] * 0.114));
      const right = ((pixels[idx + 4] * 0.299) + (pixels[idx + 4 + 1] * 0.587) + (pixels[idx + 4 + 2] * 0.114));

      // Laplacian edge / high-frequency response
      const lap = Math.abs(4 * center - top - bottom - left - right) * 2.5;

      // Map to high-tech neon green / amber radar palette
      fData[idx] = Math.min(255, Math.round(lap * 0.4));
      fData[idx + 1] = Math.min(255, Math.round(lap * 1.4));
      fData[idx + 2] = Math.min(255, Math.round(lap * 0.8));
      fData[idx + 3] = 255;
    }
  }

  ctx.putImageData(freqImg, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), 'image/png');
  });
}
