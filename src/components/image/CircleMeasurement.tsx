import React, { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Circle {
  center: Point;
  radius: number;
  value: string;
}

interface CircleMeasurementProps {
  imageRef: React.RefObject<HTMLImageElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  scale: number;
  position: { x: number; y: number };
  pixelsPerMm: number;
  onMeasurementComplete: (measurement: any) => void;
  isActive: boolean;
  measurements: any[];
}

const CircleMeasurement: React.FC<CircleMeasurementProps> = ({
  imageRef,
  containerRef,
  scale,
  position,
  pixelsPerMm,
  onMeasurementComplete,
  isActive,
  measurements
}) => {
  const [center, setCenter] = useState<Point | null>(null);
  const [radius, setRadius] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getRelativeCoordinates = (e: React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return { x: 0, y: 0 };

    const canvasRect = canvas.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    const canvasX = e.clientX - canvasRect.left;
    const canvasY = e.clientY - canvasRect.top;

    const imageLeft = (canvasRect.width - imageRect.width) / 2;
    const imageTop = (canvasRect.height - imageRect.height) / 2;

    const imageX = (canvasX - imageLeft - position.x) / scale;
    const imageY = (canvasY - imageTop - position.y) / scale;

    return {
      x: Math.max(0, Math.min(imageX, image.width)),
      y: Math.max(0, Math.min(imageY, image.height))
    };
  };

  const calculateRadius = (point1: Point, point2: Point): number => {
    return Math.sqrt(
      Math.pow((point2.x - point1.x), 2) + 
      Math.pow((point2.y - point1.y), 2)
    );
  };

  const calculateArea = (radius: number): { radius: number; pixels: number; mm2: number } => {
    const actualRadius = radius / scale;
    const pixelArea = Math.PI * Math.pow(actualRadius, 2);
    const PIXEL_TO_MM_RATIO = 0.4;
    const mmArea = pixelArea * Math.pow(PIXEL_TO_MM_RATIO, 2);
    
    return {
      radius: actualRadius,
      pixels: pixelArea,
      mm2: mmArea
    };
  };

  const drawMeasurement = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;
    if (!canvas || !ctx || !image) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const toCanvasCoords = (point: Point) => {
      const imageLeft = (canvas.width - image.width * scale) / 2;
      const imageTop = (canvas.height - image.height * scale) / 2;
      return {
        x: point.x * scale + imageLeft + position.x,
        y: point.y * scale + imageTop + position.y
      };
    };

    // Draw existing measurements
    measurements.forEach(measurement => {
      if (measurement.type === 'circle' && measurement.circle) {
        const { center, radius } = measurement.circle;
        const centerCoords = toCanvasCoords(center);
        const radiusInCanvas = radius * scale;

        ctx.beginPath();
        ctx.arc(centerCoords.x, centerCoords.y, radiusInCanvas, 0, 2 * Math.PI);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw measurement value
        ctx.fillStyle = '#00ff00';
        ctx.font = '14px Arial';
        ctx.fillText(measurement.value, centerCoords.x + 5, centerCoords.y - 5);
      }
    });

    // Draw current circle if exists
    if (center && radius > 0) {
      const centerCoords = toCanvasCoords(center);
      const radiusInCanvas = radius;

      ctx.beginPath();
      ctx.arc(centerCoords.x, centerCoords.y, radiusInCanvas, 0, 2 * Math.PI);
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
  }, [measurements, center, radius, scale, position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    const coords = getRelativeCoordinates(e);
    setCenter(coords);
    setRadius(0);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !isActive || !center) return;
    const coords = getRelativeCoordinates(e);
    const newRadius = calculateRadius(center, coords);
    setRadius(newRadius);
    drawMeasurement();
  };

  const handleMouseUp = () => {
    if (!isActive || !center || radius === 0) return;
    setIsDrawing(false);

    const measurements = calculateArea(radius);
    const measurementValue = `R: ${measurements.radius.toFixed(1)}mm, A: ${measurements.pixels.toFixed(1)}mm²`;

    onMeasurementComplete({
      id: Date.now().toString(),
      type: 'circle',
      value: measurementValue,
      circle: { center, radius: radius / scale },
      timestamp: new Date()
    });

    setCenter(null);
    setRadius(0);
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

export default CircleMeasurement;