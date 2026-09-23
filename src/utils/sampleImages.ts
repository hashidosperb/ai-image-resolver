export interface SampleItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  generate: () => Promise<Blob>;
}

export const SAMPLE_IMAGES: SampleItem[] = [
  {
    id: 'sample-ai-portrait',
    name: 'Midjourney v6 Portrait',
    subtitle: 'Simulated SynthID & High-Frequency Lattice',
    category: 'Portrait',
    generate: () => createSyntheticPortraitBlob(),
  },
  {
    id: 'sample-ai-landscape',
    name: 'Flux Cyber-Cityscape',
    subtitle: 'Sharp Architectural Gradients & C2PA Block',
    category: 'Landscape',
    generate: () => createSyntheticCityscapeBlob(),
  },
  {
    id: 'sample-ai-macro',
    name: 'DALL-E 3 Bioluminescence',
    subtitle: 'Smooth Color Transitions & Diffusion Noise',
    category: 'Macro',
    generate: () => createSyntheticMacroBlob(),
  },
];

/**
 * Creates a synthetic high-resolution artistic portrait with simulated subtle invisible watermark grid
 */
async function createSyntheticPortraitBlob(): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const w = 900;
  const h = 900;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Dark studio backdrop with gradient lighting
  const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 80, w * 0.5, h * 0.5, w * 0.7);
  bgGrad.addColorStop(0, '#2e1c38');
  bgGrad.addColorStop(0.5, '#161024');
  bgGrad.addColorStop(1, '#0b0814');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Soft rim light accents
  const rimGrad = ctx.createLinearGradient(0, 0, w, h);
  rimGrad.addColorStop(0, 'rgba(255, 107, 107, 0.25)');
  rimGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
  rimGrad.addColorStop(1, 'rgba(78, 205, 196, 0.25)');
  ctx.fillStyle = rimGrad;
  ctx.fillRect(0, 0, w, h);

  // Stylized portrait silhouette & facial geometry
  ctx.save();
  // Face oval
  const faceGrad = ctx.createRadialGradient(w * 0.5, h * 0.46, 30, w * 0.5, h * 0.46, 220);
  faceGrad.addColorStop(0, '#f2d6c1');
  faceGrad.addColorStop(0.6, '#d9a98e');
  faceGrad.addColorStop(0.9, '#a66b56');
  faceGrad.addColorStop(1, '#5a342b');
  ctx.fillStyle = faceGrad;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.48, 170, 230, 0, 0, Math.PI * 2);
  ctx.fill();

  // Neck & shoulders
  ctx.beginPath();
  ctx.moveTo(w * 0.38, h * 0.65);
  ctx.lineTo(w * 0.2, h * 0.95);
  ctx.lineTo(w * 0.8, h * 0.95);
  ctx.lineTo(w * 0.62, h * 0.65);
  ctx.closePath();
  ctx.fillStyle = '#22142d';
  ctx.fill();

  // Hair halo
  ctx.fillStyle = '#1c0f20';
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.42, 210, Math.PI * 0.75, Math.PI * 2.25);
  ctx.fill();

  // Eyes with cinematic highlights
  drawEye(ctx, w * 0.42, h * 0.46);
  drawEye(ctx, w * 0.58, h * 0.46);

  // Nose bridge
  ctx.strokeStyle = 'rgba(120, 60, 45, 0.4)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.45);
  ctx.lineTo(w * 0.49, h * 0.53);
  ctx.lineTo(w * 0.52, h * 0.54);
  ctx.stroke();

  // Lips
  const lipGrad = ctx.createLinearGradient(w * 0.44, h * 0.6, w * 0.56, h * 0.6);
  lipGrad.addColorStop(0, '#a9435b');
  lipGrad.addColorStop(0.5, '#c9546d');
  lipGrad.addColorStop(1, '#9b3951');
  ctx.fillStyle = lipGrad;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.6, 38, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Simulated AI SynthID Watermark Lattice (invisible periodic 16x16 subtle tile perturbation)
  injectSimulatedSynthIDGrid(ctx, w, h);

  // Simulated AI studio metadata overlay (burned into test header string)
  return canvasToBlobWithSimulatedMetadata(canvas, 'image/jpeg', 0.96, 'Midjourney v6.0 / SynthID Watermarked');
}

