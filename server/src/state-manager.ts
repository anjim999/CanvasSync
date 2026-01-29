import type { DrawAction, User, Room, CanvasState } from './types.js';
import { USER_COLORS } from './types.js';
import * as fs from 'fs';
import * as path from 'path';

// In-memory storage for rooms and their states
const rooms = new Map<string, RoomState>();
const userRooms = new Map<string, string>(); // odId -> roomId

interface RoomState {
    id: string;
    name: string;
    actions: DrawAction[];
    undoneActions: Map<string, DrawAction[]>; // userId -> their undone actions
    users: Map<string, User>;
    createdAt: number;
}

// Create default room on startup
const DEFAULT_ROOM_ID = 'default';
createRoom(DEFAULT_ROOM_ID, 'Main Canvas');

// Data directory for persistence
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function createRoom(id: string, name: string): Room {
    const roomState: RoomState = {
        id,
        name,
        actions: [],
        undoneActions: new Map(),
        users: new Map(),
        createdAt: Date.now(),
    };
    rooms.set(id, roomState);
    return {
        id,
        name,
        userCount: 0,
        createdAt: roomState.createdAt,
    };
}

export function getRooms(): Room[] {
    return Array.from(rooms.values()).map((room) => ({
        id: room.id,
        name: room.name,
        userCount: room.users.size,
        createdAt: room.createdAt,
    }));
}

export function getRoom(roomId: string): RoomState | undefined {
    return rooms.get(roomId);
}

export function joinRoom(roomId: string, odId: string, username: string): User | null {
    let room = rooms.get(roomId);

    // Create room if it doesn't exist
    if (!room) {
        createRoom(roomId, `Room ${roomId}`);
        room = rooms.get(roomId)!;
    }

    // Assign a color based on user count
    const colorIndex = room.users.size % USER_COLORS.length;
    const color = USER_COLORS[colorIndex];

    const user: User = {
        id: odId,
        username,
        color,
    };

    room.users.set(odId, user);
    userRooms.set(odId, roomId);
    room.undoneActions.set(odId, []); // Initialize undo stack for user

    return user;
}

export function leaveRoom(odId: string): string | null {
    const roomId = userRooms.get(odId);
    if (!roomId) return null;

    const room = rooms.get(roomId);
    if (room) {
        room.users.delete(odId);
        room.undoneActions.delete(odId);
    }

    userRooms.delete(odId);
    return roomId;
}

export function getUserRoom(odId: string): string | undefined {
    return userRooms.get(odId);
}

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
// This is the assignment requirement: "One user can undo another user's drawing"
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

export function getUsers(roomId: string): User[] {
    const room = rooms.get(roomId);
    if (!room) return [];
    return Array.from(room.users.values());
}

// Persistence functions
export function saveCanvas(roomId: string): boolean {
    const room = rooms.get(roomId);
    if (!room) return false;

    try {
        const data = {
            id: room.id,
            name: room.name,
            actions: room.actions,
            savedAt: Date.now(),
        };

        const filePath = path.join(DATA_DIR, `${roomId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving canvas:', error);
        return false;
    }
}

export function loadCanvas(roomId: string): CanvasState | null {
    try {
        const filePath = path.join(DATA_DIR, `${roomId}.json`);
        if (!fs.existsSync(filePath)) return null;

        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Update room state with loaded actions
        let room = rooms.get(roomId);
        if (!room) {
            createRoom(roomId, data.name || `Room ${roomId}`);
            room = rooms.get(roomId)!;
        }

        room.actions = data.actions || [];

        return {
            actions: room.actions.filter(a => !a.isUndone),
            users: Array.from(room.users.values()),
            roomId,
        };
    } catch (error) {
        console.error('Error loading canvas:', error);
        return null;
    }
}
