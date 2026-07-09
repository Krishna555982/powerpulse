import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <img 
      src="/logo.png?v=4" 
      alt="Power Pulse Energy Logo" 
      className={`object-contain ${className}`}
    />
  );
}
