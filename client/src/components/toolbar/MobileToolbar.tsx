import React, { useState } from 'react';
import type { Tool } from '../../types';
import { PaintBucket } from 'lucide-react';
import { ToolButton } from './ToolButton';
import { ColorPicker } from './ColorPicker';
import { StrokePicker } from './StrokePicker';
import { ActionButtons } from './ActionButtons';

interface MobileToolbarProps {
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
}

export const MobileToolbar: React.FC<MobileToolbarProps> = ({
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
}) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showSizePicker, setShowSizePicker] = useState(false);

    return (
        <div style={{
            backgroundColor: isDarkTheme ? 'rgba(26, 26, 46, 0.98)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderTop: isDarkTheme ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            padding: '8px',
            paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flexShrink: 0,
            zIndex: 50,
        }}>
            {/* Tools Row */}
            <div style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                paddingBottom: '4px',
            }}>
                {tools.map((tool) => (
                    <ToolButton
                        key={tool.id}
                        toolId={tool.id}
                        activeTool={currentTool}
                        icon={tool.icon}
                        label={tool.label}
                        onClick={onToolChange}
                        isMobile={true}
                        isDarkTheme={isDarkTheme}
                    />
                ))}

                {/* Fill Toggle */}
                <button
                    onClick={onToggleFill}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                        backgroundColor: isFilled ? '#6366f1' : (isDarkTheme ? '#374151' : '#f3f4f6'),
                        color: isFilled ? 'white' : (isDarkTheme ? 'white' : '#374151'),
                        WebkitTapHighlightColor: 'transparent',
                    }}
                    title="Toggle Fill"
                >
                    <PaintBucket size={20} />
                </button>

                {/* Color Button */}
                <button
                    onClick={() => { setShowColorPicker(!showColorPicker); setShowSizePicker(false); }}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: showColorPicker ? '2px solid #6366f1' : '2px solid #374151',
                        cursor: 'pointer',
                        flexShrink: 0,
                        backgroundColor: '#374151',
                        WebkitTapHighlightColor: 'transparent',
                    }}
                >
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: currentColor,
                        border: '2px solid white',
                    }} />
                </button>

                {/* Size Button */}
                <button
                    onClick={() => { setShowSizePicker(!showSizePicker); setShowColorPicker(false); }}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: showSizePicker ? '2px solid #6366f1' : '2px solid #374151',
                        cursor: 'pointer',
                        flexShrink: 0,
                        backgroundColor: '#374151',
                        WebkitTapHighlightColor: 'transparent',
                    }}
                >
                    <div style={{
                        width: Math.min(strokeWidth * 2, 20),
                        height: Math.min(strokeWidth * 2, 20),
                        borderRadius: '50%',
                        backgroundColor: 'white',
                    }} />
                </button>

                <div style={{ width: '1px', backgroundColor: '#4b5563', flexShrink: 0 }} />

                <ActionButtons
                    onUndo={onUndo}
                    onRedo={onRedo}
                    onSave={onSave}
                    onDownload={onDownload}
                    onClear={onClear}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    isMobile={true}
                    isDarkTheme={isDarkTheme}
                />
            </div>

            {/* Popups */}
            <ColorPicker
                currentColor={currentColor}
                onColorChange={onColorChange}
                showPicker={showColorPicker}
                onClose={() => setShowColorPicker(false)}
                isMobile={true}
                isDarkTheme={isDarkTheme}
            />

            <StrokePicker
                strokeWidth={strokeWidth}
                onStrokeChange={onStrokeWidthChange}
                showPicker={showSizePicker}
                onClose={() => setShowSizePicker(false)}
                isMobile={true}
                isDarkTheme={isDarkTheme}
            />
        </div>
    );
};
