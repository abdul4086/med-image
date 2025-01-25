import React, { useState, useRef, useEffect } from 'react';

interface CropOverlayProps {
  onCropComplete: (crop: { x: number; y: number; width: number; height: number }) => void;
  onCancel: () => void;
  imageRef: React.RefObject<HTMLImageElement>;
  scale: number;
}

const CropOverlay: React.FC<CropOverlayProps> = ({
  onCropComplete,
  onCancel,
  imageRef,
  scale
}) => {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!overlayRef.current) return;
    
    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPos({ x, y });
    setCropBox({ x, y, width: 0, height: 0 });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !overlayRef.current) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    setCropBox({
      x: Math.min(startPos.x, currentX),
      y: Math.min(startPos.y, currentY),
      width: Math.abs(currentX - startPos.x),
      height: Math.abs(currentY - startPos.y)
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleComplete = () => {
    if (!imageRef.current || !overlayRef.current) return;

    const imgRect = imageRef.current.getBoundingClientRect();
    const overlayRect = overlayRef.current.getBoundingClientRect();

    // Convert crop coordinates relative to the image
    const relativeX = (cropBox.x - (imgRect.left - overlayRect.left)) / scale;
    const relativeY = (cropBox.y - (imgRect.top - overlayRect.top)) / scale;
    const relativeWidth = cropBox.width / scale;
    const relativeHeight = cropBox.height / scale;

    onCropComplete({
      x: relativeX,
      y: relativeY,
      width: relativeWidth,
      height: relativeHeight
    });
  };

  return (
    <div 
      ref={overlayRef}
      className="absolute inset-0 bg-black bg-opacity-50 cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {cropBox.width > 0 && cropBox.height > 0 && (
        <div
          className="absolute border-2 border-white"
          style={{
            left: cropBox.x,
            top: cropBox.y,
            width: cropBox.width,
            height: cropBox.height
          }}
        />
      )}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={handleComplete}
        >
          Crop
        </button>
      </div>
    </div>
  );
};

export default CropOverlay; 