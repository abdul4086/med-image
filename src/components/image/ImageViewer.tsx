import React, { useEffect, useRef, useState } from 'react';
import CalibrationDialog from './CalibrationDialog.tsx';
import CropOverlay from './CropOverlay.tsx';
import GridOverlay from './GridOverlay.tsx';
import ImageToolbar from './ImageToolbar.tsx';
import LineMeasurement from './LineMeasurement.tsx';
import MeasurementDock from './MeasurementDock.tsx';

interface ImageViewerProps {
  imageUrl: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [showMeasurementDock, setShowMeasurementDock] = useState(false);
  const [pixelsPerMm, setPixelsPerMm] = useState<number>(0);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const handleToolSelect = (tool: string) => {
    if (tool === 'measure') {
      setShowMeasurementDock(true);
    } else {
      setSelectedTool(tool);
      if (!['line', 'circle', 'angle', 'roi', 'distance', 'annotate'].includes(tool)) {
        setShowMeasurementDock(false);
      }
    }
  };

  const handleCropComplete = async (crop: { x: number; y: number; width: number; height: number }) => {
    if (!imageRef.current) return;

    // Create a new image to ensure it's loaded
    const image = new Image();
    image.src = croppedImage || imageUrl;

    await new Promise<void>((resolve) => {
      image.onload = () => {
        // Create canvas with natural image dimensions
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Get the actual image dimensions
        const displayedWidth = imageRef.current!.width;
        const displayedHeight = imageRef.current!.height;
        
        // Calculate scaling factors
        const scaleX = image.naturalWidth / displayedWidth;
        const scaleY = image.naturalHeight / displayedHeight;

        // Convert crop coordinates to actual image coordinates
        const actualCrop = {
          x: crop.x * scaleX,
          y: crop.y * scaleY,
          width: crop.width * scaleX,
          height: crop.height * scaleY
        };

        // Set canvas size to crop dimensions
        canvas.width = actualCrop.width;
        canvas.height = actualCrop.height;

        // Draw the cropped portion
        ctx.drawImage(
          image,
          actualCrop.x,
          actualCrop.y,
          actualCrop.width,
          actualCrop.height,
          0,
          0,
          actualCrop.width,
          actualCrop.height
        );

        // Convert to base64 with maximum quality
        const croppedDataUrl = canvas.toDataURL('image/png', 1.0);

        // Create a new Image object to ensure the crop is loaded properly
        const croppedImg = new Image();
        croppedImg.onload = () => {
          setCroppedImage(croppedDataUrl);
          setSelectedTool(null);
          setScale(1);
          setPosition({ x: 0, y: 0 });
          resolve();
        };
        croppedImg.src = croppedDataUrl;
      };
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const container = containerRef.current;
      const image = imageRef.current;
      if (!container || !image) return;

      // Get container and image dimensions
      const containerRect = container.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();

      // Calculate mouse position relative to container
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;

      // Calculate zoom
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * zoomFactor, 0.1), 10);

      // Calculate the scaled dimensions
      const newWidth = image.width * newScale;
      const newHeight = image.height * newScale;

      // Calculate the maximum allowed position to keep image within bounds
      const maxX = Math.max(0, (newWidth - containerRect.width) / 2);
      const maxY = Math.max(0, (newHeight - containerRect.height) / 2);

      // Calculate new position maintaining the point under cursor
      const newPosition = {
        x: mouseX - ((mouseX - position.x) * (newScale / scale)),
        y: mouseY - ((mouseY - position.y) * (newScale / scale))
      };

      // Clamp the position to keep image within bounds
      const clampedPosition = {
        x: Math.min(Math.max(newPosition.x, -maxX), maxX),
        y: Math.min(Math.max(newPosition.y, -maxY), maxY)
      };

      setScale(newScale);
      setPosition(clampedPosition);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === 'pan') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedTool === 'pan') {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const container = containerRef.current;
      const image = imageRef.current;
      if (container && image) {
        const containerRect = container.getBoundingClientRect();
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;
        
        const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2);
        const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2);
        
        setPosition({
          x: Math.min(Math.max(newX, -maxX), maxX),
          y: Math.min(Math.max(newY, -maxY), maxY)
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale * 1.1, 5));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale * 0.9, 0.1));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCroppedImage(null);
  };

  const handleMeasurementComplete = (measurement: any) => {
    setMeasurements([...measurements, measurement]);
    
    // If this is the first measurement and we're not calibrated, start calibration
    if (measurements.length === 0 && pixelsPerMm === 0) {
      setIsCalibrating(true);
    }
  };

  const handleCalibration = (knownDistance: number) => {
    if (!imageRef.current) return;
    
    // Set fixed pixel to mm ratio (0.4 mm/pixel)
    const PIXEL_TO_MM_RATIO = 0.4;
    setPixelsPerMm(1 / PIXEL_TO_MM_RATIO); // Convert ratio to pixels per mm
    setIsCalibrating(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', (e) => {
        if (e.ctrlKey) e.preventDefault();
      }, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', (e) => {
          if (e.ctrlKey) e.preventDefault();
        });
      }
    };
  }, []);

  const currentImageUrl = croppedImage || imageUrl;

  return (
    <div className="flex h-full w-full p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
      <div className="flex-1 relative">
        <div className="bg-white dark:bg-gray-800 h-full w-full rounded-lg shadow-lg">
          {/* Image Container Frame */}
          <div 
            ref={containerRef}
            className="relative h-full w-full bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-700 dark:border-gray-500"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              <img
                ref={imageRef}
                src={currentImageUrl}
                alt="Medical scan"
                className="max-w-none transition-transform duration-200"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'center',
                }}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
            {scale > 1 && <GridOverlay scale={scale} />}
            {selectedTool === 'crop' && (
              <CropOverlay
                onCropComplete={handleCropComplete}
                onCancel={() => setSelectedTool(null)}
                imageRef={imageRef}
                scale={scale}
              />
            )}
            {selectedTool === 'line' && (
              <LineMeasurement
                imageRef={imageRef}
                containerRef={containerRef}
                scale={scale}
                position={position}
                pixelsPerMm={pixelsPerMm}
                onMeasurementComplete={handleMeasurementComplete}
                isActive={selectedTool === 'line'}
              />
            )}
          </div>
        </div>
        
        <div className="absolute right-4 top-4">
          <div className="relative">
            <ImageToolbar
              onToolSelect={handleToolSelect}
              selectedTool={selectedTool}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onReset={handleReset}
              scale={scale}
            />
            {showMeasurementDock && (
              <MeasurementDock
                onToolSelect={setSelectedTool}
                selectedTool={selectedTool}
                onClose={() => {
                  setShowMeasurementDock(false);
                  setSelectedTool(null);
                }}
              />
            )}
            {isCalibrating && (
              <CalibrationDialog
                onCalibrate={handleCalibration}
                onCancel={() => setIsCalibrating(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer; 