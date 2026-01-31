import { Toaster } from 'react-hot-toast';
import { JoinModal } from './components/JoinModal';
import { MobileLayout, DesktopLayout } from './components/layout';
import { useAppLogic } from './hooks/useAppLogic';
import './App.css';

function App() {
  const {
    theme, isDarkTheme, latency, users, rooms, currentRoom, currentUserId,
    showUserPanel, setShowUserPanel, showClearModal, setShowClearModal,
    currentTool, currentColor, strokeWidth, isFilled, actions, remoteCursors, canUndo, canRedo,
    setCurrentTool, setCurrentColor, setStrokeWidth, setIsFilled, setActions,
    handleDraw, handleCursorMove,
    toggleTheme, handleUndo, handleRedo, handleClear, confirmClear, handleSave, handleDownload,
    joinRoom, handleCreateRoom, handleLeave,
    chatMessages, isChatOpen, chatUnreadCount, sendChatMessage, toggleChat, setChatOpen, userColor,
    handleJoin, hasJoined, isConnected, isMobile
  } = useAppLogic();

  // Main Render Logic
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

  // Common Props
  const layoutProps = {
    theme, isDarkTheme, latency, users, rooms, currentRoom, currentUserId,
    showUserPanel, setShowUserPanel, showClearModal, setShowClearModal,
    currentTool, currentColor, strokeWidth, isFilled, actions, remoteCursors, canUndo, canRedo,
    setCurrentTool, setCurrentColor, setStrokeWidth, setIsFilled, setActions,
    handleDraw, handleCursorMove,
    toggleTheme, handleUndo, handleRedo, handleClear, confirmClear, handleSave, handleDownload,
    joinRoom, handleCreateRoom, handleLeave,
    chatMessages, isChatOpen, chatUnreadCount, sendChatMessage, toggleChat, setChatOpen, userColor
  };

  if (isMobile) {
    return <MobileLayout {...layoutProps} />;
  }

  return <DesktopLayout {...layoutProps} />;
}

export default App;
