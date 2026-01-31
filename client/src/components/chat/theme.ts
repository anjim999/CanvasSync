export interface ChatTheme {
    bg: string;
    border: string;
    text: string;
    textSecondary: string;
    inputBg: string;
    msgBgSelf: string;
    msgBgOther: string;
}

export const getChatTheme = (isDark: boolean): ChatTheme => ({
    bg: isDark ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    text: isDark ? '#ffffff' : '#1a1a2e',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    inputBg: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
    msgBgSelf: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
    msgBgOther: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
});
