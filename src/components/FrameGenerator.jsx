import React, { useState, useRef, useEffect } from 'react';
import EasyCrop from 'react-easy-crop';
import { Upload, ImageIcon, Sparkles, User, Briefcase, RefreshCw, Loader2, Download, ArrowRight, Share2, RotateCcw, AlertTriangle, X, Plus } from 'lucide-react';
import { drawFormatA, drawFormatB } from '../canvas/canvasEngine';
import { getFunTitle } from '../data/builderTitles';
import { uploadFrame } from './supabase';
import mainFrameImg from '../assets/main frame.png';
import craiyonFrameImg from '../assets/craiyon_182021_image.png';
import symbolImg from '../assets/symbol.png';

// ─── Error copy ─────────────────────────────────────────────────────────────
const ERROR_MESSAGES = {
  // Upload / file selection errors
  UNSUPPORTED_TYPE:    "That file type isn't supported. Please upload a JPG, PNG, or HEIC photo.",
  FILE_TOO_LARGE:      (mb) => `That file is ${mb} MB — a bit too big. Please upload a photo under 20 MB.`,
  INVALID_IMAGE:       "We couldn't read that image. It may be corrupted — try saving it as a JPG or PNG and uploading again.",
  HEIC_FAILED:         "Couldn't convert your iPhone photo (HEIC). Try exporting it as a JPG from your Photos app first.",
  // Canvas / generation errors
  CANVAS_NOT_READY:    "Your photo hasn't loaded into the editor yet. Try adjusting the crop slightly, then generate again.",
  CANVAS_RENDER_FAIL:  "We hit a snag while drawing your card. Try a different photo or refresh the page and try again.",
  // Supabase / network errors
  NOT_CONFIGURED:      null, // handled silently — fallback to text-only X share
  NETWORK_FAILURE:     "You appear to be offline. Check your internet connection, then try sharing again.",
  UPLOAD_FAILED:       "Your card couldn't be saved to our servers right now. Your download still works — try sharing again in a moment.",
  // Generic share failure
  SHARE_FAILED:        "Opening X failed. Try copying the download and posting it manually.",
};

// ─── Reusable inline error banner ───────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div role="alert" aria-live="assertive" className="mt-3 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
      <p className="text-xs font-semibold text-red-700 leading-snug flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="text-red-400 hover:text-red-600 transition-colors cursor-pointer flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 rounded"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

const ROLES = [
  { id: 'frontend', label: 'Frontend Engineer' },
  { id: 'backend', label: 'Backend Engineer' },
  { id: 'ai', label: 'AI Engineer' },
  { id: 'design', label: 'Designer / UI/UX' },
  { id: 'smart_contracts', label: 'Smart Contract Dev' },
  { id: 'other', label: 'General Builder' },
];

