import React, { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface AngleMeasurementProps {
  imageRef: React.RefObject<HTMLImageElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  scale: number;
  position: { x: number; y: number };
  pixelsPerMm: number;
  onMeasurementComplete: (measurement: any) => void;
  isActive: boolean;
  measurements: any[];
}

const AngleMeasurement: React.FC<AngleMeasurementProps> = ({
  imageRef,
  containerRef,
  scale,
  position,
  onMeasurementComplete,
  isActive,
  measurements
}) => {
  const [points, setPoints] = useState<Point[]>([]);
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

  const calculateAngle = (p1: Point, p2: Point, p3: Point): number => {
    const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    let angle = (angle2 - angle1) * (180 / Math.PI);
    
    if (angle < 0) angle += 360;

    // Return the smaller angle (0 to 180 degrees)
    return angle > 180 ? 360 - angle : angle;
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
      if (measurement.type === 'angle' && measurement.points) {
        const { p1, p2, p3 } = measurement.points;
        const point1 = toCanvasCoords(p1);
        const point2 = toCanvasCoords(p2);
        const point3 = toCanvasCoords(p3);

        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.lineTo(point3.x, point3.y);
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw angle value
        const angle = calculateAngle(p1, p2, p3);
        ctx.fillStyle = '#00FF00';
        ctx.font = '14px Arial';
        ctx.fillText(`${angle.toFixed(1)}°`, point2.x + 10, point2.y + 10);
      }
    });

    // Draw current measurement
    if (points.length > 0) {
      const canvasPoints = points.map(toCanvasCoords);
      
      ctx.beginPath();
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      
      canvasPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      
      ctx.stroke();

      if (points.length === 3) {
        const angle = calculateAngle(points[0], points[1], points[2]);
        
        // Draw angle value
        ctx.fillStyle = '#00FF00';
        ctx.font = '14px Arial';
        ctx.fillText(`${angle.toFixed(1)}°`, canvasPoints[1].x + 10, canvasPoints[1].y + 10);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    drawMeasurement();
  }, [measurements, points, scale, position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    const coords = getRelativeCoordinates(e);
    
    if (points.length < 3) {
      setPoints([...points, coords]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive) return;
    drawMeasurement();
  };

  const handleMouseUp = () => {
    if (!isActive) return;
    
    if (points.length === 3) {
      const angle = calculateAngle(points[0], points[1], points[2]);
      
      onMeasurementComplete({
        id: Date.now().toString(),
        type: 'angle',
        value: `${angle.toFixed(1)}°`,
        points: {
          p1: points[0],
          p2: points[1],
          p3: points[2]
        },
        timestamp: new Date()
      });

      setPoints([]);
    }
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

export default AngleMeasurement; 