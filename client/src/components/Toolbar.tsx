import React from 'react';
import type { Tool } from '../types';
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
} from 'lucide-react';
import { MobileToolbar } from './toolbar/MobileToolbar';
import { DesktopToolbar } from './toolbar/DesktopToolbar';

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

export const Toolbar: React.FC<ToolbarProps> = (props) => {
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

    if (props.isMobile) {
        return (
            <MobileToolbar
                {...props}
                isFilled={props.isFilled || false}
                onToggleFill={props.onToggleFill || (() => { })}
                tools={tools}
            />
        );
    }

    return (
        <DesktopToolbar
            {...props}
            isFilled={props.isFilled || false}
            onToggleFill={props.onToggleFill || (() => { })}
            tools={tools}
        />
    );
};
