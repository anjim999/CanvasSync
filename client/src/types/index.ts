// Shared types for client and server

// Point coordinates on canvas
export interface Point {
    x: number;
    y: number;
}

// Drawing tools
export type Tool = 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'triangle' | 'diamond' | 'text';

// Single drawing stroke/shape
export interface DrawAction {
    id: string;
    odId: string; // Original user who drew this
    type: 'stroke' | 'shape' | 'text' | 'clear';
    tool: Tool;
    points: Point[]; // For strokes: array of points, for shapes: [start, end]
    color: string;
    strokeWidth: number;
    isFilled?: boolean; // New property for filled shapes
    text?: string; // For text tool
    timestamp: number;
    isUndone?: boolean; // For undo/redo tracking
}

// Connected user
export interface User {
    id: string;
    username: string;
    color: string; // Assigned cursor color
    cursor?: Point;
    isDrawing?: boolean;
}

// Room info
export interface Room {
    id: string;
    name: string;
    userCount: number;
    createdAt: number;
}

// Chat message
export interface ChatMessage {
    id: string;
    userId: string;
    username: string;
    text: string;
    timestamp: number;
    color: string;
    isSystem?: boolean;
}

// Canvas state (sent to new users)
export interface CanvasState {
    actions: DrawAction[];
    users: User[];
    roomId: string;
}

// WebSocket Events - Client to Server
export interface ClientToServerEvents {
    join_room: (data: { roomId: string; username: string }) => void;
    leave_room: () => void;
    draw_action: (action: DrawAction) => void;
    cursor_move: (position: Point) => void;
    undo: () => void;
    redo: () => void;
    clear_canvas: () => void;
    get_rooms: () => void;
    create_room: (name: string) => void;
    save_canvas: () => void;
    load_canvas: (roomId: string) => void;
    send_chat: (data: { roomId: string; message: ChatMessage }) => void;
}

// WebSocket Events - Server to Client
export interface ServerToClientEvents {
    user_joined: (user: User) => void;
    user_left: (userId: string) => void;
    users_update: (users: User[]) => void;
    draw_action: (action: DrawAction) => void;
    cursor_update: (data: { odId: string; position: Point }) => void;
    canvas_state: (state: CanvasState) => void;
    undo_applied: (data: { odId: string; actionId: string }) => void;
    redo_applied: (data: { odId: string; actionId: string }) => void;
    canvas_cleared: (odId: string) => void;
    rooms_list: (rooms: Room[]) => void;
    room_created: (room: Room) => void;
    error: (message: string) => void;
    canvas_saved: (roomId: string) => void;
    canvas_loaded: (state: CanvasState) => void;
    chat_message: (message: ChatMessage) => void;
    chat_history: (messages: ChatMessage[]) => void;
}

// Performance metrics
export interface PerformanceMetrics {
    fps: number;
    latency: number;
    lastUpdate: number;
}

// Preset colors for the palette
export const PRESET_COLORS = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#ffffff', // white
    '#000000', // black
];

// User cursor colors (assigned automatically)
export const USER_COLORS = [
    '#ef4444',
    '#22c55e',
    '#3b82f6',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#84cc16',
];

// Stroke width options
export const STROKE_WIDTHS = [2, 4, 8, 12, 20];
