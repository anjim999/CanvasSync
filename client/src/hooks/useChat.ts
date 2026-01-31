import { useState, useEffect, useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import type { ChatMessage } from '../types';

interface UseChatProps {
    socket: Socket | null;
    roomId: string | null;
    userId: string | null;
    username: string;
}

export function useChat({ socket, roomId, userId, username }: UseChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Subscribe to chat events
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
            if (!isOpen) {
                setUnreadCount((prev) => prev + 1);
            }
        };

        const handleHistory = (history: ChatMessage[]) => {
            setMessages(history);
        };

        socket.on('chat_message', handleMessage);
        socket.on('chat_history', handleHistory);

        return () => {
            socket.off('chat_message', handleMessage);
            socket.off('chat_history', handleHistory);
        };
    }, [socket, isOpen]);

    // Reset unread count when opening chat
    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    // Send a message
    const sendMessage = useCallback((text: string, color: string) => {
        if (!socket || !roomId || !userId || !text.trim()) return;

        const messageWithId: ChatMessage = {
            id: Date.now().toString(),
            userId,
            username,
            text: text.trim(),
            timestamp: Date.now(),
            color
        };

        // Optimistic update (show immediately)
        // setMessages((prev) => [...prev, messageWithId]); // Optional: wait for server ack instead?
        // Actually, Socket.io broadcast usually excludes sender, so we might need to add it manually OR
        // have server broadcast to everyone including sender. 
        // For simplicity, let's assume server broadcasts to room (including sender) or we add it here.
        // Let's rely on server for single source of truth to ensure ordering.

        socket.emit('send_chat', { roomId, message: messageWithId });
    }, [socket, roomId, userId, username]);

    const toggleChat = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return {
        messages,
        isOpen,
        unreadCount,
        sendMessage,
        toggleChat,
        setIsOpen
    };
}
