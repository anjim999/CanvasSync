// Shared types for client and server

// Point coordinates on canvas
export interface Point {
    x: number;
    y: number;
}

// Drawing tools
export type Tool = 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'text';

// Single drawing stroke/shape
export interface DrawAction {
    id: string;
    odId: string; // Original user who drew this
    type: 'stroke' | 'shape' | 'text' | 'clear';
    tool: Tool;
    points: Point[]; // For strokes: array of points, for shapes: [start, end]
    color: string;
    strokeWidth: number;
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

// Room info
export interface Room {
    id: string;
    name: string;
    userCount: number;
    createdAt: number;
}

// Canvas state (sent to new users)
export interface CanvasState {
    actions: DrawAction[];
    users: User[];
    roomId: string;
}

// WebSocket Events - Client to Server
export interface ClientToServerEvents {
    join_room: (data: { roomId: string; username: string; clientId: string }) => void;
    leave_room: () => void;
    draw_action: (action: DrawAction) => void;
    move_action: (data: { actionId: string; deltaX: number; deltaY: number }) => void;
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
    action_moved: (data: { actionId: string; action: DrawAction }) => void;
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

// User cursor colors (assigned automatically) - Vibrant, highly distinct palette
export const USER_COLORS = [
    '#ef4444', // Red
    '#3b82f6', // Blue  
    '#22c55e', // Green
    '#f59e0b', // Amber/Orange
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Bright Orange
    '#14b8a6', // Teal
    '#a855f7', // Violet
    '#eab308', // Yellow
    '#0ea5e9', // Sky Blue
];
