# AI Image Resolver (GhostPixel)

> **Client-Side AI Detection Evasion, SynthID Neutralizer & C2PA Metadata Stripper**  
> 100% Privacy-First in Browser Memory • Zero Server Uploads • Zero Telemetry

An advanced, browser-native utility to neutralize invisible frequency watermarks (such as Google DeepMind's SynthID), strip C2PA Content Credentials and EXIF metadata, and disrupt neural network classifiers on AI-generated imagery.

---

## 🚀 Live Demo & Repository

- **Repository**: `ai-image-resolver`
- **GitHub Pages URL**: `https://<your-username>.github.io/ai-image-resolver/`

---

## 🛠️ How to Deploy to GitHub Pages

There are **two easy methods** to deploy this repository to GitHub Pages:

### Method 1: Automated GitHub Actions (Recommended)

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/deploy.yml`.

1. **Create the repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Name the repository: **`ai-image-resolver`**
   - Choose **Public** (required for free GitHub Pages)
   - Do **not** initialize with a README (this project already has one)

2. **Push the codebase to GitHub**:
   Run the following commands in your project terminal:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for ai-image-resolver"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ai-image-resolver.git
   git push -u origin main
   ```

3. **Enable GitHub Pages via Actions**:
   - Go to your repository on GitHub: `https://github.com/<your-username>/ai-image-resolver`
   - Click **Settings** > **Pages** (in the left sidebar)
   - Under **Build and deployment** > **Source**, select **GitHub Actions**
   - Done! On every push to `main`, GitHub Actions will automatically build and publish the website.

---

### Method 2: Manual Deployment via `gh-pages`

If you prefer to deploy directly from your local command line:

1. In your terminal, run:
   ```bash
   npm run deploy
   ```
2. In your repository on GitHub:
   - Go to **Settings** > **Pages**
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**
   - Under **Branch**, select `gh-pages` and `/ (root)`, then click **Save**.

Your application will be live at:
```
https://<your-username>.github.io/ai-image-resolver/
```

---

## 🔬 Core Architecture (Modules A–D)

1. **Module A — Hardware & Metadata Stripper**:
   - Cleans all container headers (`EXIF`, `IPTC`, `XMP`, and `C2PA` JUMBF Content Credentials) by rasterizing onto an isolated HTML5 Canvas.
2. **Module B — Scale Jittering & Sub-Pixel Phase Warping**:
   - Micro-rescaling ($\pm 0.5\%$ to $1.2\%$) breaks 16×16 and 8×8 discrete cosine transform (DCT) spatial watermark harmonics (e.g. SynthID).
3. **Module C — Procedural Noise Injection**:
   - Controlled imperceptible RGB variance ($\pm 2$ to $\pm 6$ amplitude) masks smooth diffusion probability distributions and blinds CNN / ViT classifiers.
4. **Module D — Lossy Re-encoding & Quantization Scrambler**:
   - Randomized quality parameters ($0.90$ to $0.98$) randomize quantization tables in clean JPEG, PNG, or WebP formats.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```
