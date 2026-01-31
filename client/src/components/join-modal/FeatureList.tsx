import React from 'react';
import { Palette, Users, RotateCcw } from 'lucide-react';

interface FeatureListProps {
    isMobile: boolean;
}

const Feature = ({ icon, label, color, isMobile }: { icon: React.ReactNode; label: string; color: string; isMobile?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
        <div style={{
            padding: isMobile ? '12px' : '16px',
            borderRadius: isMobile ? '12px' : '16px',
            backgroundColor: '#16162a',
            border: '1px solid #2a2a4a',
            color
        }}>
            {icon}
        </div>
        <span style={{
            fontSize: isMobile ? '10px' : '12px',
            color: '#9ca3af',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }}>{label}</span>
    </div>
);

export const FeatureList: React.FC<FeatureListProps> = ({ isMobile }) => {
    return (
        <div style={{
            marginTop: isMobile ? '24px' : '48px',
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '20px' : '48px',
            flexWrap: 'wrap',
        }}>
            <Feature icon={<Palette size={isMobile ? 20 : 28} />} label="Real-time" color="#818cf8" isMobile={isMobile} />
            <Feature icon={<Users size={isMobile ? 20 : 28} />} label="Multi-user" color="#c084fc" isMobile={isMobile} />
            <Feature icon={<RotateCcw size={isMobile ? 20 : 28} />} label="Undo/Redo" color="#34d399" isMobile={isMobile} />
        </div>
    );
};