// Helper to convert base64 DataURL to Blob
function dataURLToBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export default function FrameGenerator() {
  const [format, setFormat] = useState('a'); // 'a' = PFP, 'b' = ID Card
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  // Scoped error states
  const [uploadError, setUploadError]   = useState(null); // file selection / HEIC
  const [generateError, setGenerateError] = useState(null); // canvas render
  const [shareError, setShareError]     = useState(null); // Supabase / network / X
  
  // Crop States
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Form states for Format B
  const [name, setName] = useState('');
  const [role, setRole] = useState('frontend');
  const [customTitle, setCustomTitle] = useState('Pixel perfectionist');

  // Canvas Refs
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [imgElement, setImgElement] = useState(null);
  const [templateImgElement, setTemplateImgElement] = useState(null);
  const [templateAImgElement, setTemplateAImgElement] = useState(null);
  const [symbolImgElement, setSymbolImgElement] = useState(null);

  // Pre-load main frame template image for Format B
  useEffect(() => {
    const img = new Image();
    img.src = mainFrameImg;
    img.onload = () => {
      setTemplateImgElement(img);
    };
  }, []);

  // Pre-load Format A PFP frame template image
  useEffect(() => {
    const img = new Image();
    img.src = craiyonFrameImg;
    img.onload = () => {
      setTemplateAImgElement(img);
    };
  }, []);

  // Pre-load symbol image for Format B
  useEffect(() => {
    const img = new Image();
    img.src = symbolImg;
    img.onload = () => {
      setSymbolImgElement(img);
    };
  }, []);

  // Max file size: 20MB
  const MAX_FILE_SIZE_MB = 20;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  // Load uploaded image element
  useEffect(() => {
    if (!imageSrc) {
      setImgElement(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      setImgElement(img);
    };
  }, [imageSrc]);

  // Set fun title whenever role changes
  useEffect(() => {
    const roleLabel = ROLES.find(r => r.id === role)?.label || 'Builder';
    setCustomTitle(getFunTitle(roleLabel));
  }, [role]);

  // Re-draw Live Canvas Preview (In Edit/Crop Mode)
  useEffect(() => {
    if (!canvasRef.current || !imgElement || resultImage) return;

    const draw = async () => {
      if (format === 'a') {
        drawFormatA(canvasRef.current, { 
          image: imgElement, 
          crop: croppedAreaPixels,
          templateImage: templateAImgElement
        });
      } else {
        const roleLabel = ROLES.find(r => r.id === role)?.label || 'Builder';
        drawFormatB(canvasRef.current, { 
          image: imgElement, 
          crop: croppedAreaPixels, 
          name: name || 'Arjun Sharma', 
          role: roleLabel, 
          builderTitle: customTitle,
          templateImage: templateImgElement,
          symbolImage: symbolImgElement
        });
      }
    };

    draw();
  }, [format, imgElement, croppedAreaPixels, name, role, customTitle, resultImage, templateImgElement, templateAImgElement, symbolImgElement]);

  // Handle file uploads (including HEIC) — shared by all input methods
  const processFile = async (file) => {
    if (!file) return;
    setUploadError(null);

    // ① Unsupported file type
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    const isHeic  = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
    if (!allowed.includes(file.type) && !isHeic) {
      setUploadError(ERROR_MESSAGES.UNSUPPORTED_TYPE);
      return;
    }

    // ② File too large
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(ERROR_MESSAGES.FILE_TOO_LARGE((file.size / 1024 / 1024).toFixed(1)));
      return;
    }

    setLoading(true);
    try {
      let processedFile = file;

      // ③ HEIC → JPEG conversion
      if (file.type === 'image/heic' || file.type === 'image/heif' || isHeic) {
        try {
          const heic2any = (await import('heic2any')).default;
          const convertedBlob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 });
          processedFile = new File(
            [convertedBlob],
            file.name.replace(/\.[^/.]+$/, '.jpg'),
            { type: 'image/jpeg' }
          );
        } catch (heicErr) {
          console.error('HEIC conversion failed:', heicErr);
          setUploadError(ERROR_MESSAGES.HEIC_FAILED);
          setLoading(false);
          return;
        }
      }

      // ④ Invalid / unreadable image
      const reader = new FileReader();
      reader.onerror = () => {
        setUploadError(ERROR_MESSAGES.INVALID_IMAGE);
        setLoading(false);
      };
      reader.onload = (e) => {
        // Sanity-check: make sure the result is a real data URL
        if (!e.target.result || !e.target.result.startsWith('data:image')) {
          setUploadError(ERROR_MESSAGES.INVALID_IMAGE);
          setLoading(false);
          return;
        }
        setImageSrc(e.target.result);
        setLoading(false);
      };
      reader.readAsDataURL(processedFile);
    } catch (err) {
      console.error('Error processing image:', err);
      setUploadError(ERROR_MESSAGES.INVALID_IMAGE);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => processFile(e.target.files?.[0]);

  // Drag-and-drop handlers
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // ⑤ Generate Image Flow: canvas render → result
  const handleGenerate = () => {
    setGenerateError(null);

    // ⑤a Canvas not ready (image hasn't loaded yet)
    if (!canvasRef.current || !imgElement) {
      setGenerateError(ERROR_MESSAGES.CANVAS_NOT_READY);
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      try {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        // Sanity-check: toDataURL returns 'data:,' on an empty canvas in some mobile browsers
        if (!dataUrl || dataUrl === 'data:,') {
          throw new Error('Canvas produced an empty result.');
        }
        setResultImage(dataUrl);
        setGenerating(false);
      } catch (err) {
        // ⑤b Canvas render failure (SecurityError, mobile quirk, etc.)
        console.error('Canvas render failed:', err);
        setGenerateError(ERROR_MESSAGES.CANVAS_RENDER_FAIL);
        setGenerating(false);
      }
    }, 800);
  };

  const handleDownload = () => {
    if (!resultImage) return;
    try {
      const blob = dataURLToBlob(resultImage);
      const fileName = format === 'a' ? 'HH-Goa-2026-Frame.png' : 'HH-Goa-2026-Builder-Card.png';
      const file = new File([blob], fileName, { type: 'image/png' });
      // Append the filename as a hash to the Object URL to force Chrome/Edge to preserve the extension
      const url = URL.createObjectURL(file) + `#${fileName}`;
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up after download triggers
      setTimeout(() => {
        const cleanUrl = url.split('#')[0];
        URL.revokeObjectURL(cleanUrl);
      }, 500);
    } catch (err) {
      // Mobile browsers (e.g. iOS Safari) may block programmatic downloads
      console.error('Download failed:', err);
      setShareError('Download blocked by your browser. Press and hold the image above, then choose "Save Image".');
    }
  };

  const handleShareX = async () => {
    if (!resultImage) return;
    setSharing(true);
    setShareError(null);

    const textOnly = () => {
      const text = encodeURIComponent('Just claimed my Hacker House Goa 2026 builder status! Build • Ship • Repeat #FrameInGoa');
      try {
        window.open(`https://x.com/intent/tweet?text=${text}`, '_blank');
      } catch {
        setShareError(ERROR_MESSAGES.SHARE_FAILED);
      }
    };

    try {
      const blob = dataURLToBlob(resultImage);
      const uniqueId = Math.random().toString(36).substring(2, 10);
      const fileName = `${format === 'a' ? 'frame' : 'card'}_${uniqueId}_${Date.now()}.png`;

      let sharePageUrl = null;
      try {
        // ⑥/⑦ Supabase upload (may throw SUPABASE_NOT_CONFIGURED | NETWORK_FAILURE | UPLOAD_FAILED)
        const publicUrl = await uploadFrame(blob, fileName);
        if (publicUrl) {
          sharePageUrl = `${window.location.origin}/share/${fileName.replace('.png', '')}`;
        }
      } catch (uploadErr) {
        console.error('Upload error:', uploadErr);
        if (uploadErr.code === 'NETWORK_FAILURE') {
          setShareError(ERROR_MESSAGES.NETWORK_FAILURE);
        } else if (uploadErr.code === 'UPLOAD_FAILED') {
          setShareError(ERROR_MESSAGES.UPLOAD_FAILED);
        }
        // SUPABASE_NOT_CONFIGURED → silent fallback, no error shown
        // Fall through and open text-only tweet regardless
        textOnly();
        return;
      }

      // ⑧ Open X intent
      const text = encodeURIComponent('Just claimed my Hacker House Goa 2026 builder status! Build • Ship • Repeat #FrameInGoa');
      const shareUrl = sharePageUrl
        ? `https://x.com/intent/tweet?url=${encodeURIComponent(sharePageUrl)}&text=${text}`
        : `https://x.com/intent/tweet?text=${text}`;

      const opened = window.open(shareUrl, '_blank');
      // ⑧ Share failure: popup blocked or window.open returned null
      if (!opened) {
        setShareError(ERROR_MESSAGES.SHARE_FAILED);
      }
    } catch (err) {
      console.error('Unexpected share error:', err);
      setShareError(ERROR_MESSAGES.SHARE_FAILED);
      textOnly();
    } finally {
      setSharing(false);
    }
  };

  const handleReset = () => {
    // Photo & crop
    setImageSrc(null);
    setImgElement(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    // Result
    setResultImage(null);
    // Form fields
    setName('');
    setRole('frontend');
    setCustomTitle(getFunTitle('Frontend Engineer'));
    // All error surfaces
    setUploadError(null);
    setGenerateError(null);
    setShareError(null);
    // Reset the file inputs so the same file can be re-selected
    if (fileInputRef.current)   fileInputRef.current.value   = '';
    if (cameraInputRef.current)  cameraInputRef.current.value  = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleRerollTitle = () => {
    const roleLabel = ROLES.find(r => r.id === role)?.label || 'Builder';
    setCustomTitle(getFunTitle(roleLabel, true));
  };

  if (resultImage) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center animate-result-pop">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-forest text-center mb-6 uppercase">
          {format === 'a' ? 'Your Profile Frame' : 'Your Builder Card'}
        </h2>

        {/* Generated Image Preview */}
        <div className={`w-full overflow-hidden mb-8 ${
          format === 'a' ? 'aspect-square max-w-md bg-transparent border-none shadow-none' : 'bg-canvas border border-hairline custom-shadow-lg rounded-lg aspect-[16/9]'
        }`}>
          <img
            src={resultImage}
            alt={`Hacker House Goa 2026 ${format === 'a' ? 'profile picture frame' : 'builder ID card'} — your generated design`}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Vertically Stacked Action Buttons */}
        <div className="w-full max-w-md space-y-3.5">
          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download your generated card as a high-resolution PNG"
            className="btn-pink w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-pill font-bold custom-shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
          >
            <Download className="w-5 h-5" aria-hidden="true" /> Download PNG
          </button>
          
          <button
            type="button"
            onClick={handleShareX}
            disabled={sharing}
            aria-label={sharing ? 'Uploading card before sharing to X' : 'Share your card to X with the hashtag FrameInGoa'}
            className="btn-dark w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-pill font-bold cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {sharing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Uploading to share...
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" aria-hidden="true" /> Share to X (#FrameInGoa)
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            aria-label="Discard this design and start over with a new photo"
            className="btn-ghost w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-pill font-bold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-forest"
          >
            <Plus className="w-5 h-5" aria-hidden="true" /> Create Another
          </button>
        </div>

        {/* Share / download error */}
        <div className="w-full max-w-md mt-4">
          <ErrorBanner message={shareError} onDismiss={() => setShareError(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Format Selector Toggle (Hide in Result view) */}
      {!resultImage && (
        <div className="flex justify-center mb-8" role="group" aria-label="Card format selection">
          <div className="inline-flex bg-[#062E22] p-1 rounded-pill custom-shadow-sm border border-brand-gold/30">
            <button
              type="button"
              onClick={() => { setFormat('a'); setImageSrc(null); }}
              aria-pressed={format === 'a'}
              aria-label="Format A: Profile picture frame"
              className={`px-6 py-2.5 rounded-pill text-sm font-semibold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow ${
                format === 'a'
                  ? 'bg-brand-gold text-[#062E22] shadow-sm'
                  : 'text-brand-gold/60 hover:text-brand-gold'
              }`}
            >
              Format A: PFP Frame
            </button>
            <button
              type="button"
              onClick={() => { setFormat('b'); setImageSrc(null); }}
              aria-pressed={format === 'b'}
              aria-label="Format B: Builder ID card"
              className={`px-6 py-2.5 rounded-pill text-sm font-semibold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow ${
                format === 'b'
                  ? 'bg-brand-gold text-[#062E22] shadow-sm'
                  : 'text-brand-gold/60 hover:text-brand-gold'
              }`}
            >
              Format B: Builder ID Card
            </button>
          </div>
        </div>
      )}

      {/* Main Grid Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Configuration Controls / Result Options */}
        <div className="order-2 lg:order-1 lg:col-span-6 bg-canvas border border-hairline rounded-lg p-4 sm:p-6 custom-shadow-md">
          {resultImage ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-brand-forest">Your Design is Ready!</h2>
                  <p className="text-sm text-mute">Download and share your card publicly.</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  type="button"
                  onClick={handleDownload}
                  aria-label="Download your generated card as a high-resolution PNG"
                  className="btn-pink w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-pill font-bold custom-shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
                >
                  <Download className="w-5 h-5" aria-hidden="true" /> Download High-Res PNG
                </button>
                <button
                  type="button"
                  onClick={handleShareX}
                  disabled={sharing}
                  aria-label={sharing ? 'Uploading card before sharing to X' : 'Share your card to X with the hashtag FrameInGoa'}
                  aria-busy={sharing}
                  className="btn-dark w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-pill font-bold cursor-pointer disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {sharing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Uploading to share...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" aria-hidden="true" /> Share to X (#FrameInGoa)
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Discard this design and start over with a new photo"
                  className="btn-ghost w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-pill font-bold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-forest"
                >
                  <Plus className="w-5 h-5" aria-hidden="true" /> Create Another
                </button>
              </div>
              {/* Share / download error */}
              <ErrorBanner message={shareError} onDismiss={() => setShareError(null)} />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-brand-forest">
                <Sparkles className="w-5 h-5 text-brand-pink animate-pulse" />
                {format === 'a' ? 'Configure Profile Frame' : 'Configure Builder Card'}
              </h2>

              {/* Upload Zone / Crop Editor */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="file-upload-main" className="block text-sm font-semibold text-brand-forest">Upload Profile Photo</label>
                  <span className="text-[11px] font-mono text-mute tracking-wide" aria-hidden="true">JPG &bull; PNG &bull; HEIC &nbsp;&middot;&nbsp; max {MAX_FILE_SIZE_MB} MB</span>
                </div>

                {/* Hidden file inputs — labelled for screen readers */}
                <input
                  id="file-upload-main"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.heic,.heif"
                  aria-label="Upload profile photo (JPG, PNG or HEIC, max 20 MB)"
                  className="sr-only"
                />
                <input
                  id="file-upload-camera"
                  type="file"
                  ref={cameraInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  capture="environment"
                  aria-label="Take a photo using your camera"
                  className="sr-only"
                />
                <input
                  id="file-upload-gallery"
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.heic,.heif"
                  aria-label="Choose a photo from your gallery"
                  className="sr-only"
                />

                {!imageSrc ? (
                  <div>
                    {/* Main drag-and-drop / click zone — keyboard accessible */}
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label="Upload a profile photo. Click to browse, or drag and drop a file here."
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg px-6 pt-8 pb-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-forest ${
                        dragOver
                          ? 'upload-zone-drag-active'
                          : 'border-hairline-strong/30 hover:border-brand-pink/60 bg-canvas-soft'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-8 h-8 text-brand-pink animate-spin mb-3" aria-hidden="true" />
                          <p className="text-sm font-semibold text-brand-forest" aria-live="polite">Processing image…</p>
                        </>
                      ) : (
                        <>
                          <div className={`mb-3 p-3 bg-canvas-soft-2 border border-hairline rounded-full transition-transform ${dragOver ? 'scale-110' : 'animate-upload-float'}`} aria-hidden="true">
                            <Upload className="w-6 h-6 text-brand-forest" />
                          </div>
                          <p className="text-sm font-semibold text-brand-forest mb-0.5">
                            {dragOver ? 'Drop to upload' : 'Click or drag & drop'}
                          </p>
                          <p className="text-xs text-mute">or use the options below</p>
                        </>
                      )}
                    </div>

                    {/* Secondary action row: Camera | Gallery */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <button
                        type="button"
                        aria-label="Take a photo using your camera"
                        onClick={() => cameraInputRef.current?.click()}
                        className="inline-flex items-center justify-center gap-2 border border-hairline rounded-lg py-2.5 text-sm font-semibold text-brand-forest hover:bg-canvas-soft-2 hover:border-brand-pink/40 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-forest"
                      >
                        <ImageIcon className="w-4 h-4 text-brand-pink" aria-hidden="true" /> Camera
                      </button>
                      <button
                        type="button"
                        aria-label="Choose a photo from your gallery"
                        onClick={() => galleryInputRef.current?.click()}
                        className="inline-flex items-center justify-center gap-2 border border-hairline rounded-lg py-2.5 text-sm font-semibold text-brand-forest hover:bg-canvas-soft-2 hover:border-brand-pink/40 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-forest"
                      >
                        <Upload className="w-4 h-4 text-brand-pink" aria-hidden="true" /> Gallery
                      </button>
                    </div>

                    {/* Inline upload error */}
                    <ErrorBanner message={uploadError} onDismiss={() => setUploadError(null)} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative h-72 w-full bg-canvas-soft-2 rounded-lg overflow-hidden border border-hairline">
                      <EasyCrop
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={format === 'a' ? 1 : 270 / 356}
                        cropShape={format === 'a' ? 'round' : 'rect'}
                        showGrid={false}
                        onCropChange={setCrop}
                        onCropComplete={handleCropComplete}
                        onZoomChange={setZoom}
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label htmlFor="zoom-control" className="block text-xs font-mono text-mute mb-1 font-bold">ZOOM & PAN CONTROLS</label>
                        <input
                          id="zoom-control"
                          type="range"
                          min={1}
                          max={3}
                          step={0.05}
                          value={zoom}
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          aria-label="Zoom level"
                          aria-valuemin={1}
                          aria-valuemax={3}
                          aria-valuenow={zoom}
                          aria-valuetext={`Zoom ${Math.round((zoom - 1) / 2 * 100)}%`}
                          className="w-full h-1.5 bg-canvas-soft-2 rounded-lg appearance-none cursor-pointer accent-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => { setImageSrc(null); setZoom(1); }}
                        aria-label="Remove current image and upload a different one"
                        className="px-4 py-2 border border-hairline rounded-sm text-xs font-bold text-brand-forest hover:bg-canvas-soft transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-forest"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Details (Format B Only) */}
              {format === 'b' && (
                <div className="space-y-5 border-t border-hairline pt-6">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="builder-name" className="block text-sm font-semibold text-brand-forest mb-1.5 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-mute" aria-hidden="true" /> Full Name
                    </label>
                    <input
                      id="builder-name"
                      type="text"
                      placeholder="e.g. Varun Hunakunti"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className="w-full border border-hairline rounded-sm px-3.5 py-2 text-sm bg-canvas focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-pink focus:outline-none focus:border-brand-pink transition-colors text-brand-forest font-medium"
                    />
                  </div>

                  {/* Role & Title Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="builder-role" className="block text-sm font-semibold text-brand-forest mb-1.5 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-mute" aria-hidden="true" /> Primary Stack
                      </label>
                      <select
                        id="builder-role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full border border-hairline rounded-sm px-3 py-2 text-sm bg-canvas focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-pink focus:outline-none focus:border-brand-pink transition-colors text-brand-forest font-medium"
                      >
                        {ROLES.map((r) => (
                          <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="builder-title" className="block text-sm font-semibold text-brand-forest">Hacker Title</label>
                        <button
                          type="button"
                          onClick={handleRerollTitle}
                          aria-label="Randomly pick a new hacker title"
                          className="text-xs text-brand-pink hover:text-link-deep flex items-center gap-1 font-bold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink rounded"
                        >
                          <RefreshCw className="w-3 h-3" aria-hidden="true" /> Auto Reroll
                        </button>
                      </div>
                      <input
                        id="builder-title"
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        aria-label="Custom hacker title shown on your builder card"
                        className="w-full border border-hairline rounded-sm px-3.5 py-2 text-sm bg-canvas focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-pink focus:outline-none focus:border-brand-pink transition-colors text-brand-forest font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action CTAs */}
              <div className="mt-8 pt-6 border-t border-hairline flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!imageSrc}
                  aria-label={!imageSrc ? 'Upload a photo first to generate your design' : `Generate ${format === 'a' ? 'profile frame' : 'builder card'}`}
                  aria-describedby={generateError ? 'generate-error' : undefined}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-pink text-white py-3.5 px-6 rounded-pill font-bold hover:bg-opacity-95 disabled:opacity-50 transition-all custom-shadow-sm cursor-pointer border border-brand-pink/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
                >
                  Generate Design <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              {/* Canvas / generate error */}
              <div id="generate-error"><ErrorBanner message={generateError} onDismiss={() => setGenerateError(null)} /></div>
            </div>
          )}
        </div>

        {/* Right Side: Preview / Result Frame Container */}
        <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-full sticky top-24">
            <p className="text-xs font-mono text-mute mb-3 uppercase tracking-wider text-center font-bold">
              {resultImage ? 'Generated Result Card' : 'Live Preview Window'}
            </p>
            
            <div className={`w-full overflow-hidden flex flex-col items-center justify-center transition-all relative ${
              format === 'a' ? 'aspect-square bg-transparent border-none shadow-none' : 'bg-canvas border border-hairline custom-shadow-lg aspect-[16/9]'
            }`}>
              {/* Generating Loading Overlay */}
              {generating && (
                <div
                  role="status"
                  aria-live="polite"
                  aria-label="Generating your design, please wait"
                  className="absolute inset-0 bg-canvas/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 animate-fade-in"
                >
                  <Loader2 className="w-10 h-10 text-brand-pink animate-spin mb-3" aria-hidden="true" />
                  <p className="text-sm font-semibold text-brand-forest">Generating your frame...</p>
                </div>
              )}

              {resultImage ? (
                <img
                  src={resultImage}
                  alt={`Hacker House Goa 2026 ${format === 'a' ? 'profile picture frame' : 'builder ID card'} — your generated design`}
                  className="w-full h-full object-contain animate-result-pop"
                />
              ) : imageSrc ? (
                <canvas
                  ref={canvasRef}
                  role="img"
                  aria-label={`Live preview of your ${format === 'a' ? 'profile frame' : 'builder card'} — adjust the crop above`}
                  className="w-full h-full object-contain animate-fade-in"
                />
              ) : (
                <div className="flex flex-col items-center p-8 text-center pointer-events-none">
                  <ImageIcon className="w-10 h-10 text-brand-gold mb-3 animate-pulse" />
                  <p className="text-sm font-semibold text-brand-gold">No image uploaded yet</p>
                  <p className="text-xs text-brand-cream mt-1">Upload a photo to see the live frame rendering</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
