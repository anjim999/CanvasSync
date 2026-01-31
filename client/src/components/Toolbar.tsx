import React, { useState } from 'react';
import type { Tool } from '../types';
import { PRESET_COLORS, STROKE_WIDTHS } from '../types';
import {
    Brush,
    Eraser,
    Minus,
    MoveRight,
    Square,
    Circle,
    Triangle,
    Diamond,
    Type,
    Undo2,
    Redo2,
    Save,
    Download,
    Trash2,
    Sun,
    Moon,
    PaintBucket
} from 'lucide-react';

interface ToolbarProps {
    currentTool: Tool;
    currentColor: string;
    strokeWidth: number;
    isFilled?: boolean;
    onToolChange: (tool: Tool) => void;
    onColorChange: (color: string) => void;
    onStrokeWidthChange: (width: number) => void;
    onToggleFill?: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onClear: () => void;
    onSave: () => void;
    onDownload: () => void;
    canUndo: boolean;
    canRedo: boolean;
    isMobile?: boolean;
    isDarkTheme: boolean;
    onToggleTheme: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    currentTool,
    currentColor,
    strokeWidth,
    isFilled = false,
    onToolChange,
    onColorChange,
    onStrokeWidthChange,
    onToggleFill,
    onUndo,
    onRedo,
    onClear,
    onSave,
    onDownload,
    canUndo,
    canRedo,
    isMobile = false,
    isDarkTheme,
    onToggleTheme,
}) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showSizePicker, setShowSizePicker] = useState(false);

    const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
        { id: 'brush', icon: Brush, label: 'Brush' },
        { id: 'eraser', icon: Eraser, label: 'Eraser' },
        { id: 'line', icon: Minus, label: 'Line' },
        { id: 'arrow', icon: MoveRight, label: 'Arrow' },
        { id: 'rectangle', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
        { id: 'triangle', icon: Triangle, label: 'Triangle' },
        { id: 'diamond', icon: Diamond, label: 'Diamond' },
        { id: 'text', icon: Type, label: 'Text' },
    ];

    const iconSize = isMobile ? 20 : 20;

    // Mobile Bottom Toolbar
    if (isMobile) {
        return (
            <>
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
                            <button
                                key={tool.id}
                                onClick={() => onToolChange(tool.id)}
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
                                    backgroundColor: currentTool === tool.id ? '#6366f1' : (isDarkTheme ? '#374151' : '#f3f4f6'),
                                    boxShadow: currentTool === tool.id ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none',
                                    color: currentTool === tool.id ? 'white' : (isDarkTheme ? 'white' : '#374151'),
                                    WebkitTapHighlightColor: 'transparent',
                                }}
                                title={tool.label}
                            >
                                <tool.icon size={iconSize} />
                            </button>
                        ))}

                        {/* Fill Toggle */}
                        {onToggleFill && (
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
                                <PaintBucket size={iconSize} />
                            </button>
                        )}


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

                        {/* Actions */}
                        <button onClick={onUndo} disabled={!canUndo} style={{
                            width: '44px', height: '44px', borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: canUndo ? 'pointer' : 'not-allowed',
                            opacity: canUndo ? 1 : 0.5, backgroundColor: '#374151', flexShrink: 0,
                            WebkitTapHighlightColor: 'transparent', color: 'white'
                        }}>
                            <Undo2 size={iconSize} />
                        </button>
                        <button onClick={onRedo} disabled={!canRedo} style={{
                            width: '44px', height: '44px', borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: canRedo ? 'pointer' : 'not-allowed',
                            opacity: canRedo ? 1 : 0.5, backgroundColor: '#374151', flexShrink: 0,
                            WebkitTapHighlightColor: 'transparent', color: 'white'
                        }}>
                            <Redo2 size={iconSize} />
                        </button>
                        <button onClick={onSave} style={{
                            width: '44px', height: '44px', borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer', backgroundColor: '#16a34a', flexShrink: 0,
                            WebkitTapHighlightColor: 'transparent', color: 'white'
                        }}>
                            <Save size={iconSize} />
                        </button>
                        <button onClick={onDownload} style={{
                            width: '44px', height: '44px', borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer', backgroundColor: '#0ea5e9', flexShrink: 0,
                            WebkitTapHighlightColor: 'transparent', color: 'white'
                        }} title="Download PNG">
                            <Download size={iconSize} />
                        </button>
                        <button onClick={onClear} style={{
                            width: '44px', height: '44px', borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer', backgroundColor: '#dc2626', flexShrink: 0,
                            WebkitTapHighlightColor: 'transparent', color: 'white'
                        }}>
                            <Trash2 size={iconSize} />
                        </button>
                    </div>
                </div>

                {/* Color Picker Popup */}
                {showColorPicker && (
                    <div style={{
                        position: 'fixed',
                        bottom: '80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(26, 26, 46, 0.98)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 51,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => { onColorChange(color); setShowColorPicker(false); }}
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        backgroundColor: color,
                                        border: currentColor === color ? '3px solid white' : '2px solid transparent',
                                        cursor: 'pointer',
                                        WebkitTapHighlightColor: 'transparent',
                                    }}
                                />
                            ))}
                        </div>
                        <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => { onColorChange(e.target.value); setShowColorPicker(false); }}
                            style={{ width: '100%', height: '36px', borderRadius: '8px', cursor: 'pointer', border: 'none', marginTop: '12px' }}
                        />
                    </div>
                )}

                {/* Size Picker Popup */}
                {showSizePicker && (
                    <div style={{
                        position: 'fixed',
                        bottom: '80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(26, 26, 46, 0.98)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 51,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {STROKE_WIDTHS.map((width) => (
                                <button
                                    key={width}
                                    onClick={() => { onStrokeWidthChange(width); setShowSizePicker(false); }}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: 'none',
                                        cursor: 'pointer',
                                        backgroundColor: strokeWidth === width ? '#6366f1' : '#374151',
                                        WebkitTapHighlightColor: 'transparent',
                                    }}
                                >
                                    <div style={{
                                        width: Math.min(width * 2, 24),
                                        height: Math.min(width * 2, 24),
                                        borderRadius: '50%',
                                        backgroundColor: 'white',
                                    }} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </>
        );
    }

    // Desktop Toolbar (Original)
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

    const toolBtnStyle = (isActive: boolean): React.CSSProperties => ({
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
        backgroundColor: isActive ? '#6366f1' : (isDarkTheme ? '#374151' : '#f3f4f6'),
        boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none',
        color: isActive ? 'white' : (isDarkTheme ? 'white' : '#374151'),
    });

    const dividerStyle: React.CSSProperties = {
        height: '1px',
        backgroundColor: isDarkTheme ? '#4b5563' : '#e5e7eb',
        width: '100%',
        opacity: 0.3,
    };

    const colorSwatchStyle = (color: string, isActive: boolean): React.CSSProperties => ({
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: color,
        border: isActive ? '2px solid white' : '2px solid transparent',
        cursor: 'pointer',
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.2s',
        boxShadow: isActive ? '0 0 0 2px rgba(99, 102, 241, 0.5)' : 'none',
    });

    const actionBtnStyle = (enabled: boolean, bgColor: string): React.CSSProperties => ({
        width: '48px',
        height: '40px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        border: 'none',
        cursor: enabled ? 'pointer' : 'not-allowed',
        opacity: enabled ? 1 : 0.5,
        backgroundColor: bgColor,
        transition: 'all 0.2s',
        color: 'white',
    });

    return (
        <div style={panelStyle}>
            {/* Tools */}
            <div style={sectionStyle}>
                <span style={labelStyle}>Tools</span>
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => onToolChange(tool.id)}
                        style={toolBtnStyle(currentTool === tool.id)}
                        title={tool.label}
                    >
                        <tool.icon size={22} />
                    </button>
                ))}
            </div>

            <div style={dividerStyle} />

            {/* Fill & Size */}
            <div style={sectionStyle}>
                <span style={labelStyle}>Style</span>

                {onToggleFill && (
                    <button
                        onClick={onToggleFill}
                        style={toolBtnStyle(isFilled)}
                        title="Toggle Fill"
                    >
                        <PaintBucket size={22} />
                    </button>
                )}

                <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                    {STROKE_WIDTHS.slice(0, 3).map((width) => (
                        <button
                            key={width}
                            onClick={() => onStrokeWidthChange(width)}
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: strokeWidth === width ? '#6366f1' : '#374151',
                            }}
                        >
                            <div style={{
                                width: Math.min(width, 12),
                                height: Math.min(width, 12),
                                borderRadius: '50%',
                                backgroundColor: 'white',
                            }} />
                        </button>
                    ))}
                </div>
            </div>

            <div style={dividerStyle} />

            {/* Colors */}
            <div style={sectionStyle}>
                <span style={labelStyle}>Color</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {PRESET_COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => onColorChange(color)}
                            style={colorSwatchStyle(color, currentColor === color)}
                            title={color}
                        />
                    ))}
                </div>
                <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    style={{ width: '40px', height: '24px', borderRadius: '4px', cursor: 'pointer', border: 'none', marginTop: '4px' }}
                />
            </div>

            <div style={dividerStyle} />

            {/* Actions */}
            <div style={{ ...sectionStyle, marginTop: 'auto' }}>
                <button onClick={onUndo} disabled={!canUndo} style={actionBtnStyle(canUndo, '#374151')} title="Undo (Ctrl+Z)">
                    <Undo2 size={20} />
                </button>
                <button onClick={onRedo} disabled={!canRedo} style={actionBtnStyle(canRedo, '#374151')} title="Redo (Ctrl+Y)">
                    <Redo2 size={20} />
                </button>
                <button onClick={onSave} style={actionBtnStyle(true, '#16a34a')} title="Save Canvas">
                    <Save size={20} />
                </button>
                <button onClick={onDownload} style={actionBtnStyle(true, '#0ea5e9')} title="Download PNG">
                    <Download size={20} />
                </button>
                <button onClick={onClear} style={actionBtnStyle(true, '#dc2626')} title="Clear Canvas">
                    <Trash2 size={20} />
                </button>

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
