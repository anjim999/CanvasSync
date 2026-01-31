import { createRoom } from './managers/room.js';

// Re-export everything to maintain backward compatibility
export * from './managers/room.js';
export * from './managers/drawing.js';
export * from './managers/chat.js';
export * from './managers/persistence.js';

// Initialize default room
const DEFAULT_ROOM_ID = 'default';
createRoom(DEFAULT_ROOM_ID, 'Main Canvas');
