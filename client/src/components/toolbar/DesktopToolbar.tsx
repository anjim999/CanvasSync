import React from 'react';
import type { Tool } from '../../types';
import { PaintBucket, Sun, Moon } from 'lucide-react';
import { ToolButton } from './ToolButton';
import { ColorPicker } from './ColorPicker';
import { StrokePicker } from './StrokePicker';
import { ActionButtons } from './ActionButtons';

interface DesktopToolbarProps {
    tools: { id: Tool; icon: React.ElementType; label: string }[];
    currentTool: Tool;
    currentColor: string;
    strokeWidth: number;
    isFilled: boolean;
    onToolChange: (tool: Tool) => void;
    onColorChange: (color: string) => void;
    onStrokeWidthChange: (width: number) => void;
    onToggleFill: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onClear: () => void;
    onSave: () => void;
    onDownload: () => void;
    canUndo: boolean;
    canRedo: boolean;
    isDarkTheme: boolean;
    onToggleTheme: () => void;
}

export const DesktopToolbar: React.FC<DesktopToolbarProps> = ({
    tools,
    currentTool,
    currentColor,
    strokeWidth,
    isFilled,
    onToolChange,
    onColorChange,
    onStrokeWidthChange,
    onToggleFill,
    onUndo,
    onRedo,
    onSave,
    onDownload,
    onClear,
    canUndo,
    canRedo,
    isDarkTheme,
    onToggleTheme,
}) => {
    const panelStyle: React.CSSProperties = {
        width: '80px',
        height: '100%',
        backgroundColor: isDarkTheme ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRight: isDarkTheme ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        padding: '16px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        overflowY: 'auto',
        flexShrink: 0,
        color: isDarkTheme ? 'white' : '#1a1a2e',
    };

    const sectionStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '10px',
        color: isDarkTheme ? '#9ca3af' : '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        textAlign: 'center',
        fontWeight: 600,
    };

    const dividerStyle: React.CSSProperties = {
        height: '1px',
        backgroundColor: isDarkTheme ? '#4b5563' : '#e5e7eb',
        width: '100%',
        opacity: 0.3,
    };

    return (
        <div style={panelStyle}>
            {/* Tools */}
            <div style={sectionStyle}>
                <span style={labelStyle}>Tools</span>
                {tools.map((tool) => (
                    <ToolButton
                        key={tool.id}
                        toolId={tool.id}
                        activeTool={currentTool}
                        icon={tool.icon}
                        label={tool.label}
                        onClick={onToolChange}
                        isMobile={false}
                        isDarkTheme={isDarkTheme}
                    />
                ))}
            </div>

            <div style={dividerStyle} />

            {/* Fill & Size */}
            <div style={sectionStyle}>
                <span style={labelStyle}>Style</span>

                <button
                    onClick={onToggleFill}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: isFilled ? '#6366f1' : (isDarkTheme ? '#374151' : '#f3f4f6'),
                        boxShadow: isFilled ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none',
                        color: isFilled ? 'white' : (isDarkTheme ? 'white' : '#374151'),
                    }}
                    title="Toggle Fill"
                >
                    <PaintBucket size={22} />
                </button>

                <StrokePicker
                    strokeWidth={strokeWidth}
                    onStrokeChange={onStrokeWidthChange}
                    isMobile={false}
                    isDarkTheme={isDarkTheme}
                />
            </div>

            <div style={dividerStyle} />

            {/* Colors */}
            <ColorPicker
                currentColor={currentColor}
                onColorChange={onColorChange}
                isMobile={false}
                isDarkTheme={isDarkTheme}
            />

            <div style={dividerStyle} />

            {/* Actions */}
            <div style={{ ...sectionStyle, marginTop: 'auto' }}>
                <ActionButtons
                    onUndo={onUndo}
                    onRedo={onRedo}
                    onSave={onSave}
                    onDownload={onDownload}
                    onClear={onClear}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    isMobile={false}
                    isDarkTheme={isDarkTheme}
                />

                <div style={dividerStyle} />

                {/* Theme Toggle */}
                <button
                    onClick={onToggleTheme}
                    title={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        border: '1px solid rgba(156, 163, 175, 0.2)',
                        borderRadius: '12px',
                        color: isDarkTheme ? '#e5e7eb' : '#374151',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                    }}
                >
                    {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </div>
    );
};
