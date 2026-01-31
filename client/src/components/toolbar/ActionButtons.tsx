import React from 'react';
import { Undo2, Redo2, Save, Download, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
    onUndo: () => void;
    onRedo: () => void;
    onSave: () => void;
    onDownload: () => void;
    onClear: () => void;
    canUndo: boolean;
    canRedo: boolean;
    isMobile?: boolean;
    isDarkTheme?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    onUndo,
    onRedo,
    onSave,
    onDownload,
    onClear,
    canUndo,
    canRedo,
    isMobile = false,
}) => {
    const iconSize = 20;

    const actionBtnStyle = (enabled: boolean, bgColor: string) => ({
        width: isMobile ? '44px' : '48px',
        height: isMobile ? '44px' : '40px',
        borderRadius: isMobile ? '10px' : '8px',
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
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
    });

    return (
        <>
            <button onClick={onUndo} disabled={!canUndo} style={actionBtnStyle(canUndo, '#374151')} title="Undo (Ctrl+Z)">
                <Undo2 size={iconSize} />
            </button>
            <button onClick={onRedo} disabled={!canRedo} style={actionBtnStyle(canRedo, '#374151')} title="Redo (Ctrl+Y)">
                <Redo2 size={iconSize} />
            </button>
            <button onClick={onSave} style={actionBtnStyle(true, '#16a34a')} title="Save Canvas">
                <Save size={iconSize} />
            </button>
            <button onClick={onDownload} style={actionBtnStyle(true, '#0ea5e9')} title="Download PNG">
                <Download size={iconSize} />
            </button>
            <button onClick={onClear} style={actionBtnStyle(true, '#dc2626')} title="Clear Canvas">
                <Trash2 size={iconSize} />
            </button>
        </>
    );
};