function drawEye(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  // Eye white
  ctx.fillStyle = '#f8f4f0';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 26, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Iris
  const irisGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 14);
  irisGrad.addColorStop(0, '#00d2d3');
  irisGrad.addColorStop(0.7, '#10ac84');
  irisGrad.addColorStop(1, '#065242');
  ctx.fillStyle = irisGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();

  // Pupil
  ctx.fillStyle = '#0a0a0f';
  ctx.beginPath();
  ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Specular reflection
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - 3, cy - 3, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Creates a synthetic futuristic cityscape image
 */
async function createSyntheticCityscapeBlob(): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const w = 1200;
  const h = 675;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Cyberpunk skyline gradient
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#050510');
  sky.addColorStop(0.4, '#1b092b');
  sky.addColorStop(0.7, '#421447');
  sky.addColorStop(0.95, '#0b162c');
  sky.addColorStop(1, '#030814');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Distant glowing mega-structures
  const buildings = [
    { x: 60, w: 110, h: 420, color: '#0f172a', neon: '#38bdf8' },
    { x: 190, w: 140, h: 510, color: '#111827', neon: '#ec4899' },
    { x: 350, w: 90, h: 360, color: '#0b0f19', neon: '#a855f7' },
    { x: 460, w: 160, h: 580, color: '#131b2e', neon: '#06b6d4' },
    { x: 640, w: 120, h: 460, color: '#0f172a', neon: '#f43f5e' },
    { x: 780, w: 150, h: 540, color: '#1e1b4b', neon: '#3b82f6' },
    { x: 950, w: 170, h: 390, color: '#111827', neon: '#10b981' },
  ];

  buildings.forEach((b) => {
    const by = h - b.h;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, by, b.w, b.h);

    // Neon accent edge
    ctx.strokeStyle = b.neon;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(b.x + b.w, by);
    ctx.lineTo(b.x + b.w, h);
    ctx.stroke();

    // Random illuminated windows
    ctx.fillStyle = 'rgba(255, 230, 160, 0.75)';
    for (let r = by + 20; r < h - 40; r += 24) {
      for (let c = b.x + 10; c < b.x + b.w - 15; c += 18) {
        if ((r * 13 + c * 7) % 5 === 0) {
          ctx.fillRect(c, r, 7, 10);
        }
      }
    }
  });

  // Wet reflective ground plane
  const groundGrad = ctx.createLinearGradient(0, h * 0.78, 0, h);
  groundGrad.addColorStop(0, 'rgba(8, 14, 30, 0.85)');
  groundGrad.addColorStop(1, '#020617');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, h * 0.78, w, h * 0.22);

  // Reflections
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.fillRect(200, h * 0.82, 120, h * 0.15);
  ctx.fillStyle = 'rgba(236, 72, 153, 0.18)';
  ctx.fillRect(480, h * 0.82, 140, h * 0.15);

  injectSimulatedSynthIDGrid(ctx, w, h);

  return canvasToBlobWithSimulatedMetadata(canvas, 'image/jpeg', 0.95, 'Flux.1-dev / C2PA Manifest Included');
}

/**
 * Creates a synthetic macro bioluminescent organism image
 */
