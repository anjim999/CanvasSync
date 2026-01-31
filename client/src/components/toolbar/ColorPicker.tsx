import React from 'react';
import { PRESET_COLORS } from '../../types';

interface ColorPickerProps {
    currentColor: string;
    onColorChange: (color: string) => void;
    showPicker?: boolean; // For mobile popup
    onClose?: () => void; // For mobile popup
    isMobile?: boolean;
    isDarkTheme?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
    currentColor,
    onColorChange,
    showPicker = false,
    onClose,
    isMobile = false,
}) => {
    // Desktop Layout (Inline)
    if (!isMobile) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <span style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#6b7280'
                }}>
                    Color
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {PRESET_COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => onColorChange(color)}
                            style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: color,
                                border: currentColor === color ? '2px solid white' : '2px solid transparent',
                                cursor: 'pointer',
                                transform: currentColor === color ? 'scale(1.1)' : 'scale(1)',
                                transition: 'all 0.2s',
                                boxShadow: currentColor === color ? '0 0 0 2px rgba(99, 102, 241, 0.5)' : 'none',
                            }}
                            title={color}
                        />
                    ))}
                </div>
                <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    style={{
                        width: '40px',
                        height: '24px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: 'none',
                        marginTop: '4px'
                    }}
                />
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
                        onClick={() => { onColorChange(color); onClose?.(); }}
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
                onChange={(e) => { onColorChange(e.target.value); onClose?.(); }}
                style={{
                    width: '100%',
                    height: '36px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: 'none',
                    marginTop: '12px'
                }}
            />
        </div>
    );
};
