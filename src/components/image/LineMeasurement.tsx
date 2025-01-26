import React, { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Measurement {
  startPoint: Point;
  endPoint: Point;
  value: string;
}

interface LineMeasurementProps {
  imageRef: React.RefObject<HTMLImageElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  scale: number;
  position: { x: number; y: number };
  pixelsPerMm: number;
  onMeasurementComplete: (measurement: any) => void;
  isActive: boolean;
  measurements: any[];
}

const LineMeasurement: React.FC<LineMeasurementProps> = ({
  imageRef,
  containerRef,
  scale,
  position,
  pixelsPerMm,
  onMeasurementComplete,
  isActive,
  measurements
}) => {
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [completedMeasurements, setCompletedMeasurements] = useState<Measurement[]>([]);
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

  const getRelativeCoordinates = (e: React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return { x: 0, y: 0 };

    const canvasRect = canvas.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    // Get mouse position relative to canvas
    const canvasX = e.clientX - canvasRect.left;
    const canvasY = e.clientY - canvasRect.top;

    // Calculate image position within canvas
    const imageLeft = (canvasRect.width - imageRect.width) / 2;
    const imageTop = (canvasRect.height - imageRect.height) / 2;

    // Convert canvas coordinates to image coordinates
    const imageX = (canvasX - imageLeft - position.x) / scale;
    const imageY = (canvasY - imageTop - position.y) / scale;

    // Return coordinates in image space
    return {
      x: Math.max(0, Math.min(imageX, image.width)),
      y: Math.max(0, Math.min(imageY, image.height))
    };
  };

  const drawMeasurement = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;
    if (!canvas || !ctx || !image) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Function to convert image coordinates to canvas coordinates
    const toCanvasCoords = (point: Point) => {
      const imageLeft = (canvas.width - image.width * scale) / 2;
      const imageTop = (canvas.height - image.height * scale) / 2;
      return {
        x: point.x * scale + imageLeft + position.x,
        y: point.y * scale + imageTop + position.y
      };
    };

    // Draw all existing measurements
    measurements.forEach(measurement => {
      if (measurement.type === 'line' && measurement.points) {
        const { start, end } = measurement.points;
        const startCoords = toCanvasCoords(start);
        const endCoords = toCanvasCoords(end);

        ctx.beginPath();
        ctx.moveTo(startCoords.x, startCoords.y);
        ctx.lineTo(endCoords.x, endCoords.y);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw measurement value
        const midX = (startCoords.x + endCoords.x) / 2;
        const midY = (startCoords.y + endCoords.y) / 2;
        ctx.fillStyle = '#00ff00';
        ctx.font = '14px Arial';
        ctx.fillText(measurement.value, midX + 5, midY - 5);
      }
    });

    // Draw current measurement if exists
    if (startPoint && endPoint) {
      const start = toCanvasCoords(startPoint);
      const end = toCanvasCoords(endPoint);

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    drawMeasurement();
  }, [measurements, startPoint, endPoint, scale, position]);

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
    drawMeasurement();
  };

  const handleMouseUp = () => {
    if (!isActive || !startPoint || !endPoint) return;
    setIsDrawing(false);

    const distance = calculateRealDistance(startPoint, endPoint);
    const measurementValue = pixelsPerMm > 0
      ? `${distance.mm.toFixed(1)} mm`
      : `${distance.pixels.toFixed(1)} mm`;

    // Add to completed measurements
    setCompletedMeasurements(prev => [...prev, {
      startPoint,
      endPoint,
      value: measurementValue
    }]);

    onMeasurementComplete({
      id: Date.now().toString(),
      type: 'line',
      value: measurementValue,
      points: { start: startPoint, end: endPoint },
      timestamp: new Date()
    });

    // Reset current drawing points
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