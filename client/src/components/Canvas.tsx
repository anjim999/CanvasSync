import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { DrawAction, Point, Tool } from '../types';
import { useDraw, drawAction, redrawCanvas } from '../hooks/useDraw';

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

    const fpsCounterStyle: React.CSSProperties = {
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 20,
        backgroundColor: isDarkTheme ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: '4px 12px',
        borderRadius: '8px',
        border: isDarkTheme ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        color: isDarkTheme ? '#4ade80' : '#15803d', // Green text for FPS
        fontWeight: 600,
        boxShadow: isDarkTheme ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
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
            <div style={fpsCounterStyle}>
                <span style={{ color: '#4ade80', fontWeight: 600 }}>{fps}</span>
                <span style={{ color: '#9ca3af', marginLeft: '4px' }}>FPS</span>
            </div>

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
            {Array.from(remoteCursors.entries()).map(([odId, { position, color, username }]) => {
                const canvas = canvasRef.current;
                const container = containerRef.current;
                if (!canvas || !container) return null;

                const rect = canvas.getBoundingClientRect();
                const scaleX = rect.width / CANVAS_WIDTH;
                const scaleY = rect.height / CANVAS_HEIGHT;

                const screenX = position.x * scaleX + (container.clientWidth - rect.width) / 2;
                const screenY = position.y * scaleY + (container.clientHeight - rect.height) / 2;

                return (
                    <div
                        key={odId}
                        style={{
                            position: 'absolute',
                            left: screenX,
                            top: screenY,
                            transform: 'translate(-2px, -2px)',
                            pointerEvents: 'none',
                            zIndex: 30,
                        }}
                    >
                        {/* Cursor dot */}
                        <div
                            style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                backgroundColor: color,
                                border: '2px solid white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            }}
                        />
                        {/* Username label */}
                        <div
                            style={{
                                position: 'absolute',
                                left: '20px',
                                top: '0',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                whiteSpace: 'nowrap',
                                backgroundColor: color,
                                color: 'white',
                                fontWeight: 500,
                            }}
                        >
                            {username}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
