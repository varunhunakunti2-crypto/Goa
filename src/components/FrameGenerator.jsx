import React, { useState, useRef, useEffect } from 'react';
import EasyCrop from 'react-easy-crop';
import { Upload, Download, RefreshCw, Check, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { renderPFPFrame, renderIDCard, getFunTitle } from './canvasEngine';
import { supabase, uploadFrame } from './supabase';

const ROLES = [
  { id: 'frontend', label: 'Frontend Engineer' },
  { id: 'backend', label: 'Backend Engineer' },
  { id: 'ai', label: 'AI Engineer' },
  { id: 'design', label: 'Designer / UI/UX' },
  { id: 'smart_contracts', label: 'Smart Contract Dev' },
  { id: 'other', label: 'General Builder' },
];

export default function FrameGenerator() {
  const [activeTab, setActiveTab] = useState('pfp'); // 'pfp' or 'idcard'
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  
  // Crop States
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Form States (for ID Card)
  const [name, setName] = useState('');
  const [role, setRole] = useState('frontend');
  const [funTitle, setFunTitle] = useState('');
  
  // Canvas References
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imgElement, setImgElement] = useState(null);

  // Pre-load uploaded image element for Canvas drawing
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
    setFunTitle(getFunTitle(roleLabel));
  }, [role]);

  // Handle file uploads, including client-side HEIC conversion
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      let processedFile = file;

      // Handle HEIC/HEIF files
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heif') {
        const heic2any = (await import('heic2any')).default;
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8,
        });
        processedFile = new File([convertedBlob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: 'image/jpeg' });
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setLoading(false);
      };
      reader.readAsDataURL(processedFile);
    } catch (err) {
      console.error('Error processing image:', err);
      alert('Failed to process image. If it is a HEIC file, please try a standard JPEG/PNG or verify the file.');
      setLoading(false);
    }
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Re-draw Canvas on any state changes
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const draw = async () => {
      if (activeTab === 'pfp') {
        await renderPFPFrame(canvasRef.current, imgElement, croppedAreaPixels);
      } else {
        const roleLabel = ROLES.find(r => r.id === role)?.label || 'Builder';
        await renderIDCard(canvasRef.current, imgElement, croppedAreaPixels, name || 'Verified Builder', roleLabel, funTitle);
      }
    };

    draw();
  }, [activeTab, imgElement, croppedAreaPixels, name, role, funTitle]);

  // Export Canvas to Blob
  const getCanvasBlob = () => {
    return new Promise((resolve) => {
      if (!canvasRef.current) return resolve(null);
      canvasRef.current.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  };

  // Handle Download
  const handleDownload = async () => {
    const blob = await getCanvasBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeTab === 'pfp' ? 'hh_goa_pfp.png' : 'hh_goa_builder_id.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Upload to Supabase and Share on X
  const handleShareToX = async () => {
    setShareLoading(true);
    try {
      const blob = await getCanvasBlob();
      if (!blob) {
        setShareLoading(false);
        return;
      }

      // Generate a unique ID for the shareable URL
      const shareId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Upload to Supabase Storage
      const publicUrl = await uploadFrame(blob, `${shareId}.png`);
      
      if (!publicUrl) {
        throw new Error("Failed to upload image.");
      }

      // Pre-compose the Twitter post with hashtag and dynamic redirect preview URL
      const shareUrl = `${window.location.origin}/share/${shareId}`;
      const tweetText = `Just generated my HackHind Goa card! See you in Goa 🌴 #FrameInGoa\n\nCreate yours here:`;
      const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
      
      window.open(xUrl, '_blank');
    } catch (err) {
      console.error(err);
      alert("Could not prepare sharing. Download instead and upload to X!");
    } finally {
      setShareLoading(false);
    }
  };

  const handleRerollTitle = () => {
    const roleLabel = ROLES.find(r => r.id === role)?.label || 'Builder';
    const randomSalt = Math.random().toString();
    setFunTitle(getFunTitle(roleLabel + randomSalt));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-canvas-soft-2 p-1 rounded-pill custom-shadow-sm border border-hairline">
          <button
            onClick={() => { setActiveTab('pfp'); setImageSrc(null); }}
            className={`px-6 py-2.5 rounded-pill text-sm font-medium transition-all ${
              activeTab === 'pfp'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-body hover:text-ink'
            }`}
          >
            Format A: PFP Frame
          </button>
          <button
            onClick={() => { setActiveTab('idcard'); setImageSrc(null); }}
            className={`px-6 py-2.5 rounded-pill text-sm font-medium transition-all ${
              activeTab === 'idcard'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-body hover:text-ink'
            }`}
          >
            Format B: Builder ID Card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Controls & Input form */}
        <div className="lg:col-span-7 bg-canvas border border-hairline rounded-lg p-6 custom-shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-link" />
            {activeTab === 'pfp' ? 'Configure PFP Frame' : 'Configure Builder ID Card'}
          </h2>

          {/* Photo Uploader */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-body mb-2">Upload Profile Photo</label>
            {!imageSrc ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-hairline-strong/30 hover:border-link rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-canvas-soft group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.heic"
                  className="hidden"
                />
                {loading ? (
                  <Loader2 className="w-10 h-10 text-mute animate-spin mb-3" />
                ) : (
                  <Upload className="w-10 h-10 text-mute group-hover:text-link mb-3 transition-colors" />
                )}
                <p className="text-sm font-medium text-ink">
                  {loading ? 'Processing Image (HEIC support active)...' : 'Click or Drag to Upload'}
                </p>
                <p className="text-xs text-mute mt-1">PNG, JPG, WEBP, or HEIC (from iPhone)</p>
              </div>
            ) : (
              <div className="relative h-64 w-full bg-canvas-soft-2 rounded-lg overflow-hidden border border-hairline">
                <EasyCrop
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape={activeTab === 'pfp' ? 'round' : 'rect'}
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={handleCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
            )}

            {imageSrc && (
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-mono text-mute mb-1">ZOOM CONTROLS</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-canvas-soft-2 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <button
                  onClick={() => { setImageSrc(null); setZoom(1); }}
                  className="px-4 py-2 border border-hairline rounded-sm text-sm font-medium hover:bg-canvas-soft transition-colors"
                >
                  Change Photo
                </button>
              </div>
            )}
          </div>

          {/* Card Meta Form (Format B only) */}
          {activeTab === 'idcard' && (
            <div className="space-y-4 border-t border-hairline pt-6">
              <div>
                <label htmlFor="builder-name" className="block text-sm font-medium text-body mb-1.5">Builder Name</label>
                <input
                  id="builder-name"
                  type="text"
                  placeholder="e.g. Varun"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-hairline rounded-sm px-3 py-2 text-sm bg-canvas focus:outline-none focus:border-link transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="builder-role" className="block text-sm font-medium text-body mb-1.5">Stack / Primary Role</label>
                  <select
                    id="builder-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-hairline rounded-sm px-3 py-2 text-sm bg-canvas focus:outline-none focus:border-link transition-colors"
                  >
                    {ROLES.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="builder-title" className="block text-sm font-medium text-body">Fun Builder Title</label>
                    <button
                      onClick={handleRerollTitle}
                      className="text-xs text-link hover:text-link-deep flex items-center gap-1 font-medium"
                    >
                      <RefreshCw className="w-3 h-3" /> Reroll
                    </button>
                  </div>
                  <input
                    id="builder-title"
                    type="text"
                    value={funTitle}
                    onChange={(e) => setFunTitle(e.target.value)}
                    className="w-full border border-hairline rounded-sm px-3 py-2 text-sm bg-canvas focus:outline-none focus:border-link transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="mt-8 pt-6 border-t border-hairline flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-6 rounded-pill font-medium hover:bg-opacity-90 active:scale-[0.98] transition-all custom-shadow-sm"
            >
              <Download className="w-4 h-4" /> Download High-Res PNG
            </button>
            <button
              onClick={handleShareToX}
              disabled={shareLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1d9bf0] text-white py-3 px-6 rounded-pill font-medium hover:bg-opacity-90 active:scale-[0.98] disabled:bg-opacity-70 transition-all custom-shadow-sm"
            >
              {shareLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading card...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Share to X (#FrameInGoa)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Hand: Canvas Live Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm sticky top-8">
            <p className="text-xs font-mono text-mute mb-2 uppercase tracking-wide text-center">Live Generated Preview</p>
            
            {/* Aspect Ratio Box */}
            <div className={`w-full overflow-hidden bg-canvas-soft-2 rounded-lg border border-hairline custom-shadow-lg flex items-center justify-center ${
              activeTab === 'pfp' ? 'aspect-square' : 'aspect-[2/3]'
            }`}>
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
            </div>
            
            <p className="text-xs text-mute mt-3 text-center">
              * The download will output a crystal-clear, high-resolution image file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
