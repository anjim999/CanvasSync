import React from 'react';
import { STROKE_WIDTHS } from '../../types';

interface StrokePickerProps {
    strokeWidth: number;
    onStrokeChange: (width: number) => void;
    showPicker?: boolean; // For mobile popup
    onClose?: () => void; // For mobile popup
    isMobile?: boolean;
    isDarkTheme?: boolean;
}

export const StrokePicker: React.FC<StrokePickerProps> = ({
    strokeWidth,
    onStrokeChange,
    showPicker = false,
    onClose,
    isMobile = false,
    isDarkTheme = false
}) => {
    // Desktop Layout (Inline)
    if (!isMobile) {
        return (
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                {STROKE_WIDTHS.slice(0, 3).map((width) => (
                    <button
                        key={width}
                        onClick={() => onStrokeChange(width)}
                        style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: strokeWidth === width ? '#6366f1' : (isDarkTheme ? '#374151' : '#e5e7eb'),
                        }}
                    >
                        <div style={{
                            width: Math.min(width, 12),
                            height: Math.min(width, 12),
                            borderRadius: '50%',
                            backgroundColor: 'white', // Dot is always white/contrast
                        }} />
                    </button>
                ))}
            </div>
        );
    }

    // Mobile Layout (Popup)
    if (!showPicker) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: isDarkTheme ? 'rgba(26, 26, 46, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '16px',
            border: isDarkTheme ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            zIndex: 51,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                {STROKE_WIDTHS.map((width) => (
                    <button
                        key={width}
                        onClick={() => { onStrokeChange(width); onClose?.(); }}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: strokeWidth === width ? '#6366f1' : (isDarkTheme ? '#374151' : '#e5e7eb'),
                            WebkitTapHighlightColor: 'transparent',
                        }}
                    >
                        <div style={{
                            width: Math.min(width * 2, 24),
                            height: Math.min(width * 2, 24),
                            borderRadius: '50%',
                            backgroundColor: strokeWidth === width ? 'white' : (isDarkTheme ? 'white' : '#374151'),
                        }} />
                    </button>
                ))}
            </div>
        </div>
    );
};
