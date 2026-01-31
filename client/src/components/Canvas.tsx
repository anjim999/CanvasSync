import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { DrawAction, Point, Tool } from '../types';
import { useDraw, drawAction } from '../hooks/useDraw';
import { findActionAtPoint } from '../utils/drawUtils';
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
    onMoveAction?: (actionId: string, deltaX: number, deltaY: number) => void;
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
    onMoveAction,
    remoteCursors,
    onActionsChange,
    backgroundColor = '#0f0f1a',
    isDarkTheme = true,
    isFilled = false,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fpsRef = useRef({ frames: 0, lastTime: Date.now(), fps: 60 });
    const [fps, setFps] = useState(60);

    // Select/Move state
    const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
    const dragStartRef = useRef<Point | null>(null);

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
    const currentToolRef = useRef(currentTool);
    const actionsRef = useRef(actions);

    useEffect(() => {
        isDrawingRef.current = isDrawing;
        drawRef.current = draw;
        getCanvasCoordinatesRef.current = getCanvasCoordinates;
        onCursorMoveRef.current = onCursorMove;
        startDrawingRef.current = startDrawing;
        stopDrawingRef.current = stopDrawing;
        currentToolRef.current = currentTool;
        actionsRef.current = actions;
    }, [isDrawing, draw, getCanvasCoordinates, onCursorMove, startDrawing, stopDrawing, currentTool, actions]);

    // Clear selection when switching away from select tool
    useEffect(() => {
        if (currentTool !== 'select') {
            setSelectedActionId(null);
            setIsDragging(false);
            setDragOffset({ x: 0, y: 0 });
        }
    }, [currentTool]);

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

    // Redraw canvas with selection highlight and drag preview
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Clear and redraw all actions
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        actions.filter(a => !a.isUndone).forEach((action) => {
            // If this is the selected action and we're dragging, draw with offset
            if (isDragging && action.id === selectedActionId) {
                const offsetAction: DrawAction = {
                    ...action,
                    points: action.points.map(p => ({
                        x: p.x + dragOffset.x,
                        y: p.y + dragOffset.y
                    }))
                };
                drawAction(ctx, offsetAction);
            } else {
                drawAction(ctx, action);
            }
        });

        // Draw selection highlight around the actual shape
        if (selectedActionId) {
            const selected = actions.find(a => a.id === selectedActionId && !a.isUndone);
            if (selected && selected.points.length >= 2) {
                const offsetX = isDragging ? dragOffset.x : 0;
                const offsetY = isDragging ? dragOffset.y : 0;

                const start = {
                    x: selected.points[0].x + offsetX,
                    y: selected.points[0].y + offsetY
                };
                const end = {
                    x: selected.points[selected.points.length - 1].x + offsetX,
                    y: selected.points[selected.points.length - 1].y + offsetY
                };

                ctx.save();
                ctx.strokeStyle = '#6366f1';
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 4]);

                const padding = 8;

                if (selected.tool === 'circle') {
                    // Circle selection - draw circular outline
                    const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) + padding;
                    ctx.beginPath();
                    ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (selected.tool === 'triangle') {
                    // Triangle selection
                    const width = end.x - start.x;
                    const top = { x: start.x + width / 2, y: start.y - padding };
                    const bottomLeft = { x: start.x - padding, y: end.y + padding };
                    const bottomRight = { x: end.x + padding, y: end.y + padding };
                    ctx.beginPath();
                    ctx.moveTo(top.x, top.y);
                    ctx.lineTo(bottomLeft.x, bottomLeft.y);
                    ctx.lineTo(bottomRight.x, bottomRight.y);
                    ctx.closePath();
                    ctx.stroke();
                } else if (selected.tool === 'diamond') {
                    // Diamond selection
                    const centerX = (start.x + end.x) / 2;
                    const centerY = (start.y + end.y) / 2;
                    ctx.beginPath();
                    ctx.moveTo(centerX, start.y - padding);
                    ctx.lineTo(end.x + padding, centerY);
                    ctx.lineTo(centerX, end.y + padding);
                    ctx.lineTo(start.x - padding, centerY);
                    ctx.closePath();
                    ctx.stroke();
                } else if (selected.tool === 'line' || selected.tool === 'arrow') {
                    // Line/Arrow selection - draw parallel lines
                    const angle = Math.atan2(end.y - start.y, end.x - start.x);
                    const perpX = Math.cos(angle + Math.PI / 2) * padding;
                    const perpY = Math.sin(angle + Math.PI / 2) * padding;
                    ctx.beginPath();
                    ctx.moveTo(start.x + perpX, start.y + perpY);
                    ctx.lineTo(end.x + perpX, end.y + perpY);
                    ctx.lineTo(end.x - perpX, end.y - perpY);
                    ctx.lineTo(start.x - perpX, start.y - perpY);
                    ctx.closePath();
                    ctx.stroke();
                } else if (selected.tool === 'rectangle') {
                    // Rectangle selection
                    const minX = Math.min(start.x, end.x) - padding;
                    const minY = Math.min(start.y, end.y) - padding;
                    const maxX = Math.max(start.x, end.x) + padding;
                    const maxY = Math.max(start.y, end.y) + padding;
                    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
                } else {
                    // Brush/eraser strokes - use bounding box (no shape to follow)
                    const xs = selected.points.map(p => p.x + offsetX);
                    const ys = selected.points.map(p => p.y + offsetY);
                    const minX = Math.min(...xs) - padding;
                    const maxX = Math.max(...xs) + padding;
                    const minY = Math.min(...ys) - padding;
                    const maxY = Math.max(...ys) + padding;
                    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
                }

                ctx.restore();
            }
        }
    }, [actions, selectedActionId, isDragging, dragOffset]);

    // Add non-passive touch event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            const position = getCanvasCoordinatesRef.current(e, canvas);

            if (currentToolRef.current === 'select') {
                const found = findActionAtPoint(actionsRef.current, position);
                if (found) {
                    setSelectedActionId(found.id);
                    setIsDragging(true);
                    dragStartRef.current = position;
                    setDragOffset({ x: 0, y: 0 });
                } else {
                    setSelectedActionId(null);
                }
            } else {
                startDrawingRef.current(e, canvas);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const position = getCanvasCoordinatesRef.current(e, canvas);
            onCursorMoveRef.current(position);

            if (currentToolRef.current === 'select' && isDragging && dragStartRef.current) {
                setDragOffset({
                    x: position.x - dragStartRef.current.x,
                    y: position.y - dragStartRef.current.y
                });
            } else if (isDrawingRef.current) {
                drawRef.current(e, canvas, ctx);
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            e.preventDefault();
            if (currentToolRef.current === 'select' && isDragging && selectedActionId && dragStartRef.current) {
                const position = getCanvasCoordinatesRef.current(e, canvas);
                const deltaX = position.x - dragStartRef.current.x;
                const deltaY = position.y - dragStartRef.current.y;

                if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
                    // Optimistic local update
                    const updatedActions = actionsRef.current.map(action => {
                        if (action.id === selectedActionId) {
                            return {
                                ...action,
                                points: action.points.map(p => ({
                                    x: p.x + deltaX,
                                    y: p.y + deltaY
                                }))
                            };
                        }
                        return action;
                    });
                    onActionsChange(updatedActions);
                    onMoveAction?.(selectedActionId, deltaX, deltaY);
                }
                setIsDragging(false);
                setDragOffset({ x: 0, y: 0 });
                dragStartRef.current = null;
            } else {
                stopDrawingRef.current();
            }
        };

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
    }, [isDragging, selectedActionId, onMoveAction]);

    // Mouse event handlers
    const handlePointerDown = useCallback(
        (e: React.MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const position = getCanvasCoordinates(e.nativeEvent, canvas);

            if (currentTool === 'select') {
                const found = findActionAtPoint(actions, position);
                if (found) {
                    setSelectedActionId(found.id);
                    setIsDragging(true);
                    dragStartRef.current = position;
                    setDragOffset({ x: 0, y: 0 });
                } else {
                    setSelectedActionId(null);
                }
            } else {
                startDrawing(e.nativeEvent, canvas);
            }
        },
        [currentTool, actions, startDrawing, getCanvasCoordinates]
    );

    const handlePointerMove = useCallback(
        (e: React.MouseEvent) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) return;

            const position = getCanvasCoordinates(e.nativeEvent, canvas);
            onCursorMove(position);

            if (currentTool === 'select' && isDragging && dragStartRef.current) {
                setDragOffset({
                    x: position.x - dragStartRef.current.x,
                    y: position.y - dragStartRef.current.y
                });
            } else if (isDrawing) {
                draw(e.nativeEvent, canvas, ctx);
            }
        },
        [currentTool, isDragging, isDrawing, draw, getCanvasCoordinates, onCursorMove]
    );

    const handlePointerUp = useCallback(
        (e: React.MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            if (currentTool === 'select' && isDragging && selectedActionId && dragStartRef.current) {
                const position = getCanvasCoordinates(e.nativeEvent, canvas);
                const deltaX = position.x - dragStartRef.current.x;
                const deltaY = position.y - dragStartRef.current.y;

                if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
                    // Optimistic local update - update the action immediately to prevent flicker
                    const updatedActions = actions.map(action => {
                        if (action.id === selectedActionId) {
                            return {
                                ...action,
                                points: action.points.map(p => ({
                                    x: p.x + deltaX,
                                    y: p.y + deltaY
                                }))
                            };
                        }
                        return action;
                    });
                    onActionsChange(updatedActions);

                    // Then send to server for sync with other users
                    onMoveAction?.(selectedActionId, deltaX, deltaY);
                }

                // Reset drag state AFTER updating actions
                setIsDragging(false);
                setDragOffset({ x: 0, y: 0 });
                dragStartRef.current = null;
            } else {
                stopDrawing();
            }
        },
        [currentTool, isDragging, selectedActionId, actions, stopDrawing, getCanvasCoordinates, onMoveAction, onActionsChange]
    );

    const handlePointerLeave = useCallback(() => {
        if (isDrawing) {
            stopDrawing();
        }
        if (isDragging) {
            setIsDragging(false);
            setDragOffset({ x: 0, y: 0 });
            dragStartRef.current = null;
        }
    }, [isDrawing, isDragging, stopDrawing]);

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
        cursor: currentTool === 'select' ? (isDragging ? 'grabbing' : 'grab') : 'crosshair',
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
    };

    return (
        <div ref={containerRef} style={containerStyle}>
            <FPSCounter fps={fps} isDarkTheme={isDarkTheme} />

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
