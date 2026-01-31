import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Canvas } from '../Canvas';
import { Toolbar } from '../Toolbar';
import { UserPanel } from '../UserPanel';
import { ConfirmationModal } from '../ConfirmationModal';
import { ChatPanel, ChatToggle } from '../chat';
import type { DrawAction, Tool, Point, User, Room } from '../../types';

interface DesktopLayoutProps {
    // State
    theme: any;
    isDarkTheme: boolean;
    latency: number;
    users: User[];
    rooms: Room[];
    currentRoom: string | null;
    currentUserId: string | null;
    showClearModal: boolean;
    setShowClearModal: (show: boolean) => void;

    // Drawing State
    currentTool: Tool;
    currentColor: string;
    strokeWidth: number;
    isFilled: boolean;
    actions: DrawAction[];
    remoteCursors: Map<string, { position: Point; color: string; username: string }>;
    canUndo: boolean;
    canRedo: boolean;

    // Drawing Handlers
    setCurrentTool: (tool: Tool) => void;
    setCurrentColor: (color: string) => void;
    setStrokeWidth: (width: number) => void;
    setIsFilled: (filled: boolean) => void;
    setActions: (actions: DrawAction[]) => void;
    handleDraw: (action: DrawAction) => void;
    handleCursorMove: (point: Point) => void;

    // Action Handlers
    toggleTheme: () => void;
    handleUndo: () => void;
    handleRedo: () => void;
    handleClear: () => void;
    confirmClear: () => void;
    handleSave: () => void;
    handleDownload: () => void;
    joinRoom: (roomId: string, username: string) => void;
    handleCreateRoom: (name: string) => void;
    handleLeave: () => void;

    // Chat Props
    chatMessages: any[];
    isChatOpen: boolean;
    chatUnreadCount: number;
    sendChatMessage: (text: string, color: string) => void;
    toggleChat: () => void;
    setChatOpen: (open: boolean) => void;
    userColor: string;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
    theme, isDarkTheme, latency, users, rooms, currentRoom, currentUserId,
    showClearModal, setShowClearModal,
    currentTool, currentColor, strokeWidth, isFilled, actions, remoteCursors, canUndo, canRedo,
    setCurrentTool, setCurrentColor, setStrokeWidth, setIsFilled, setActions, handleDraw, handleCursorMove,
    toggleTheme, handleUndo, handleRedo, handleClear, confirmClear, handleSave, handleDownload,
    joinRoom, handleCreateRoom, handleLeave,
    chatMessages, isChatOpen, chatUnreadCount, sendChatMessage, toggleChat, setChatOpen, userColor
}) => {
    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: theme.bg }}>
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
                isFilled={isFilled}
                onToolChange={setCurrentTool}
                onColorChange={setCurrentColor}
                onStrokeWidthChange={setStrokeWidth}
                onToggleFill={() => setIsFilled(!isFilled)}
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
                    isFilled={isFilled}
                    userId={currentUserId}
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

                {/* Chat Toggle Button */}
                <ChatToggle
                    onClick={toggleChat}
                    unreadCount={chatUnreadCount}
                    isOpen={isChatOpen}
                    isDarkTheme={isDarkTheme}
                />

                {/* Chat Panel */}
                <ChatPanel
                    messages={chatMessages}
                    onSendMessage={(text) => sendChatMessage(text, userColor)}
                    isOpen={isChatOpen}
                    onClose={() => setChatOpen(false)}
                    currentUserId={currentUserId}
                    userColor={userColor}
                    isDarkTheme={isDarkTheme}
                />
            </div>

            {/* Right Panel */}
            <UserPanel
                users={users}
                rooms={rooms}
                currentRoom={currentRoom}
                currentUserId={currentUserId}
                latency={latency}
                onJoinRoom={(roomId) => joinRoom(roomId, 'Guest')}
                onCreateRoom={handleCreateRoom}
                onLeaveRoom={handleLeave}
                isMobile={false}
                isDarkTheme={isDarkTheme}
            />
        </div>
    );
};
