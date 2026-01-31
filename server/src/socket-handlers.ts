import { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from './types.js';
import {
    joinRoom,
    leaveRoom,
    getUserRoom,
    getCanvasState,
    addDrawAction,
    undoAction,
    redoAction,
    clearCanvas,
    updateUserCursor,
    getUsers,
    getRooms,
    createRoom,
    saveCanvas,
    loadCanvas,
    addChatMessage,
    getChatHistory,
} from './state-manager.js';

type SocketIO = Server<ClientToServerEvents, ServerToClientEvents>;
type SocketClient = Socket<ClientToServerEvents, ServerToClientEvents>;

export function setupSocketHandlers(io: SocketIO): void {
    io.on('connection', (socket: SocketClient) => {
        console.log(`✅ User connected: ${socket.id}`);

        // Send available rooms on connect
        socket.emit('rooms_list', getRooms());

        // Join a room
        socket.on('join_room', ({ roomId, username }) => {
            const user = joinRoom(roomId, socket.id, username);
            if (!user) {
                socket.emit('error', 'Failed to join room');
                return;
            }

            socket.join(roomId);
            console.log(`👤 ${username} joined room: ${roomId}`);

            // Notify others in the room
            socket.to(roomId).emit('user_joined', user);

            // Send current canvas state to the new user
            const state = getCanvasState(roomId);
            if (state) {
                socket.emit('canvas_state', state);
            }

            // Send chat history to new user
            const chatHistory = getChatHistory(roomId);
            socket.emit('chat_history', chatHistory);

            // Update all users in room with user list
            io.to(roomId).emit('users_update', getUsers(roomId));
        });

        // Leave room
        socket.on('leave_room', () => {
            const roomId = leaveRoom(socket.id);
            if (roomId) {
                socket.leave(roomId);
                socket.to(roomId).emit('user_left', socket.id);
                io.to(roomId).emit('users_update', getUsers(roomId));
            }
        });

        // Drawing action
        socket.on('draw_action', (action) => {
            const roomId = getUserRoom(socket.id);
            if (!roomId) return;

            // Ensure the action has the correct user ID
            action.odId = socket.id;

            if (addDrawAction(roomId, action)) {
                // Broadcast to all OTHER users in the room
                socket.to(roomId).emit('draw_action', action);
            }
        });

        // Cursor movement
        socket.on('cursor_move', (position) => {
            const roomId = getUserRoom(socket.id);
            if (!roomId) return;

            updateUserCursor(socket.id, position.x, position.y);

            // Broadcast cursor position to others
            socket.to(roomId).emit('cursor_update', {
                odId: socket.id,
                position,
            });
        });

        // Undo
        socket.on('undo', () => {
            const roomId = getUserRoom(socket.id);
            if (!roomId) return;

            const undoneAction = undoAction(roomId, socket.id);
            if (undoneAction) {
                // Broadcast undo to all users in room (including sender)
                io.to(roomId).emit('undo_applied', {
                    odId: socket.id,
                    actionId: undoneAction.id,
                });
            }
        });

        // Redo
        socket.on('redo', () => {
            const roomId = getUserRoom(socket.id);
            if (!roomId) return;

            const redoneAction = redoAction(roomId, socket.id);
            if (redoneAction) {
                io.to(roomId).emit('redo_applied', {
                    odId: socket.id,
                    actionId: redoneAction.id,
                });
            }
        });

        // Clear canvas
        socket.on('clear_canvas', () => {
            const roomId = getUserRoom(socket.id);
            if (!roomId) return;

            if (clearCanvas(roomId)) {
                io.to(roomId).emit('canvas_cleared', socket.id);
            }
        });

        // Get rooms list
        socket.on('get_rooms', () => {
            socket.emit('rooms_list', getRooms());
        });

        // Create new room
        socket.on('create_room', (name) => {
            const roomId = `room_${Date.now()}`;
            const room = createRoom(roomId, name);
            io.emit('room_created', room);
            socket.emit('rooms_list', getRooms());
        });

        // Save canvas
        socket.on('save_canvas', () => {
            const roomId = getUserRoom(socket.id);
            if (!roomId) return;

            if (saveCanvas(roomId)) {
                socket.emit('canvas_saved', roomId);
            } else {
                socket.emit('error', 'Failed to save canvas');
            }
        });

        // Load canvas
        socket.on('load_canvas', (roomId) => {
            const state = loadCanvas(roomId);
            if (state) {
                socket.emit('canvas_loaded', state);
                // Broadcast to all in room to reload
                io.to(roomId).emit('canvas_state', state);
            } else {
                socket.emit('error', 'Failed to load canvas');
            }
        });

        // Send chat message
        socket.on('send_chat', ({ roomId, message }) => {
            if (!roomId || !message) return;

            if (addChatMessage(roomId, message)) {
                // Broadcast to all in room (including sender)
                io.to(roomId).emit('chat_message', message);
            }
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.id}`);
            const roomId = leaveRoom(socket.id);
            if (roomId) {
                socket.to(roomId).emit('user_left', socket.id);
                io.to(roomId).emit('users_update', getUsers(roomId));
            }
        });
    });
}
