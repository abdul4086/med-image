import React, { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface LineMeasurementProps {
  imageRef: React.RefObject<HTMLImageElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  scale: number;
  position: { x: number; y: number };
  pixelsPerMm: number;
  onMeasurementComplete: (measurement: any) => void;
  isActive: boolean;
}

const LineMeasurement: React.FC<LineMeasurementProps> = ({
  imageRef,
  containerRef,
  scale,
  position,
  pixelsPerMm,
  onMeasurementComplete,
  isActive
}) => {
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateRealDistance = (p1: Point, p2: Point): { pixels: number; mm: number } => {
    // Calculate pixel distance and adjust for scale
    const pixelDistance = Math.sqrt(
      Math.pow((p2.x - p1.x), 2) + 
      Math.pow((p2.y - p1.y), 2)
    ) / scale; // Divide by scale to get actual pixel distance

    // Convert to millimeters using fixed ratio (0.4 mm/pixel)
    const PIXEL_TO_MM_RATIO = 0.4;
    const mmDistance = pixelDistance * PIXEL_TO_MM_RATIO;
    
    return {
      pixels: pixelDistance,
      mm: mmDistance
    };
  };

  const drawMeasurement = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !startPoint || !endPoint) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate real-world distance
    const distance = calculateRealDistance(startPoint, endPoint);

    // Draw line
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw endpoints
    [startPoint, endPoint].forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#00ff00';
      ctx.fill();
    });

    // Calculate midpoint for text placement
    const midPoint = {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2 - 15
    };

    // Prepare measurement text
    const measurementText = `${distance.pixels.toFixed(1)} mm`;

    // Add background to text for better visibility
    ctx.font = '14px Arial';
    const textMetrics = ctx.measureText(measurementText);
    const padding = 4;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(
      midPoint.x - textMetrics.width / 2 - padding,
      midPoint.y - 8 - padding,
      textMetrics.width + padding * 2,
      16 + padding * 2
    );

    // Draw measurement text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(measurementText, midPoint.x, midPoint.y);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    drawMeasurement();
  }, [startPoint, endPoint, scale, position, pixelsPerMm]);

  const getRelativeCoordinates = (e: React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    const coords = getRelativeCoordinates(e);
    setStartPoint(coords);
    setEndPoint(coords);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !isActive) return;
    const coords = getRelativeCoordinates(e);
    setEndPoint(coords);
  };

  const handleMouseUp = () => {
    if (!isActive || !startPoint || !endPoint) return;
    setIsDrawing(false);

    const distance = calculateRealDistance(startPoint, endPoint);
    const measurementValue = pixelsPerMm > 0
      ? `${distance.mm.toFixed(1)} mm`
      : `${distance.pixels.toFixed(1)} px`;

    onMeasurementComplete({
      id: Date.now().toString(),
      type: 'line',
      value: measurementValue,
      points: { start: startPoint, end: endPoint },
      timestamp: new Date()
    });

    // Keep the measurement visible but reset for next measurement
    setStartPoint(null);
    setEndPoint(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default LineMeasurement;