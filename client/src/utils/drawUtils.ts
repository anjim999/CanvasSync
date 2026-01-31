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

// Hit detection - check if a point is inside an action's bounds
export function hitTestAction(action: DrawAction, point: Point, tolerance: number = 10): boolean {
    if (action.isUndone) return false;
    if (action.points.length < 2) return false;

    const start = action.points[0];
    const end = action.points[action.points.length - 1];

    if (action.type === 'stroke') {
        // For strokes, check distance to any segment
        for (let i = 0; i < action.points.length - 1; i++) {
            const dist = distanceToSegment(point, action.points[i], action.points[i + 1]);
            if (dist <= tolerance + action.strokeWidth / 2) return true;
        }
        return false;
    }

    if (action.tool === 'rectangle') {
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);
        return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
    }

    if (action.tool === 'circle') {
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        const dist = Math.sqrt(Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2));
        return dist <= radius;
    }

    if (action.tool === 'triangle') {
        const width = end.x - start.x;
        const top = { x: start.x + width / 2, y: start.y };
        const bottomLeft = { x: start.x, y: end.y };
        const bottomRight = { x: end.x, y: end.y };
        return pointInTriangle(point, top, bottomLeft, bottomRight);
    }

    if (action.tool === 'diamond') {
        const centerX = (start.x + end.x) / 2;
        const centerY = (start.y + end.y) / 2;
        const top = { x: centerX, y: start.y };
        const right = { x: end.x, y: centerY };
        const bottom = { x: centerX, y: end.y };
        const left = { x: start.x, y: centerY };
        // Diamond is two triangles
        return pointInTriangle(point, top, right, left) || pointInTriangle(point, bottom, right, left);
    }

    if (action.tool === 'line' || action.tool === 'arrow') {
        const dist = distanceToSegment(point, start, end);
        return dist <= tolerance + action.strokeWidth / 2;
    }

    return false;
}

// Distance from point to line segment
function distanceToSegment(p: Point, a: Point, b: Point): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSq = dx * dx + dy * dy;

    if (lengthSq === 0) {
        return Math.sqrt(Math.pow(p.x - a.x, 2) + Math.pow(p.y - a.y, 2));
    }

    let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));

    const nearestX = a.x + t * dx;
    const nearestY = a.y + t * dy;

    return Math.sqrt(Math.pow(p.x - nearestX, 2) + Math.pow(p.y - nearestY, 2));
}

// Check if point is inside triangle using barycentric coordinates
function pointInTriangle(p: Point, a: Point, b: Point, c: Point): boolean {
    const v0x = c.x - a.x;
    const v0y = c.y - a.y;
    const v1x = b.x - a.x;
    const v1y = b.y - a.y;
    const v2x = p.x - a.x;
    const v2y = p.y - a.y;

    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v0x * v1x + v0y * v1y;
    const dot02 = v0x * v2x + v0y * v2y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v1x * v2x + v1y * v2y;

    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return u >= 0 && v >= 0 && u + v <= 1;
}

// Find action at point (returns the topmost one)
export function findActionAtPoint(actions: DrawAction[], point: Point): DrawAction | null {
    // Search from end (topmost) to beginning
    for (let i = actions.length - 1; i >= 0; i--) {
        if (hitTestAction(actions[i], point)) {
            return actions[i];
        }
    }
    return null;
}

// Move an action by delta
export function moveAction(action: DrawAction, deltaX: number, deltaY: number): DrawAction {
    return {
        ...action,
        points: action.points.map(p => ({
            x: p.x + deltaX,
            y: p.y + deltaY
        }))
    };
}
