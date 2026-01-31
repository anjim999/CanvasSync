import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingPage } from '../components/LandingPage';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleStartDrawing = () => {
        navigate('/draw');
    };

    return (
        <LandingPage
            onStartDrawing={handleStartDrawing}
            isDarkTheme={true}
        />
    );
};
