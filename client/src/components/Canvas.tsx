import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { DrawAction, Point, Tool } from '../types';
import { useDraw, drawAction, redrawCanvas } from '../hooks/useDraw';
import { FPSCounter } from './canvas/FPSCounter';
import { RemoteCursorOverlay } from './canvas/RemoteCursorOverlay';

interface CanvasProps {
    currentTool: Tool;
    currentColor: string;
    strokeWidth: number;
    userId: string | null;
    actions: DrawAction[];
    onDraw: (action: DrawAction) => void;
    onCursorMove: (position: Point) => void;
    remoteCursors: Map<string, { position: Point; color: string; username: string }>;
    onActionsChange: (actions: DrawAction[]) => void;
    backgroundColor?: string;
    isDarkTheme?: boolean;
    isFilled?: boolean;
}

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

export const Canvas: React.FC<CanvasProps> = ({
    currentTool,
    currentColor,
    strokeWidth,
    userId,
    actions,
    onDraw,
    onCursorMove,
    remoteCursors,
    onActionsChange,
    backgroundColor = '#0f0f1a', // Default fallback
    isDarkTheme = true,
    isFilled = false,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fpsRef = useRef({ frames: 0, lastTime: Date.now(), fps: 60 });
    const [fps, setFps] = useState(60);

    const { isDrawing, startDrawing, draw, stopDrawing, getCanvasCoordinates } = useDraw({
        onDraw,
        currentTool,
        currentColor,
        strokeWidth,
        userId,
        isFilled,
    });

    // Store refs for touch handlers to access latest values
    const isDrawingRef = useRef(isDrawing);
    const drawRef = useRef(draw);
    const getCanvasCoordinatesRef = useRef(getCanvasCoordinates);
    const onCursorMoveRef = useRef(onCursorMove);
    const startDrawingRef = useRef(startDrawing);
    const stopDrawingRef = useRef(stopDrawing);

    useEffect(() => {
        isDrawingRef.current = isDrawing;
        drawRef.current = draw;
        getCanvasCoordinatesRef.current = getCanvasCoordinates;
        onCursorMoveRef.current = onCursorMove;
        startDrawingRef.current = startDrawing;
        stopDrawingRef.current = stopDrawing;
    }, [isDrawing, draw, getCanvasCoordinates, onCursorMove, startDrawing, stopDrawing]);

    // FPS counter
    useEffect(() => {
        const updateFps = () => {
            const now = Date.now();
            fpsRef.current.frames++;

            if (now - fpsRef.current.lastTime >= 1000) {
                setFps(fpsRef.current.frames);
                fpsRef.current.frames = 0;
                fpsRef.current.lastTime = now;
            }
            requestAnimationFrame(updateFps);
        };

        const animationId = requestAnimationFrame(updateFps);
        return () => cancelAnimationFrame(animationId);
    }, []);

    // Redraw canvas when actions change
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        redrawCanvas(ctx, actions, CANVAS_WIDTH, CANVAS_HEIGHT);
    }, [actions]);

    // Add non-passive touch event listeners to prevent scrolling
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            startDrawingRef.current(e, canvas);
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const position = getCanvasCoordinatesRef.current(e, canvas);
            onCursorMoveRef.current(position);

            if (isDrawingRef.current) {
                drawRef.current(e, canvas, ctx);
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            e.preventDefault();
            stopDrawingRef.current();
        };

        // Add event listeners with { passive: false } to allow preventDefault
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
        canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, []);

    // Handle mouse events
    const handlePointerDown = useCallback(
        (e: React.MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            startDrawing(e.nativeEvent, canvas);
        },
        [startDrawing]
    );

    const handlePointerMove = useCallback(
        (e: React.MouseEvent) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) return;

            const position = getCanvasCoordinates(e.nativeEvent, canvas);
            onCursorMove(position);

            if (isDrawing) {
                draw(e.nativeEvent, canvas, ctx);
            }
        },
        [isDrawing, draw, getCanvasCoordinates, onCursorMove]
    );

    const handlePointerUp = useCallback(() => {
        stopDrawing();
    }, [stopDrawing]);

    const handlePointerLeave = useCallback(() => {
        if (isDrawing) {
            stopDrawing();
        }
    }, [isDrawing, stopDrawing]);

    // Handle incoming remote draw action (kept for potential external use)
    const handleRemoteDrawAction = useCallback(
        (action: DrawAction) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) return;

            drawAction(ctx, action);
            onActionsChange([...actions, action]);
        },
        [actions, onActionsChange]
    );

    useEffect(() => {
        // This effect can be used to handle external updates
    }, [handleRemoteDrawAction]);

    const containerStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor,
    };

    const canvasStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: 'fill',
        backgroundColor,
        cursor: 'crosshair',
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
    };

    return (
        <div ref={containerRef} style={containerStyle}>
            {/* FPS Counter */}
            <FPSCounter fps={fps} isDarkTheme={isDarkTheme} />

            {/* Main Canvas */}
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={canvasStyle}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerLeave}
            />

            {/* Remote Cursors */}
            <RemoteCursorOverlay
                remoteCursors={remoteCursors}
                canvasRef={canvasRef}
                containerRef={containerRef}
                canvasWidth={CANVAS_WIDTH}
                canvasHeight={CANVAS_HEIGHT}
            />
        </div>
    );
};
