import React, { useState, useRef, useEffect } from 'react';
import EasyCrop from 'react-easy-crop';
import { Upload, ImageIcon, Sparkles, User, Briefcase, RefreshCw, CheckCircle2, Loader2, Download } from 'lucide-react';
import { renderPFPFrame, renderIDCard, getFunTitle } from '../canvas/canvasEngine';

const ROLES = [
  { id: 'frontend', label: 'Frontend Engineer' },
  { id: 'backend', label: 'Backend Engineer' },
  { id: 'ai', label: 'AI Engineer' },
  { id: 'design', label: 'Designer / UI/UX' },
  { id: 'smart_contracts', label: 'Smart Contract Dev' },
  { id: 'other', label: 'General Builder' },
];

export default function FrameGenerator() {
  const [format, setFormat] = useState('a'); // 'a' = PFP, 'b' = ID Card
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  
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
  const [imgElement, setImgElement] = useState(null);

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

  // Re-draw Canvas Preview
  useEffect(() => {
    if (!canvasRef.current) return;

    const draw = async () => {
      if (format === 'a') {
        await renderPFPFrame(canvasRef.current, imgElement, croppedAreaPixels);
      } else {
        const roleLabel = ROLES.find(r => r.id === role)?.label || 'Builder';
        await renderIDCard(canvasRef.current, imgElement, croppedAreaPixels, name || 'Verified Builder', roleLabel, customTitle);
      }
    };

    draw();
  }, [format, imgElement, croppedAreaPixels, name, role, customTitle]);

  // Handle file uploads (including HEIC)
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      let processedFile = file;

      // HEIC/HEIF to JPEG conversion
      if (
        file.type === 'image/heic' || 
        file.name.toLowerCase().endsWith('.heic') || 
        file.name.toLowerCase().endsWith('.heif') || 
        file.type === 'image/heif'
      ) {
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
      alert('Failed to process image file. If it is an iPhone HEIC photo, please verify and try again.');
      setLoading(false);
    }
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = format === 'a' ? 'hh_goa_pfp_frame.png' : 'hh_goa_builder_card.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleRerollTitle = () => {
    const roleLabel = ROLES.find(r => r.id === role)?.label || 'Builder';
    const randomSalt = Math.random().toString();
    setCustomTitle(getFunTitle(roleLabel + randomSalt));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Format Selector Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-canvas-soft-2 p-1 rounded-pill custom-shadow-sm border border-hairline">
          <button
            onClick={() => { setFormat('a'); setImageSrc(null); }}
            className={`px-6 py-2.5 rounded-pill text-sm font-semibold transition-all cursor-pointer ${
              format === 'a'
                ? 'bg-brand-forest text-brand-white shadow-sm'
                : 'text-mute hover:text-brand-forest'
            }`}
          >
            Format A: PFP Frame
          </button>
          <button
            onClick={() => { setFormat('b'); setImageSrc(null); }}
            className={`px-6 py-2.5 rounded-pill text-sm font-semibold transition-all cursor-pointer ${
              format === 'b'
                ? 'bg-brand-forest text-brand-white shadow-sm'
                : 'text-mute hover:text-brand-forest'
            }`}
          >
            Format B: Builder ID Card
          </button>
        </div>
      </div>

      {/* Main Grid Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Configuration Controls */}
        <div className="lg:col-span-7 bg-canvas border border-hairline rounded-lg p-6 custom-shadow-md">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-brand-forest">
            <Sparkles className="w-5 h-5 text-brand-pink animate-pulse" />
            {format === 'a' ? 'Configure Profile Frame' : 'Configure Builder Card'}
          </h2>

          {/* Interactive Drag & Drop Zone / Crop Editor */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-brand-forest mb-2">Upload Profile Photo</label>
            
            {!imageSrc ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-hairline-strong/30 hover:border-brand-pink/60 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-canvas-soft group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.heic"
                  className="hidden"
                />

                <div className="flex flex-col items-center text-center pointer-events-none">
                  {loading ? (
                    <Loader2 className="w-8 h-8 text-brand-pink animate-spin mb-4" />
                  ) : (
                    <div className="mb-4 p-3 bg-canvas-soft-2 border border-hairline rounded-full group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-brand-forest group-hover:text-brand-pink transition-colors" />
                    </div>
                  )}
                  <p className="text-sm font-semibold text-brand-forest">
                    {loading ? 'Processing HEIC image...' : 'Click or Drag to Upload'}
                  </p>
                  <p className="text-xs text-mute mt-1">Supports PNG, JPEG, WEBP, or HEIC format</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative h-72 w-full bg-canvas-soft-2 rounded-lg overflow-hidden border border-hairline">
                  <EasyCrop
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape={format === 'a' ? 'round' : 'rect'}
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={handleCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-mono text-mute mb-1 font-bold">ZOOM & PAN CONTROLS</label>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.05}
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-canvas-soft-2 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                    />
                  </div>
                  <button
                    onClick={() => { setImageSrc(null); setZoom(1); }}
                    className="px-4 py-2 border border-hairline rounded-sm text-xs font-bold text-brand-forest hover:bg-canvas-soft transition-colors cursor-pointer"
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
                <label className="block text-sm font-semibold text-brand-forest mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-mute" /> Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Varun Hunakunti"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-hairline rounded-sm px-3.5 py-2 text-sm bg-canvas focus:outline-none focus:border-brand-pink transition-colors text-brand-forest font-medium"
                />
              </div>

              {/* Role & Title Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-forest mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-mute" /> Primary Stack
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-hairline rounded-sm px-3 py-2 text-sm bg-canvas focus:outline-none focus:border-brand-pink transition-colors text-brand-forest font-medium"
                  >
                    {ROLES.map((r) => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-brand-forest">Hacker Title</label>
                    <button 
                      onClick={handleRerollTitle}
                      className="text-xs text-brand-pink hover:text-link-deep flex items-center gap-1 font-bold transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Auto Reroll
                    </button>
                  </div>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full border border-hairline rounded-sm px-3.5 py-2 text-sm bg-canvas focus:outline-none focus:border-brand-pink transition-colors text-brand-forest font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="mt-8 pt-6 border-t border-hairline flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownload}
              disabled={!imageSrc}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-pink text-white py-3.5 px-6 rounded-pill font-bold hover:bg-opacity-95 disabled:opacity-50 transition-all custom-shadow-sm cursor-pointer border border-brand-pink/20"
            >
              <Download className="w-4 h-4" /> Download Design
            </button>
          </div>
        </div>

        {/* Right Side: Preview Frame Container */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm sticky top-24">
            <p className="text-xs font-mono text-mute mb-3 uppercase tracking-wider text-center font-bold">Live Preview Window</p>
            
            <div className={`w-full overflow-hidden bg-canvas border border-hairline custom-shadow-lg flex flex-col items-center justify-center transition-all ${
              format === 'a' ? 'aspect-square' : 'aspect-[2/3]'
            }`}>
              {imageSrc ? (
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center p-8 text-center pointer-events-none">
                  <ImageIcon className="w-10 h-10 text-mute mb-3 animate-pulse" />
                  <p className="text-sm font-semibold text-brand-forest">No image uploaded yet</p>
                  <p className="text-xs text-mute mt-1">Upload a photo to see the live frame rendering</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
