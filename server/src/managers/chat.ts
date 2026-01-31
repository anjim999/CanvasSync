import type { ChatMessage } from '../types.js';
import { rooms } from '../store.js';

const MAX_CHAT_HISTORY = 100; // Keep last 100 messages per room

export function addChatMessage(roomId: string, message: ChatMessage): boolean {
    const room = rooms.get(roomId);
    if (!room) return false;

    room.chatHistory.push(message);

    // Keep only last N messages to prevent memory growth
    if (room.chatHistory.length > MAX_CHAT_HISTORY) {
        room.chatHistory = room.chatHistory.slice(-MAX_CHAT_HISTORY);
    }

    return true;
}

export function getChatHistory(roomId: string): ChatMessage[] {
    const room = rooms.get(roomId);
    if (!room) return [];
    return room.chatHistory;
}
