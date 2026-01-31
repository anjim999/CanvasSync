import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useSocket } from './useSocket';
import { useChat } from './useChat';
import type { DrawAction, Tool, Point } from '../types';

export function useAppLogic() {
    // Theme state (dark/light) - must be initialized first for color logic
    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        const saved = localStorage.getItem('canvasync-theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Drawing state - color depends on theme
    const [currentTool, setCurrentTool] = useState<Tool>('brush');
    const [currentColor, setCurrentColor] = useState(() => {
        // Initialize based on saved theme or system preference
        const saved = localStorage.getItem('canvasync-theme');
        const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isDark ? '#ffffff' : '#000000';
    });
    const [strokeWidth, setStrokeWidth] = useState(4);
    const [isFilled, setIsFilled] = useState(false);
    const [actions, setActions] = useState<DrawAction[]>([]);
    const [hasJoined, setHasJoined] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showUserPanel, setShowUserPanel] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);

    // Theme colors
    const theme = {
        bg: isDarkTheme ? '#0f0f1a' : '#f5f5f7',
        panelBg: isDarkTheme ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        border: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        text: isDarkTheme ? '#ffffff' : '#1a1a2e',
        textSecondary: isDarkTheme ? '#9ca3af' : '#6b7280',
        canvasBg: isDarkTheme ? '#0f0f1a' : '#ffffff',
        buttonBg: isDarkTheme ? '#374151' : '#e5e7eb',
        buttonActiveBg: '#6366f1',
    };

    // Toggle theme and update default color if using black/white
    const toggleTheme = useCallback(() => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme);
        localStorage.setItem('canvasync-theme', newTheme ? 'dark' : 'light');

        // Auto-switch color if user is using the default contrast color
        setCurrentColor(prev => {
            if (newTheme && prev === '#000000') return '#ffffff'; // Switching to dark, change black to white
            if (!newTheme && prev === '#ffffff') return '#000000'; // Switching to light, change white to black
            return prev; // Keep custom color
        });

        toast.success(newTheme ? 'Dark mode enabled' : 'Light mode enabled', {
            id: 'theme-toast',
        });
    }, [isDarkTheme]);

    // Check for mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Remote cursors
    const [remoteCursors, setRemoteCursors] = useState<
        Map<string, { position: Point; color: string; username: string }>
    >(new Map());

    // Undo/Redo state tracking
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const undoStack = useRef<DrawAction[]>([]);
    const redoStack = useRef<DrawAction[]>([]);

    // Socket connection
    const {
        isConnected,
        users,
        rooms,
        currentRoom,
        latency,
        joinRoom,
        leaveRoom,
        sendDrawAction,
        sendMoveAction,
        sendCursorMove,
        undo,
        redo,
        clearCanvas,
        createRoom,
        saveCanvas,
        getUserId,
        getSocket,
        onDrawAction,
        onCursorUpdate,
        onCanvasState,
        onUndoApplied,
        onRedoApplied,
        onCanvasCleared,
        onActionMoved,
    } = useSocket();

    const userId = getUserId();
    const currentUser = users.find(u => u.id === userId);
    const userColor = currentUser?.color || '#6366f1';
    const username = currentUser?.username || 'Anonymous';

    // Chat hook
    const {
        messages: chatMessages,
        isOpen: isChatOpen,
        unreadCount: chatUnreadCount,
        sendMessage: sendChatMessage,
        toggleChat,
        setIsOpen: setChatOpen,
    } = useChat({
        socket: getSocket(),
        roomId: currentRoom,
        userId,
        username,
    });

    // Update undo/redo availability
    useEffect(() => {
        const nonUndoneActions = actions.filter((a) => !a.isUndone);
        const undoneActions = actions.filter((a) => a.isUndone);
        setCanUndo(nonUndoneActions.length > 0);
        setCanRedo(undoneActions.length > 0);
    }, [actions]);

    // Handle incoming draw actions
    useEffect(() => {
        onDrawAction.current = (action: DrawAction) => {
            setActions((prev) => [...prev, action]);
        };
    }, [onDrawAction]);

    // Handle cursor updates
    useEffect(() => {
        onCursorUpdate.current = (data: { odId: string; position: Point }) => {
            const user = users.find((u) => u.id === data.odId);
            if (user) {
                setRemoteCursors((prev) => {
                    const newMap = new Map(prev);
                    newMap.set(data.odId, {
                        position: data.position,
                        color: user.color,
                        username: user.username,
                    });
                    return newMap;
                });
            }
        };
    }, [onCursorUpdate, users]);

    // Handle canvas state
    useEffect(() => {
        onCanvasState.current = (state) => {
            setActions(state.actions);
        };
    }, [onCanvasState]);

    // Handle undo applied
    useEffect(() => {
        onUndoApplied.current = (data) => {
            setActions((prev) =>
                prev.map((action) =>
                    action.id === data.actionId ? { ...action, isUndone: true } : action
                )
            );
        };
    }, [onUndoApplied]);

    // Handle redo applied
    useEffect(() => {
        onRedoApplied.current = (data) => {
            setActions((prev) =>
                prev.map((action) =>
                    action.id === data.actionId ? { ...action, isUndone: false } : action
                )
            );
        };
    }, [onRedoApplied]);

    // Handle canvas cleared
    useEffect(() => {
        onCanvasCleared.current = () => {
            setActions([]);
            undoStack.current = [];
            redoStack.current = [];
        };
    }, [onCanvasCleared]);

    // Handle action moved (from select/move tool)
    useEffect(() => {
        onActionMoved.current = (data) => {
            // Replace the action with the updated one from server
            setActions((prev) =>
                prev.map((action) => {
                    if (action.id === data.actionId) {
                        return data.action;
                    }
                    return action;
                })
            );
        };
    }, [onActionMoved]);

    // Remove cursor when user leaves
    useEffect(() => {
        const currentUserIds = new Set(users.map((u) => u.id));
        setRemoteCursors((prev) => {
            const newMap = new Map(prev);
            for (const odId of newMap.keys()) {
                if (!currentUserIds.has(odId)) {
                    newMap.delete(odId);
                }
            }
            return newMap;
        });
    }, [users]);

    // Handlers
    const handleDraw = useCallback((action: DrawAction) => {
        setActions((prev) => [...prev, action]);
        sendDrawAction(action);
        undoStack.current.push(action);
        redoStack.current = [];
    }, [sendDrawAction]);

    // Handle move action (for select/move tool)
    const handleMoveAction = useCallback((actionId: string, deltaX: number, deltaY: number) => {
        sendMoveAction(actionId, deltaX, deltaY);
    }, [sendMoveAction]);

    const handleCursorMove = useCallback((position: Point) => {
        sendCursorMove(position);
    }, [sendCursorMove]);

    const handleUndo = useCallback(() => { undo(); }, [undo]);
    const handleRedo = useCallback(() => { redo(); }, [redo]);
    const handleClear = useCallback(() => { setShowClearModal(true); }, []);

    const confirmClear = useCallback(() => {
        clearCanvas();
        setShowClearModal(false);
        toast.success('Canvas cleared!');
    }, [clearCanvas]);

    const handleSave = useCallback(() => {
        saveCanvas();
        toast.success('Canvas saved to server!');
    }, [saveCanvas]);

    const handleDownload = useCallback(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) {
            toast.error('No canvas found!');
            return;
        }
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        link.download = `canvas-sync-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Image downloaded!');
    }, []);

    const handleJoin = useCallback((username: string, roomId: string) => {
        joinRoom(roomId, username);
        setHasJoined(true);
        toast.success('Joined room successfully!');
    }, [joinRoom]);

    const handleLeave = useCallback(() => {
        leaveRoom();
        setHasJoined(false);
        setActions([]);
        setRemoteCursors(new Map());
    }, [leaveRoom]);

    const handleCreateRoom = useCallback((name: string) => {
        createRoom(name);
    }, [createRoom]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                handleRedo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);

    return {
        theme, isDarkTheme, latency, users, rooms, currentRoom, currentUserId: userId,
        showUserPanel, setShowUserPanel, showClearModal, setShowClearModal,
        currentTool, currentColor, strokeWidth, isFilled, actions, remoteCursors, canUndo, canRedo,
        setCurrentTool, setCurrentColor, setStrokeWidth, setIsFilled, setActions,
        handleDraw, handleCursorMove, handleMoveAction,
        toggleTheme, handleUndo, handleRedo, handleClear, confirmClear, handleSave, handleDownload,
        joinRoom, handleCreateRoom, handleLeave,
        chatMessages, isChatOpen, chatUnreadCount, sendChatMessage, toggleChat, setChatOpen, userColor,
        handleJoin, hasJoined, isConnected, isMobile
    };
}
