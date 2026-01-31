import React from 'react';
import { Toaster } from 'react-hot-toast';
import { MobileLayout, DesktopLayout } from '../components/layout';
import { JoinModal } from '../components/JoinModal';
import { useAppLogic } from '../hooks/useAppLogic';

export const DrawPage: React.FC = () => {
    const {
        theme, isDarkTheme, latency, users, rooms, currentRoom, currentUserId,
        showUserPanel, setShowUserPanel, showClearModal, setShowClearModal,
        currentTool, currentColor, strokeWidth, isFilled, actions, remoteCursors, canUndo, canRedo,
        setCurrentTool, setCurrentColor, setStrokeWidth, setIsFilled, setActions,
        handleDraw, handleCursorMove, handleMoveAction,
        toggleTheme, handleUndo, handleRedo, handleClear, confirmClear, handleSave, handleDownload,
        joinRoom, handleCreateRoom, handleLeave,
        chatMessages, isChatOpen, chatUnreadCount, sendChatMessage, toggleChat, setChatOpen, userColor,
        handleJoin, hasJoined, isMobile
    } = useAppLogic();

    // Show join modal if not joined yet
    if (!hasJoined) {
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

    // Common Props for canvas layouts
    const layoutProps = {
        theme, isDarkTheme, latency, users, rooms, currentRoom, currentUserId,
        showUserPanel, setShowUserPanel, showClearModal, setShowClearModal,
        currentTool, currentColor, strokeWidth, isFilled, actions, remoteCursors, canUndo, canRedo,
        setCurrentTool, setCurrentColor, setStrokeWidth, setIsFilled, setActions,
        handleDraw, handleCursorMove, handleMoveAction,
        toggleTheme, handleUndo, handleRedo, handleClear, confirmClear, handleSave, handleDownload,
        joinRoom, handleCreateRoom, handleLeave,
        chatMessages, isChatOpen, chatUnreadCount, sendChatMessage, toggleChat, setChatOpen, userColor
    };

    if (isMobile) {
        return <MobileLayout {...layoutProps} />;
    }

    return <DesktopLayout {...layoutProps} />;
};
