import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type {
    ClientToServerEvents,
    ServerToClientEvents,
    DrawAction,
    User,
    Room,
    CanvasState,
    Point,
} from '../types';
import { config } from '../config/env';

// Socket instance (singleton)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function useSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const [latency, setLatency] = useState(0);

    // Callbacks for events (will be set by components)
    const onDrawAction = useRef<((action: DrawAction) => void) | null>(null);
    const onCursorUpdate = useRef<((data: { odId: string; position: Point }) => void) | null>(null);
    const onCanvasState = useRef<((state: CanvasState) => void) | null>(null);
    const onUndoApplied = useRef<((data: { odId: string; actionId: string }) => void) | null>(null);
    const onRedoApplied = useRef<((data: { odId: string; actionId: string }) => void) | null>(null);
    const onCanvasCleared = useRef<(() => void) | null>(null);

    // Initialize socket connection
    useEffect(() => {
        if (!socket) {
            console.log('🔌 Connecting to:', config.SERVER_URL);

            socket = io(config.SERVER_URL, {
                transports: ['websocket'],
                autoConnect: true,
            });
        }

        const handleConnect = () => {
            setIsConnected(true);
            console.log('🔌 Connected to server');
        };

        const handleDisconnect = () => {
            setIsConnected(false);
            setCurrentRoom(null);
            console.log('❌ Disconnected from server');
        };

        // Connection events
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        // Room events
        socket.on('rooms_list', (roomsList) => {
            setRooms(roomsList);
        });

        socket.on('users_update', (usersList) => {
            setUsers(usersList);
        });

        socket.on('user_joined', (user) => {
            setUsers((prev) => [...prev.filter((u) => u.id !== user.id), user]);
        });

        socket.on('user_left', (odId) => {
            setUsers((prev) => prev.filter((u) => u.id !== odId));
        });

        // Drawing events
        socket.on('draw_action', (action) => {
            onDrawAction.current?.(action);
        });

        socket.on('cursor_update', (data) => {
            onCursorUpdate.current?.(data);
        });

        socket.on('canvas_state', (state) => {
            setUsers(state.users);
            onCanvasState.current?.(state);
        });

        socket.on('undo_applied', (data) => {
            onUndoApplied.current?.(data);
        });

        socket.on('redo_applied', (data) => {
            onRedoApplied.current?.(data);
        });

        socket.on('canvas_cleared', () => {
            onCanvasCleared.current?.();
        });

        socket.on('error', (message) => {
            console.error('Socket error:', message);
        });

        // Check if already connected
        if (socket.connected) {
            setIsConnected(true);
        }

        // Latency ping
        const pingInterval = setInterval(() => {
            if (socket?.connected) {
                const start = Date.now();
                socket.emit('get_rooms');
                // Approximate latency (will be updated when rooms_list returns)
                setLatency(Date.now() - start);
            }
        }, 5000);

        return () => {
            clearInterval(pingInterval);
            // Don't disconnect on unmount - keep connection alive
        };
    }, []);

    // Join a room
    const joinRoom = useCallback((roomId: string, username: string) => {
        if (socket && isConnected) {
            socket.emit('join_room', { roomId, username });
            setCurrentRoom(roomId);
        }
    }, [isConnected]);

    // Leave current room
    const leaveRoom = useCallback(() => {
        if (socket && currentRoom) {
            socket.emit('leave_room');
            setCurrentRoom(null);
            setUsers([]);
        }
    }, [currentRoom]);

    // Send draw action
    const sendDrawAction = useCallback((action: DrawAction) => {
        if (socket && currentRoom) {
            socket.emit('draw_action', action);
        }
    }, [currentRoom]);

    // Send cursor position
    // Send cursor position - Throttled to 50ms (20fps) for performance with 1000 users
    const lastCursorUpdateRef = useRef<number>(0);
    const sendCursorMove = useCallback((position: Point) => {
        if (socket && currentRoom) {
            const now = Date.now();
            if (now - lastCursorUpdateRef.current > 50) {
                socket.emit('cursor_move', position);
                lastCursorUpdateRef.current = now;
            }
        }
    }, [currentRoom]);

    // Undo
    const undo = useCallback(() => {
        if (socket && currentRoom) {
            socket.emit('undo');
        }
    }, [currentRoom]);

    // Redo
    const redo = useCallback(() => {
        if (socket && currentRoom) {
            socket.emit('redo');
        }
    }, [currentRoom]);

    // Clear canvas
    const clearCanvas = useCallback(() => {
        if (socket && currentRoom) {
            socket.emit('clear_canvas');
        }
    }, [currentRoom]);

    // Create room
    const createRoom = useCallback((name: string) => {
        if (socket && isConnected) {
            socket.emit('create_room', name);
        }
    }, [isConnected]);

    // Save canvas
    const saveCanvas = useCallback(() => {
        if (socket && currentRoom) {
            socket.emit('save_canvas');
        }
    }, [currentRoom]);

    // Load canvas
    const loadCanvas = useCallback((roomId: string) => {
        if (socket && isConnected) {
            socket.emit('load_canvas', roomId);
        }
    }, [isConnected]);

    // Get current user ID
    const getUserId = useCallback(() => {
        return socket?.id || null;
    }, []);

    // Get raw socket for other hooks (like useChat)
    const getSocket = useCallback(() => socket, []);

    return {
        isConnected,
        users,
        rooms,
        currentRoom,
        latency,
        joinRoom,
        leaveRoom,
        sendDrawAction,
        sendCursorMove,
        undo,
        redo,
        clearCanvas,
        createRoom,
        saveCanvas,
        loadCanvas,
        getUserId,
        getSocket,
        // Event handlers (set by components)
        onDrawAction,
        onCursorUpdate,
        onCanvasState,
        onUndoApplied,
        onRedoApplied,
        onCanvasCleared,
    };
}
