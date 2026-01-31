import type { Room, User } from '../types.js';
import { USER_COLORS } from '../types.js';
import { rooms, userRooms, RoomState } from '../store.js';

export function createRoom(id: string, name: string): Room {
    const roomState: RoomState = {
        id,
        name,
        actions: [],
        undoneActions: new Map(),
        users: new Map(),
        chatHistory: [],
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

// Simple hash function to generate consistent number from string
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Get colors already in use in a room
function getUsedColors(room: RoomState): Set<string> {
    const used = new Set<string>();
    for (const user of room.users.values()) {
        used.add(user.color);
    }
    return used;
}

export function joinRoom(roomId: string, odId: string, username: string): User | null {
    let room = rooms.get(roomId);

    // Create room if it doesn't exist
    if (!room) {
        createRoom(roomId, `Room ${roomId}`);
        room = rooms.get(roomId)!;
    }

    // Get colors already used in this room
    const usedColors = getUsedColors(room);

    // Start with hash-based index for consistency, but find unused color
    const baseIndex = hashString(username + odId);
    let color = USER_COLORS[baseIndex % USER_COLORS.length];

    // If color is already in use, find the first available one
    if (usedColors.has(color)) {
        for (let i = 0; i < USER_COLORS.length; i++) {
            const candidateColor = USER_COLORS[i];
            if (!usedColors.has(candidateColor)) {
                color = candidateColor;
                break;
            }
        }
    }

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

export function getUsers(roomId: string): User[] {
    const room = rooms.get(roomId);
    if (!room) return [];
    return Array.from(room.users.values());
}
