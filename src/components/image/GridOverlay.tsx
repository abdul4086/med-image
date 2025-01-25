import React from 'react';

interface GridOverlayProps {
  scale: number;
}

const GridOverlay: React.FC<GridOverlayProps> = ({ scale }) => {
  const gridSize = 50; // Base grid size in pixels
  const adjustedSize = gridSize * scale;

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: `${adjustedSize}px ${adjustedSize}px`,
      }}
    />
  );
};

export default GridOverlay; 