async function createSyntheticMacroBlob(): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const w = 960;
  const h = 960;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Deep underwater abyss
  ctx.fillStyle = '#020b14';
  ctx.fillRect(0, 0, w, h);

  // Bioluminescent radial blooms
  const blooms = [
    { x: w * 0.48, y: h * 0.5, r: 240, color1: '#00f2fe', color2: '#4facfe' },
    { x: w * 0.38, y: h * 0.42, r: 120, color1: '#fa709a', color2: '#fee140' },
    { x: w * 0.62, y: h * 0.6, r: 160, color1: '#30cfd0', color2: '#330867' },
  ];

  blooms.forEach((b) => {
    const rad = ctx.createRadialGradient(b.x, b.y, 5, b.x, b.y, b.r);
    rad.addColorStop(0, b.color1);
    rad.addColorStop(0.4, b.color2);
    rad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Delicate ethereal filament tentacles
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    const len = 200 + (i % 5) * 40;
    ctx.strokeStyle = `hsla(${180 + i * 4}, 90%, 70%, 0.4)`;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.5);
    const cpX = w * 0.5 + Math.cos(angle + 0.5) * (len * 0.6);
    const cpY = h * 0.5 + Math.sin(angle + 0.5) * (len * 0.6);
    const destX = w * 0.5 + Math.cos(angle) * len;
    const destY = h * 0.5 + Math.sin(angle) * len;
    ctx.quadraticCurveTo(cpX, cpY, destX, destY);
    ctx.stroke();
  }

  injectSimulatedSynthIDGrid(ctx, w, h);

  return canvasToBlobWithSimulatedMetadata(canvas, 'image/jpeg', 0.94, 'DALL-E 3 / OpenAI Content Credentials');
}

/**
 * Injects a very subtle periodic lattice pattern into the image data to simulate SynthID's
 * high-frequency mathematical watermark.
 */
function injectSimulatedSynthIDGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const TILE_SIZE = 16;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Sine harmonic carrier wave characteristic of watermarking algorithms
      const wave = Math.sin((x / TILE_SIZE) * Math.PI * 2) * Math.cos((y / TILE_SIZE) * Math.PI * 2);
      // Imperceptible amplitude (+-1 to 2)
      const delta = Math.round(wave * 2);

      const idx = (y * width + x) * 4;
      data[idx] = Math.min(255, Math.max(0, data[idx] + delta));
      data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] - delta));
      data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + delta));
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Encodes canvas to blob and prepends synthetic EXIF & C2PA header byte chunks
 * so the metadata scanner detects the presence of flags.
 */
async function canvasToBlobWithSimulatedMetadata(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number,
  label: string
): Promise<Blob> {
  const rawBlob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), format, quality);
  });

  const rawBuffer = await rawBlob.arrayBuffer();

  // Construct synthetic EXIF + C2PA header packet
  const dummyMetadataText = `Exif\x00\x00MM\x00*<x:xmpmeta xmlns:x="adobe:ns:meta/"><c2pa xmlns="c2pa.org"><claim>${label}</claim><generator>Midjourney/DALL-E/StableDiffusion</generator></c2pa></x:xmpmeta>`;
  const enc = new TextEncoder();
  const metaBytes = enc.encode(dummyMetadataText);

  // Combine: JPEG SOI (2 bytes) + APP1 marker (2 bytes) + length (2 bytes) + metaBytes + remaining raw image
  const combined = new Uint8Array(rawBuffer.byteLength + metaBytes.length + 10);
  const rawBytes = new Uint8Array(rawBuffer);

  // Copy SOI (0xFF, 0xD8)
  combined[0] = 0xFF;
  combined[1] = 0xD8;
  // APP1 marker (0xFF, 0xE1)
  combined[2] = 0xFF;
  combined[3] = 0xE1;
  const len = metaBytes.length + 2;
  combined[4] = (len >> 8) & 0xFF;
  combined[5] = len & 0xFF;
  // Copy metaBytes
  combined.set(metaBytes, 6);
  // Copy rest of image (skipping first 2 bytes if SOI)
  const offset = 6 + metaBytes.length;
  combined.set(rawBytes.slice(2), offset);

  return new Blob([combined], { type: format });
}
