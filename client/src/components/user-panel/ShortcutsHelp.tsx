import React from 'react';

export const ShortcutsHelp: React.FC = () => {
    return (
        <div style={{ fontSize: '12px', color: '#6b7280', borderTop: '1px solid #374151', paddingTop: '8px' }}>
            <p style={{ margin: '2px 0' }}>
                <kbd style={{ padding: '2px 4px', backgroundColor: '#374151', borderRadius: '4px' }}>Ctrl+Z</kbd> Undo
            </p>
            <p style={{ margin: '2px 0' }}>
                <kbd style={{ padding: '2px 4px', backgroundColor: '#374151', borderRadius: '4px' }}>Ctrl+Y</kbd> Redo
            </p>
        </div>
    );
};
