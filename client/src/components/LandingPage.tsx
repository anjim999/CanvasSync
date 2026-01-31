import React from 'react';
import { Palette, Users, Zap, Undo2, MessageSquare, MousePointer, Sparkles, PenTool } from 'lucide-react';

interface LandingPageProps {
    onStartDrawing: () => void;
    isDarkTheme: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartDrawing, isDarkTheme }) => {
    const theme = {
        bg: isDarkTheme ? '#0a0a12' : '#f8fafc',
        cardBg: isDarkTheme ? 'rgba(30, 30, 50, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        text: isDarkTheme ? '#ffffff' : '#1a1a2e',
        textSecondary: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        accent: '#6366f1',
        accentHover: '#5558e3',
        border: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    };

    const features = [
        {
            icon: Users,
            title: 'Real-Time Collaboration',
            description: 'Draw together with friends and teammates in real-time. See live cursors and changes instantly.',
        },
        {
            icon: Palette,
            title: 'Rich Drawing Tools',
            description: 'Brush, shapes, arrows, and more. Express your ideas with our comprehensive toolset.',
        },
        {
            icon: MousePointer,
            title: 'Select & Move',
            description: 'Click to select any shape, drag to reposition. Full control over your creations.',
        },
        {
            icon: Undo2,
            title: 'Global Undo/Redo',
            description: 'Made a mistake? Undo any action on the canvas. Works across all users.',
        },
        {
            icon: MessageSquare,
            title: 'Built-in Chat',
            description: 'Communicate with your team while drawing. No need for external chat apps.',
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Optimized for performance. Smooth 60fps drawing with low latency sync.',
        },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: theme.bg,
            color: theme.text,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
            {/* Navbar */}
            <nav style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 40px',
                borderBottom: `1px solid ${theme.border}`,
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: isDarkTheme ? 'rgba(10, 10, 18, 0.8)' : 'rgba(248, 250, 252, 0.8)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Palette size={24} color="white" />
                    </div>
                    <span style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        CanvasSync
                    </span>
                </div>
                <button
                    onClick={onStartDrawing}
                    style={{
                        padding: '10px 24px',
                        backgroundColor: theme.accent,
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.accentHover}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.accent}
                >
                    Start Drawing
                </button>
            </nav>

            {/* Hero Section */}
            <section style={{
                padding: '80px 40px',
                textAlign: 'center',
                maxWidth: '900px',
                margin: '0 auto',
            }}>
                <div style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    backgroundColor: isDarkTheme ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '20px',
                    marginBottom: '24px',
                }}>
                    <span style={{ color: theme.accent, fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={16} /> Real-Time Collaborative Drawing
                    </span>
                </div>

                <h1 style={{
                    fontSize: 'clamp(36px, 6vw, 64px)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: '24px',
                    background: isDarkTheme
                        ? 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)'
                        : 'linear-gradient(135deg, #1a1a2e 0%, #6366f1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Draw Together,<br />Create Together
                </h1>

                <p style={{
                    fontSize: '18px',
                    color: theme.textSecondary,
                    maxWidth: '600px',
                    margin: '0 auto 40px',
                    lineHeight: 1.6,
                }}>
                    CanvasSync is a powerful real-time collaborative whiteboard where teams can
                    sketch ideas, draw diagrams, and create together from anywhere in the world.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={onStartDrawing}
                        style={{
                            padding: '16px 40px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '18px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PenTool size={20} /> Start Drawing Now
                        </span>
                    </button>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '48px',
                    marginTop: '60px',
                    flexWrap: 'wrap',
                }}>
                    {[
                        { value: '60 FPS', label: 'Smooth Drawing' },
                        { value: '<50ms', label: 'Sync Latency' },
                        { value: '8+', label: 'Drawing Tools' },
                    ].map((stat, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: 700,
                                color: theme.accent,
                            }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: '14px', color: theme.textSecondary }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section style={{
                padding: '60px 40px 100px',
                maxWidth: '1200px',
                margin: '0 auto',
            }}>
                <h2 style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    textAlign: 'center',
                    marginBottom: '48px',
                }}>
                    Everything You Need to Collaborate
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                }}>
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '28px',
                                backgroundColor: theme.cardBg,
                                borderRadius: '16px',
                                border: `1px solid ${theme.border}`,
                                transition: 'all 0.3s ease',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = theme.accent;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = theme.border;
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: `linear-gradient(135deg, ${theme.accent}20 0%, ${theme.accent}10 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px',
                            }}>
                                <feature.icon size={24} color={theme.accent} />
                            </div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: 600,
                                marginBottom: '8px',
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{
                                fontSize: '14px',
                                color: theme.textSecondary,
                                lineHeight: 1.6,
                            }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '24px 40px',
                borderTop: `1px solid ${theme.border}`,
                textAlign: 'center',
            }}>
                <p style={{ fontSize: '14px', color: theme.textSecondary }}>
                    &copy; 2025 CanvasSync. All rights reserved.
                </p>
            </footer>
        </div>
    );
};
