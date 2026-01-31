import type { DrawAction, Point } from '../types';

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
        ctx.fillStyle = action.color;
        ctx.lineCap = 'round';

        if (action.tool === 'rectangle') {
            if (action.isFilled) {
                ctx.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
            } else {
                ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
            }
        } else if (action.tool === 'circle') {
            const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            ctx.beginPath();
            ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
            if (action.isFilled) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        } else if (action.tool === 'line') {
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        } else if (action.tool === 'arrow') {
            // Draw line
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw arrowhead
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            const headLength = Math.max(15, action.strokeWidth * 3);

            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
                end.x - headLength * Math.cos(angle - Math.PI / 6),
                end.y - headLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
                end.x - headLength * Math.cos(angle + Math.PI / 6),
                end.y - headLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
        } else if (action.tool === 'triangle') {
            const width = end.x - start.x;

            ctx.beginPath();
            ctx.moveTo(start.x + width / 2, start.y);  // Top
            ctx.lineTo(start.x, end.y);                // Bottom left
            ctx.lineTo(end.x, end.y);                  // Bottom right
            ctx.closePath();

            if (action.isFilled) {
                ctx.fill();
            } else {
                ctx.stroke();
            }

        } else if (action.tool === 'diamond') {
            const centerX = (start.x + end.x) / 2;
            const centerY = (start.y + end.y) / 2;

            ctx.beginPath();
            ctx.moveTo(centerX, start.y); // Top
            ctx.lineTo(end.x, centerY);   // Right
            ctx.lineTo(centerX, end.y);   // Bottom
            ctx.lineTo(start.x, centerY); // Left
            ctx.closePath();

            if (action.isFilled) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
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
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Redraw all non-undone actions
    actions.filter((a) => !a.isUndone).forEach((action) => drawAction(ctx, action));
}
