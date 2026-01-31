import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Sun, Moon, Palette, Users } from 'lucide-react';
import { Canvas } from '../Canvas';
import { Toolbar } from '../Toolbar';
import { UserPanel } from '../UserPanel';
import { ConfirmationModal } from '../ConfirmationModal';
import { ChatPanel, ChatToggle } from '../chat';
import type { DrawAction, Tool, Point, User, Room } from '../../types';

interface MobileLayoutProps {
    // State
    theme: any;
    isDarkTheme: boolean;
    latency: number;
    users: User[];
    rooms: Room[];
    currentRoom: string | null;
    currentUserId: string | null;
    showUserPanel: boolean;
    setShowUserPanel: (show: boolean) => void;
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

export const MobileLayout: React.FC<MobileLayoutProps> = ({
    theme, isDarkTheme, latency, users, rooms, currentRoom, currentUserId,
    showUserPanel, setShowUserPanel, showClearModal, setShowClearModal,
    currentTool, currentColor, strokeWidth, isFilled, actions, remoteCursors, canUndo, canRedo,
    setCurrentTool, setCurrentColor, setStrokeWidth, setIsFilled, setActions, handleDraw, handleCursorMove,
    toggleTheme, handleUndo, handleRedo, handleClear, confirmClear, handleSave, handleDownload,
    joinRoom, handleCreateRoom, handleLeave,
    chatMessages, isChatOpen, chatUnreadCount, sendChatMessage, toggleChat, setChatOpen, userColor
}) => {
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
                    <Palette size={20} color={theme.text} />
                    <span style={{ fontWeight: 600, color: theme.text, fontSize: '14px' }}>CanvasSync</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                            color: theme.text, // Ensure icon takes text color
                            fontSize: '16px',
                            WebkitTapHighlightColor: 'transparent',
                        }}
                        title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
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
                            color: theme.text,
                        }}
                    >
                        <Users size={16} color={isDarkTheme ? 'white' : (showUserPanel ? 'white' : '#1a1a2e')} />
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

            {/* Chat Toggle Button (Mobile) - Fixed position above toolbar */}
            <div style={{
                position: 'fixed',
                right: '16px',
                bottom: '90px',
                zIndex: 50
            }}>
                <ChatToggle
                    onClick={toggleChat}
                    unreadCount={chatUnreadCount}
                    isOpen={isChatOpen}
                    isDarkTheme={isDarkTheme}
                />
            </div>

            {/* Chat Panel (Mobile) - Full screen modal overlay */}
            {isChatOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: '16px',
                }}>
                    <ChatPanel
                        messages={chatMessages}
                        onSendMessage={(text) => sendChatMessage(text, userColor)}
                        isOpen={true}
                        onClose={() => setChatOpen(false)}
                        currentUserId={currentUserId}
                        userColor={userColor}
                        isDarkTheme={isDarkTheme}
                        style={{ width: '100%', height: '70%', maxWidth: '400px' }}
                    />
                </div>
            )}

            {/* Mobile Bottom Toolbar */}
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
                            currentUserId={currentUserId}
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
};
