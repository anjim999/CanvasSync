import type { Room, User, DrawAction, ChatMessage } from './types.js';

export interface RoomState {
    id: string;
    name: string;
    actions: DrawAction[];
    undoneActions: Map<string, DrawAction[]>; // userId -> their undone actions
    users: Map<string, User>;
    chatHistory: ChatMessage[]; // Chat messages for this room
    createdAt: number;
}

// In-memory storage for rooms and their states
export const rooms = new Map<string, RoomState>();
export const userRooms = new Map<string, string>(); // odId -> roomId
