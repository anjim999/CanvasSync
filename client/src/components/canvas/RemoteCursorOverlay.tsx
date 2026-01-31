import React from 'react';
import type { Point } from '../../types';

interface RemoteCursorOverlayProps {
    remoteCursors: Map<string, { position: Point; color: string; username: string }>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    canvasWidth: number;
    canvasHeight: number;
}

export const RemoteCursorOverlay: React.FC<RemoteCursorOverlayProps> = ({
    remoteCursors,
    canvasRef,
    containerRef,
    canvasWidth,
    canvasHeight,
}) => {
    return (
        <>
            {Array.from(remoteCursors.entries()).map(([odId, { position, color, username }]) => {
                const canvas = canvasRef.current;
                const container = containerRef.current;
                if (!canvas || !container) return null;

                const rect = canvas.getBoundingClientRect();
                const scaleX = rect.width / canvasWidth;
                const scaleY = rect.height / canvasHeight;

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
        </>
    );
};
