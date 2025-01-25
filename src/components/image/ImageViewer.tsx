import React, { useState, useRef, useEffect } from 'react';
import ImageToolbar from './ImageToolbar.tsx';

interface ImageViewerProps {
  imageUrl: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * delta, 0.1), 5);

      // Adjust position to zoom towards mouse cursor
      const scaleChange = newScale - scale;
      setPosition(prev => ({
        x: prev.x - (mouseX - rect.width / 2) * scaleChange,
        y: prev.y - (mouseY - rect.height / 2) * scaleChange
      }));
      setScale(newScale);
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
      
      // Calculate boundaries
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

  return (
    <div className="flex flex-row h-full w-full gap-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border-2 border-gray=700">
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-gray-800 h-full w-full rounded-lg shadow-lg p-4">
          <div 
            ref={containerRef}
            className="relative h-full w-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              className="flex items-center justify-center h-full w-full"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Medical scan"
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'center',
                }}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
        </div>
      </div>
      <ImageToolbar
        onToolSelect={handleToolSelect}
        selectedTool={selectedTool}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        scale={scale}
      />
    </div>
  );
};

export default ImageViewer; 