import type { DrawAction, CanvasState } from '../types.js';
import { rooms, userRooms } from '../store.js';

export function getCanvasState(roomId: string): CanvasState | null {
    const room = rooms.get(roomId);
    if (!room) return null;

    return {
        actions: room.actions.filter(a => !a.isUndone),
        users: Array.from(room.users.values()),
        roomId,
    };
}

export function addDrawAction(roomId: string, action: DrawAction): boolean {
    const room = rooms.get(roomId);
    if (!room) return false;

    room.actions.push(action);

    // Clear global redo stack when anyone draws something new
    // This maintains consistency - once new content is added, redo history is invalid
    room.undoneActions.forEach((stack) => (stack.length = 0));

    return true;
}

// GLOBAL UNDO: Undoes the last action on the canvas, regardless of who drew it
export function undoAction(roomId: string, _requestingUserId: string): DrawAction | null {
    const room = rooms.get(roomId);
    if (!room) return null;

    // Find the last action that isn't already undone (from ANY user)
    for (let i = room.actions.length - 1; i >= 0; i--) {
        const action = room.actions[i];
        if (!action.isUndone) {
            action.isUndone = true;

            // Add to a global redo stack (using 'global' as key)
            let globalUndone = room.undoneActions.get('global');
            if (!globalUndone) {
                globalUndone = [];
                room.undoneActions.set('global', globalUndone);
            }
            globalUndone.push(action);

            return action;
        }
    }

    return null;
}

// GLOBAL REDO: Redoes the last undone action, regardless of who drew it
export function redoAction(roomId: string, _requestingUserId: string): DrawAction | null {
    const room = rooms.get(roomId);
    if (!room) return null;

    const globalUndone = room.undoneActions.get('global');
    if (!globalUndone || globalUndone.length === 0) return null;

    const action = globalUndone.pop()!;
    action.isUndone = false;

    return action;
}

export function clearCanvas(roomId: string): boolean {
    const room = rooms.get(roomId);
    if (!room) return false;

    room.actions = [];
    room.undoneActions.forEach((stack) => (stack.length = 0));

    return true;
}

export function updateUserCursor(odId: string, x: number, y: number): void {
    const roomId = userRooms.get(odId);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const user = room.users.get(odId);
    if (user) {
        user.cursor = { x, y };
    }
}

// Move an action by delta (for select/move tool) - returns the updated action
export function moveActionById(roomId: string, actionId: string, deltaX: number, deltaY: number): DrawAction | null {
    const room = rooms.get(roomId);
    if (!room) return null;

    const action = room.actions.find(a => a.id === actionId);
    if (!action || action.isUndone) return null;

    // Update all points by the delta
    action.points = action.points.map(p => ({
        x: p.x + deltaX,
        y: p.y + deltaY
    }));

    return action;
}
