import { useCallback, useRef, useState } from 'react';
import type { Point, DrawAction, Tool } from '../types';
import { drawLine, drawAction, redrawCanvas } from '../utils/drawUtils';

export { drawAction, redrawCanvas };

interface UseDrawProps {
    onDraw: (action: DrawAction) => void;
    currentTool: Tool;
    currentColor: string;
    strokeWidth: number;
    userId: string | null;
    isFilled?: boolean;
}

export function useDraw({ onDraw, currentTool, currentColor, strokeWidth, userId, isFilled = false }: UseDrawProps) {
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
                isFilled: isFilled && currentTool !== 'line' && currentTool !== 'arrow' && currentTool !== 'brush' && currentTool !== 'eraser',
                timestamp: Date.now(),
            };
        },
        [userId, currentTool, currentColor, strokeWidth, isFilled, getCanvasCoordinates]
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
