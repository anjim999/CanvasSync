import { useCallback, useRef, useState } from 'react';
import type { Point, DrawAction, Tool } from '../types';

interface UseDrawProps {
    onDraw: (action: DrawAction) => void;
    currentTool: Tool;
    currentColor: string;
    strokeWidth: number;
    userId: string | null;
}

export function useDraw({ onDraw, currentTool, currentColor, strokeWidth, userId }: UseDrawProps) {
    const [isDrawing, setIsDrawing] = useState(false);
    const currentAction = useRef<DrawAction | null>(null);
    const lastPoint = useRef<Point | null>(null);

    // Get normalized canvas coordinates
    const getCanvasCoordinates = useCallback(
        (event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): Point => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            let clientX: number, clientY: number;

            if ('touches' in event) {
                clientX = event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX ?? 0;
                clientY = event.touches[0]?.clientY ?? event.changedTouches[0]?.clientY ?? 0;
            } else {
                clientX = event.clientX;
                clientY = event.clientY;
            }

            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY,
            };
        },
        []
    );

    // Start drawing
    const startDrawing = useCallback(
        (event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
            if (!userId) return;

            const point = getCanvasCoordinates(event, canvas);
            setIsDrawing(true);
            lastPoint.current = point;

            // Create new action
            currentAction.current = {
                id: `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                odId: userId,
                type: currentTool === 'brush' || currentTool === 'eraser' ? 'stroke' : 'shape',
                tool: currentTool,
                points: [point],
                color: currentTool === 'eraser' ? '#0f0f1a' : currentColor, // Eraser uses background color
                strokeWidth: currentTool === 'eraser' ? strokeWidth * 2 : strokeWidth,
                timestamp: Date.now(),
            };
        },
        [userId, currentTool, currentColor, strokeWidth, getCanvasCoordinates]
    );

    // Continue drawing
    const draw = useCallback(
        (event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
            if (!isDrawing || !currentAction.current || !lastPoint.current) return;

            const currentPoint = getCanvasCoordinates(event, canvas);

            // Draw on local canvas immediately for smooth experience
            drawLine(ctx, lastPoint.current, currentPoint, currentAction.current);

            // Add point to action
            currentAction.current.points.push(currentPoint);
            lastPoint.current = currentPoint;
        },
        [isDrawing, getCanvasCoordinates]
    );

    // Stop drawing and emit action
    const stopDrawing = useCallback(() => {
        if (!isDrawing || !currentAction.current) {
            setIsDrawing(false);
            return;
        }

        // Only emit if there are enough points
        if (currentAction.current.points.length > 1) {
            onDraw(currentAction.current);
        }

        setIsDrawing(false);
        currentAction.current = null;
        lastPoint.current = null;
    }, [isDrawing, onDraw]);

    return {
        isDrawing,
        startDrawing,
        draw,
        stopDrawing,
        getCanvasCoordinates,
    };
}

// Draw a line segment
export function drawLine(
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point,
    action: DrawAction
): void {
    ctx.beginPath();
    ctx.strokeStyle = action.color;
    ctx.lineWidth = action.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (action.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.globalCompositeOperation = 'source-over';
    }

    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
}

// Draw a complete action (for replay)
export function drawAction(ctx: CanvasRenderingContext2D, action: DrawAction): void {
    if (action.isUndone) return;

    if (action.type === 'stroke') {
        const points = action.points;
        if (points.length < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = action.color;
        ctx.lineWidth = action.strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (action.tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
        }

        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        ctx.globalCompositeOperation = 'source-over';
    } else if (action.type === 'shape' && action.points.length >= 2) {
        const start = action.points[0];
        const end = action.points[action.points.length - 1];

        ctx.beginPath();
        ctx.strokeStyle = action.color;
        ctx.lineWidth = action.strokeWidth;
        ctx.lineCap = 'round';

        if (action.tool === 'rectangle') {
            ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
        } else if (action.tool === 'circle') {
            const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (action.tool === 'line') {
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    } else if (action.type === 'text' && action.text && action.points.length > 0) {
        const pos = action.points[0];
        ctx.fillStyle = action.color;
        ctx.font = `${action.strokeWidth * 4}px Inter, sans-serif`;
        ctx.fillText(action.text, pos.x, pos.y);
    }
}

// Redraw entire canvas from actions
export function redrawCanvas(
    ctx: CanvasRenderingContext2D,
    actions: DrawAction[],
    canvasWidth: number,
    canvasHeight: number
): void {
    // Clear canvas
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Redraw all non-undone actions
    actions.filter((a) => !a.isUndone).forEach((action) => drawAction(ctx, action));
}
