import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from 'react-image-crop';
import { motion } from 'framer-motion';
import { 
  Save, 
  RotateCw, 
  RotateCcw, 
  FlipHorizontal, 
  FlipVertical,
  Square,
  Smartphone,
  Monitor,
  Maximize,
  Download,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageEditorProps {
  imageUrl: string;
  imageName?: string;
  onSave?: (editedImageUrl: string, cropData: PixelCrop) => void;
  onCancel?: () => void;
  className?: string;
}

// Predefined aspect ratios for social media
const ASPECT_RATIOS = [
  { name: 'Free', ratio: undefined, icon: <Maximize className="h-4 w-4" /> },
  { name: 'Square', ratio: 1, icon: <Square className="h-4 w-4" /> },
  { name: 'Story', ratio: 9/16, icon: <Smartphone className="h-4 w-4" /> },
  { name: 'Post', ratio: 4/5, icon: <Monitor className="h-4 w-4" /> },
  { name: 'Banner', ratio: 16/9, icon: <Monitor className="h-4 w-4" /> },
];

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUrl,
  imageName = 'edited-image',
  onSave,
  onCancel,
  className
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  const handleAspectChange = useCallback((newAspect: number | undefined) => {
    setAspect(newAspect);
    
    if (imgRef.current && newAspect) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, newAspect);
      setCrop(newCrop);
      setCompletedCrop(convertToPixelCrop(newCrop, width, height));
    } else {
      setCrop(undefined);
    }
  }, []);

  const generateCroppedImage = useCallback(async (): Promise<string> => {
    const image = imgRef.current;
    const canvas = canvasRef.current;
    const crop = completedCrop;

    if (!image || !canvas || !crop) {
      throw new Error('Required elements not available');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      crop.width * scaleX,
      crop.height * scaleY,
    );
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.save();

    // Apply transformations
    ctx.translate(offscreen.width / 2, offscreen.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.translate(-offscreen.width / 2, -offscreen.height / 2);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );

    ctx.restore();

    const blob = await offscreen.convertToBlob({
      type: 'image/png',
    });

    return URL.createObjectURL(blob);
  }, [completedCrop, rotate, flipH, flipV]);

  const handleSave = async () => {
    if (!completedCrop) return;
    
    setIsProcessing(true);
    try {
      const croppedImageUrl = await generateCroppedImage();
      onSave?.(croppedImageUrl, completedCrop);
    } catch (error) {
      console.error('Error generating cropped image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!completedCrop) return;
    
    try {
      const croppedImageUrl = await generateCroppedImage();
      const link = document.createElement('a');
      link.download = `${imageName}-edited.png`;
      link.href = croppedImageUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const resetTransforms = () => {
    setScale(1);
    setRotate(0);
    setFlipH(false);
    setFlipV(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Image Editor</h2>
          <p className="text-muted-foreground">Crop and edit your image</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Aspect Ratio Selection */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Aspect Ratio</h3>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <Button
              key={ratio.name}
              variant={aspect === ratio.ratio ? "default" : "outline"}
              size="sm"
              onClick={() => handleAspectChange(ratio.ratio)}
              className="flex items-center gap-2"
            >
              {ratio.icon}
              {ratio.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Image Crop Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="border rounded-lg p-4 bg-muted/20">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minWidth={50}
              minHeight={50}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                alt="Crop preview"
                src={imageUrl}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                  maxWidth: '100%',
                  height: 'auto',
                }}
                onLoad={onImageLoad}
                className="max-h-[600px]"
              />
            </ReactCrop>
          </div>

          {/* Crop Info */}
          {completedCrop && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 text-sm text-muted-foreground"
            >
              <Badge variant="secondary">
                {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)}px
              </Badge>
              <Badge variant="secondary">
                Aspect: {aspect ? aspect.toFixed(2) : 'Free'}
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Transform Controls */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Transform</h3>
            
            {/* Scale */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm">Scale</label>
                <span className="text-sm text-muted-foreground">{scale.toFixed(1)}x</span>
              </div>
              <Slider
                value={[scale]}
                onValueChange={([value]) => setScale(value)}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Rotation */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm">Rotation</label>
                <span className="text-sm text-muted-foreground">{rotate}°</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotate((r) => r - 90)}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotate((r) => r + 90)}
                  className="flex-1"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Flip Controls */}
            <div className="space-y-2">
              <label className="text-sm">Flip</label>
              <div className="flex gap-2">
                <Button
                  variant={flipH ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFlipH(!flipH)}
                  className="flex-1"
                >
                  <FlipHorizontal className="h-4 w-4" />
                </Button>
                <Button
                  variant={flipV ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFlipV(!flipV)}
                  className="flex-1"
                >
                  <FlipVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={resetTransforms}
              className="w-full"
            >
              Reset All
            </Button>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleDownload}
              disabled={!completedCrop}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!completedCrop || isProcessing}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageEditor;
