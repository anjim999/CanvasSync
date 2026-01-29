import { useState, useEffect, useCallback, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { UserPanel } from './components/UserPanel';
import { JoinModal } from './components/JoinModal';
import { useSocket } from './hooks/useSocket';
import type { DrawAction, Tool, Point } from './types';
import './App.css';

function App() {
  // Drawing state
  const [currentTool, setCurrentTool] = useState<Tool>('brush');
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [actions, setActions] = useState<DrawAction[]>([]);
  const [hasJoined, setHasJoined] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(false);

  // Theme state (dark/light)
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('canvasync-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Theme colors
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

  // Toggle theme
  const toggleTheme = useCallback(() => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('canvasync-theme', newTheme ? 'dark' : 'light');

    // Show toast immediately on toggle
    toast.success(newTheme ? 'Dark mode enabled' : 'Light mode enabled', {
      icon: newTheme ? '🌙' : '☀️',
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
    sendCursorMove,
    undo,
    redo,
    clearCanvas,
    createRoom,
    saveCanvas,
    getUserId,
    onDrawAction,
    onCursorUpdate,
    onCanvasState,
    onUndoApplied,
    onRedoApplied,
    onCanvasCleared,
  } = useSocket();

  const userId = getUserId();

  // Update undo/redo availability - GLOBAL undo now (any non-undone action can be undone)
  useEffect(() => {
    const nonUndoneActions = actions.filter((a) => !a.isUndone);
    const undoneActions = actions.filter((a) => a.isUndone);
    setCanUndo(nonUndoneActions.length > 0);
    setCanRedo(undoneActions.length > 0);
  }, [actions]);

  // Handle incoming draw actions from other users
  useEffect(() => {
    onDrawAction.current = (action: DrawAction) => {
      setActions((prev) => [...prev, action]);
    };
  }, [onDrawAction]);

  // Handle cursor updates from other users
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

  // Handle canvas state (for new users joining)
  useEffect(() => {
    onCanvasState.current = (state) => {
      setActions(state.actions);
    };
  }, [onCanvasState]);

  // Handle undo applied (from server)
  useEffect(() => {
    onUndoApplied.current = (data) => {
      setActions((prev) =>
        prev.map((action) =>
          action.id === data.actionId ? { ...action, isUndone: true } : action
        )
      );
    };
  }, [onUndoApplied]);

  // Handle redo applied (from server)
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

  // Handle local draw action
  const handleDraw = useCallback(
    (action: DrawAction) => {
      setActions((prev) => [...prev, action]);
      sendDrawAction(action);
      undoStack.current.push(action);
      redoStack.current = []; // Clear redo stack on new action
    },
    [sendDrawAction]
  );

  // Handle cursor move
  const handleCursorMove = useCallback(
    (position: Point) => {
      sendCursorMove(position);
    },
    [sendCursorMove]
  );

  // Handle undo
  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  // Handle redo
  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  // Handle clear
  const handleClear = useCallback(() => {
    setShowClearModal(true);
  }, []);

  const confirmClear = useCallback(() => {
    clearCanvas();
    setShowClearModal(false);
    toast.success('Canvas cleared!', { icon: '🗑️' });
  }, [clearCanvas]);

  // Handle save (to server)
  const handleSave = useCallback(() => {
    saveCanvas();
    toast.success('Canvas saved to server!', { icon: '💾' });
  }, [saveCanvas]);

  // Handle download as PNG
  const handleDownload = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      toast.error('No canvas found!');
      return;
    }

    // Create a download link
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    link.download = `canvas-sync-${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!', { icon: '📥' });
  }, []);

  // Handle join
  const handleJoin = useCallback(
    (username: string, roomId: string) => {
      joinRoom(roomId, username);
      setHasJoined(true);
      toast.success(`Joined room successfully!`, { icon: '🎨' });
    },
    [joinRoom]
  );

  // Handle leave
  const handleLeave = useCallback(() => {
    leaveRoom();
    setHasJoined(false);
    setActions([]);
    setRemoteCursors(new Map());
  }, [leaveRoom]);

  // Handle create room
  const handleCreateRoom = useCallback(
    (name: string) => {
      createRoom(name);
    },
    [createRoom]
  );

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

  // Show join modal if not connected or not in a room
  if (!isConnected || !hasJoined) {
    return (
      <>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            },
          }}
        />
        <JoinModal
          onJoin={handleJoin}
          isDarkTheme={isDarkTheme}
          onToggleTheme={toggleTheme}
        />
      </>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: theme.bg,
        position: 'relative',
      }}>
        {/* Toast Notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: theme.panelBg,
              color: theme.text,
              border: `1px solid ${theme.border}`,
            },
          }}
        />
        {/* Mobile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: theme.panelBg,
          borderBottom: `1px solid ${theme.border}`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🎨</span>
            <span style={{ fontWeight: 600, color: theme.text, fontSize: '14px' }}>CanvasSync</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: theme.buttonBg,
                fontSize: '16px',
                WebkitTapHighlightColor: 'transparent',
              }}
              title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkTheme ? '☀️' : '🌙'}
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: latency < 100 ? '#4ade80' : latency < 300 ? '#facc15' : '#f87171',
              }} />
              <span style={{ fontSize: '10px', color: theme.textSecondary }}>{latency}ms</span>
            </div>
            <button
              onClick={() => setShowUserPanel(!showUserPanel)}
              style={{
                padding: '6px 10px',
                backgroundColor: showUserPanel ? '#6366f1' : theme.buttonBg,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '12px', color: isDarkTheme ? 'white' : (showUserPanel ? 'white' : '#1a1a2e') }}>👥</span>
              <span style={{ fontSize: '12px', color: isDarkTheme ? 'white' : (showUserPanel ? 'white' : '#1a1a2e') }}>{users.length}</span>
            </button>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div style={{
          flex: 1,
          padding: '8px',
          overflow: 'hidden',
          touchAction: 'none',
        }}>
          <Canvas
            currentTool={currentTool}
            currentColor={currentColor}
            strokeWidth={strokeWidth}
            userId={userId}
            actions={actions}
            onDraw={handleDraw}
            onCursorMove={handleCursorMove}
            remoteCursors={remoteCursors}
            onActionsChange={setActions}
            backgroundColor={theme.canvasBg}
            isDarkTheme={isDarkTheme}
          />
        </div>

        <ConfirmationModal
          isOpen={showClearModal}
          title="Clear Canvas"
          message="Are you sure you want to clear the entire canvas? This action cannot be undone."
          onConfirm={confirmClear}
          onCancel={() => setShowClearModal(false)}
          confirmText="Clear Canvas"
          isDestructive={true}
          theme={theme}
        />

        {/* Mobile Bottom Toolbar */}
        <Toolbar
          currentTool={currentTool}
          currentColor={currentColor}
          strokeWidth={strokeWidth}
          onToolChange={setCurrentTool}
          onColorChange={setCurrentColor}
          onStrokeWidthChange={setStrokeWidth}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          onSave={handleSave}
          onDownload={handleDownload}
          canUndo={canUndo}
          canRedo={canRedo}
          isMobile={true}
          isDarkTheme={isDarkTheme}
          onToggleTheme={toggleTheme}
        />

        {/* Mobile User Panel Overlay */}
        {showUserPanel && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 40,
            }}
            onClick={() => setShowUserPanel(false)}
          >
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '280px',
                maxWidth: '80vw',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <UserPanel
                users={users}
                rooms={rooms}
                currentRoom={currentRoom}
                currentUserId={userId}
                latency={latency}
                onJoinRoom={(roomId) => joinRoom(roomId, 'Guest')}
                onCreateRoom={handleCreateRoom}
                onLeaveRoom={handleLeave}
                isMobile={true}
                isDarkTheme={isDarkTheme}
                onClose={() => setShowUserPanel(false)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: theme.bg }}>
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme.panelBg,
            color: theme.text,
            border: `1px solid ${theme.border}`,
          },
        }}
      />



      {/* Left Toolbar */}
      <Toolbar
        currentTool={currentTool}
        currentColor={currentColor}
        strokeWidth={strokeWidth}
        onToolChange={setCurrentTool}
        onColorChange={setCurrentColor}
        onStrokeWidthChange={setStrokeWidth}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSave}
        onDownload={handleDownload}
        canUndo={canUndo}
        canRedo={canRedo}
        isMobile={false}
        isDarkTheme={isDarkTheme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Canvas Area */}
      <div style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
        <Canvas
          currentTool={currentTool}
          currentColor={currentColor}
          strokeWidth={strokeWidth}
          userId={userId}
          actions={actions}
          onDraw={handleDraw}
          onCursorMove={handleCursorMove}
          remoteCursors={remoteCursors}
          onActionsChange={setActions}
          backgroundColor={theme.canvasBg}
          isDarkTheme={isDarkTheme}
        />

        <ConfirmationModal
          isOpen={showClearModal}
          title="Clear Canvas"
          message="Are you sure you want to clear the entire canvas? This action cannot be undone."
          onConfirm={confirmClear}
          onCancel={() => setShowClearModal(false)}
          confirmText="Clear Canvas"
          isDestructive={true}
          theme={theme}
        />
      </div>

      {/* Right Panel */}
      <UserPanel
        users={users}
        rooms={rooms}
        currentRoom={currentRoom}
        currentUserId={userId}
        latency={latency}
        onJoinRoom={(roomId) => joinRoom(roomId, 'Guest')}
        onCreateRoom={handleCreateRoom}
        onLeaveRoom={handleLeave}
        isMobile={false}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
}

export default App;

