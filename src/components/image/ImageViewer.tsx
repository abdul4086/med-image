import React, { useEffect, useRef, useState } from 'react';
import CalibrationDialog from './CalibrationDialog.tsx';
import GridOverlay from './GridOverlay.tsx';
import ImageToolbar from './ImageToolbar.tsx';
import LineMeasurement from './LineMeasurement.tsx';
import MeasurementDock from './MeasurementDock.tsx';
import CircleMeasurement from './CircleMeasurement.tsx';
import AngleMeasurement from './AngleMeasurement.tsx';
import { FaSave } from 'react-icons/fa';
import ImageAdjustmentMenu from './ImageAdjustmentMenu.tsx';

interface Adjustments {
  brightness: number;
  contrast: number;
}

interface ImageViewerProps {
  imageUrl: string;
}

const MEASUREMENT_COLORS = {
  line: '#FF0000', // Red
  circle: '#0000FF', // Blue
  angle: '#00FF00', // Green
};

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [history, setHistory] = useState<any[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [adjustments, setAdjustments] = useState<Adjustments>({ brightness: 100, contrast: 100 });
  const [showAdjustmentsMenu, setShowAdjustmentsMenu] = useState(false);
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

  const handleOpenAdjustments = () => {
    setShowAdjustmentsMenu(true);
  };

  const handleCloseAdjustments = () => {
    setShowAdjustmentsMenu(false);
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

  const handleMeasurementComplete = (measurement: any) => {
    const newMeasurements = [...measurements, measurement];
    
    // Create new history entry
    const newHistory = history.slice(0, historyIndex + 1);
    const updatedHistory = [...newHistory, newMeasurements];
    
    setMeasurements(newMeasurements);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);

    // If this is the first measurement and we're not calibrated, start calibration
    if (newMeasurements.length === 1 && pixelsPerMm === 0) {
      setIsCalibrating(true);
    }
  };

  const handleDeleteMeasurement = (id: string) => {
    const newMeasurements = measurements.filter(m => m.id !== id);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    const updatedHistory = [...newHistory, newMeasurements];
    
    setMeasurements(newMeasurements);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setMeasurements(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setMeasurements(history[newIndex]);
    }
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCroppedImage(null);
    setMeasurements([]);
    setHistory([[]]);
    setHistoryIndex(0);
  };

  const handleCalibration = (knownDistance: number) => {
    if (!imageRef.current) return;
    
    // Set fixed pixel to mm ratio (0.4 mm/pixel)
    const PIXEL_TO_MM_RATIO = 0.4;
    setPixelsPerMm(1 / PIXEL_TO_MM_RATIO); // Convert ratio to pixels per mm
    setIsCalibrating(false);
  };

  const handleSaveImage = async () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.src = croppedImage || imageUrl;

    await new Promise<void>((resolve) => {
      image.onload = () => {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        // Draw the base image
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Calculate scale factors
        const scaleX = canvas.width / imageRef.current!.width;
        const scaleY = canvas.height / imageRef.current!.height;

        // Draw all measurements
        measurements.forEach(measurement => {
          // Handle line measurements
          if (measurement.type === 'line' && measurement.points) {
            const { start, end } = measurement.points;

            ctx.beginPath();
            ctx.strokeStyle = MEASUREMENT_COLORS.line;
            ctx.lineWidth = 2;
            ctx.moveTo(start.x * scaleX, start.y * scaleY);
            ctx.lineTo(end.x * scaleX, end.y * scaleY);
            ctx.stroke();

            // Add line measurement text
            ctx.font = '16px Arial';
            ctx.fillStyle = MEASUREMENT_COLORS.line;
            const midX = (start.x + end.x) * scaleX / 2;
            const midY = (start.y + end.y) * scaleY / 2;
            ctx.fillText(measurement.value, midX, midY - 10);
          }
          
          // Handle circle measurements
          if (measurement.type === 'circle' && measurement.circle) {
            const { center, radius } = measurement.circle;
            
            ctx.beginPath();
            ctx.strokeStyle = MEASUREMENT_COLORS.circle;
            ctx.lineWidth = 2;
            ctx.arc(
              center.x * scaleX,
              center.y * scaleY,
              radius * scaleX,
              0,
              2 * Math.PI
            );
            ctx.stroke();

            // Add circle measurement text
            ctx.font = '16px Arial';
            ctx.fillStyle = MEASUREMENT_COLORS.circle;
            ctx.fillText(
              measurement.value,
              (center.x * scaleX) + 5,
              (center.y * scaleY) - 10
            );
          }
          
          // Handle angle measurements
          if (measurement.type === 'angle' && measurement.points) {
            const { p1, p2, p3 } = measurement.points;
            
            ctx.beginPath();
            ctx.strokeStyle = MEASUREMENT_COLORS.angle;
            ctx.lineWidth = 2;
            ctx.moveTo(p1.x * scaleX, p1.y * scaleY);
            ctx.lineTo(p2.x * scaleX, p2.y * scaleY);
            ctx.lineTo(p3.x * scaleX, p3.y * scaleY);
            ctx.stroke();

            // Add angle measurement text
            ctx.font = '16px Arial';
            ctx.fillStyle = MEASUREMENT_COLORS.angle;
            ctx.fillText(
              measurement.value,
              p2.x * scaleX + 5,
              p2.y * scaleY - 5
            );
          }
        });

        // Create download link
        const link = document.createElement('a');
        link.download = 'medical-image-with-measurements.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        resolve();
      };
    });
  };

  const handleAdjustmentsChange = (newAdjustments: Adjustments) => {
    setAdjustments(newAdjustments);
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
    <div className="flex h-full w-full p-4 bg-gray-100 dark:bg-gray-900 rounded-lg relative">
      <div className="flex-1 relative">
        <div className="bg-white dark:bg-gray-800 h-full w-full rounded-lg shadow-lg">
          <button
            onClick={handleSaveImage}
            className="absolute left-4 top-4 z-10 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
          >
            <FaSave />
            Save Image
          </button>
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
                  filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%)`,
                }}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
            {scale > 1 && <GridOverlay scale={scale} />}
            {selectedTool === 'line' && (
              <LineMeasurement
                imageRef={imageRef}
                containerRef={containerRef}
                scale={scale}
                position={position}
                pixelsPerMm={pixelsPerMm}
                onMeasurementComplete={handleMeasurementComplete}
                isActive={selectedTool === 'line'}
                measurements={measurements}
              />
            )}
            {selectedTool === 'circle' && (
              <CircleMeasurement
                imageRef={imageRef}
                containerRef={containerRef}
                scale={scale}
                position={position}
                pixelsPerMm={pixelsPerMm}
                onMeasurementComplete={handleMeasurementComplete}
                isActive={selectedTool === 'circle'}
                measurements={measurements}
              />
            )}
            {selectedTool === 'angle' && (
              <AngleMeasurement
                imageRef={imageRef}
                containerRef={containerRef}
                scale={scale}
                position={position}
                pixelsPerMm={pixelsPerMm}
                onMeasurementComplete={handleMeasurementComplete}
                isActive={selectedTool === 'angle'}
                measurements={measurements}
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
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              scale={scale}
              onOpenAdjustments={handleOpenAdjustments}
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
            {showAdjustmentsMenu && (
              <ImageAdjustmentMenu
                onClose={handleCloseAdjustments}
                setBrightness={(value) => handleAdjustmentsChange({ ...adjustments, brightness: value })}
                setContrast={(value) => handleAdjustmentsChange({ ...adjustments, contrast: value })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer; 