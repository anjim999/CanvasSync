import React from 'react';
import type { Tool } from '../../types';

interface ToolButtonProps {
    toolId: Tool;
    activeTool: Tool;
    icon: React.ElementType;
    label: string;
    onClick: (tool: Tool) => void;
    isMobile?: boolean;
    isDarkTheme?: boolean;
}

export const ToolButton: React.FC<ToolButtonProps> = ({
    toolId,
    activeTool,
    icon: Icon,
    label,
    onClick,
    isMobile = false,
    isDarkTheme = false,
}) => {
    const isActive = activeTool === toolId;

    const size = isMobile ? '44px' : '48px';
    const borderRadius = isMobile ? '10px' : '12px';
    const iconSize = 20;

    return (
        <button
            onClick={() => onClick(toolId)}
            style={{
                width: size,
                height: size,
                borderRadius: borderRadius,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
                backgroundColor: isActive ? '#6366f1' : (isDarkTheme ? '#374151' : '#f3f4f6'),
                boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none',
                color: isActive ? 'white' : (isDarkTheme ? 'white' : '#374151'),
                WebkitTapHighlightColor: 'transparent',
                transition: 'all 0.2s',
            }}
            title={label}
        >
            <Icon size={iconSize} />
        </button>
    );
};
