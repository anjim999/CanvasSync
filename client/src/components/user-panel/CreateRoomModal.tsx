import React, { useState } from 'react';

interface CreateRoomModalProps {
    onClose: () => void;
    onCreate: (name: string) => void;
    isMobile: boolean;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose, onCreate, isMobile }) => {
    const [newRoomName, setNewRoomName] = useState('');

    const handleCreateRoom = () => {
        if (newRoomName.trim()) {
            onCreate(newRoomName.trim());
            setNewRoomName('');
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50,
                padding: isMobile ? '16px' : 0,
            }}
        >
            <div
                style={{
                    backgroundColor: '#1a1a2e',
                    padding: '24px',
                    borderRadius: '16px',
                    width: isMobile ? '100%' : '320px',
                    maxWidth: '320px',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'white' }}>Create New Room</h3>
                <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Room name..."
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#1f2937',
                        border: '1px solid #4b5563',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        color: 'white',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontSize: '16px',
                    }}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '8px 16px',
                            backgroundColor: '#374151',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'white',
                            WebkitTapHighlightColor: 'transparent',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateRoom}
                        style={{
                            flex: 1,
                            padding: '8px 16px',
                            backgroundColor: '#6366f1',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'white',
                            WebkitTapHighlightColor: 'transparent',
                        }}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};
