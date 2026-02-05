import React from 'react';
import './layout.css';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
    return (
        <div className={`container ${className}`}>
            {children}
        </div>
    );
};

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className = '', id }) => {
    return (
        <section id={id} className={`section ${className}`}>
            {children}
        </section>
    );
};
