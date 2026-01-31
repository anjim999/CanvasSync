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

export function getUsers(roomId: string): User[] {
    const room = rooms.get(roomId);
    if (!room) return [];
    return Array.from(room.users.values());
}
