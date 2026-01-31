import * as fs from 'fs';
import * as path from 'path';
import type { CanvasState } from '../types.js';
import { rooms } from '../store.js';
import { createRoom } from './room.js';

// Data directory for persistence
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

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
            actions: room.actions.filter((a: any) => !a.isUndone),
            users: Array.from(room.users.values()),
            roomId,
        };
    } catch (error) {
        console.error('Error loading canvas:', error);
        return null;
    }
}
