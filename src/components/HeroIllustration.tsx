import React from 'react';
import { motion } from 'motion/react';

const HeroIllustration = () => {
  return (
    <svg 
      viewBox="0 0 800 1000" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-h-[80vh] opacity-40"
    >
      {/* Background UI Ornaments */}
      <g opacity="0.3">
        <line x1="100" y1="100" x2="700" y2="100" stroke="#F5F5F5" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="100" y1="150" x2="300" y2="150" stroke="#F5F5F5" strokeWidth="1" />
        <circle cx="700" cy="150" r="20" stroke="#F5F5F5" strokeWidth="0.5" />
        <path d="M680 150 H720 M700 130 V170" stroke="#F5F5F5" strokeWidth="0.5" />
      </g>

      {/* The Corporate Ghost / Abstract Figure */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        {/* Head: The Processing Unit */}
        <g transform="translate(400, 250)">
          <circle cx="0" cy="0" r="40" stroke="#F5F5F5" strokeWidth="1" />
          <rect x="-20" y="-20" width="40" height="40" stroke="#F5F5F5" strokeWidth="0.5" opacity="0.5" />
          <line x1="-40" y1="0" x2="40" y2="0" stroke="#F5F5F5" strokeWidth="0.5" />
          <line x1="0" y1="-40" x2="0" y2="40" stroke="#F5F5F5" strokeWidth="0.5" />
          
          {/* Pulsing Core */}
          <motion.circle 
            cx="0" cy="0" r="4" 
            fill="#8B0000"
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Orbital Ring */}
          <motion.circle 
            cx="0" cy="0" r="55" 
            stroke="#F5F5F5" 
            strokeWidth="0.5" 
            strokeDasharray="10 20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </g>

        {/* Torso: The Spreadsheet Body */}
        <g transform="translate(340, 310)">
          <rect x="0" y="0" width="120" height="240" stroke="#F5F5F5" strokeWidth="1" />
          
          {/* Grid Cells */}
          {Array.from({ length: 8 }).map((_, row) => (
            <g key={row}>
              <line x1="0" y1={row * 30} x2="120" y2={row * 30} stroke="#F5F5F5" strokeWidth="0.5" opacity="0.3" />
              {Array.from({ length: 4 }).map((_, col) => (
                <g key={col}>
                  <line x1={col * 30} y1="0" x2={col * 30} y2="240" stroke="#F5F5F5" strokeWidth="0.5" opacity="0.3" />
                  {Math.random() > 0.7 && (
                    <motion.rect 
                      x={col * 30 + 5} y={row * 30 + 5} width="20" height="20" 
                      fill="#F5F5F5" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.2, 0] }}
                      transition={{ duration: Math.random() * 5 + 2, repeat: Infinity }}
                    />
                  )}
                </g>
              ))}
            </g>
          ))}

          {/* Warning Indicator */}
          <rect x="100" y="50" width="10" height="10" fill="#8B0000" opacity="0.6" />
        </g>

        {/* Arms: Data Streams */}
        <g stroke="#F5F5F5" strokeWidth="1">
          {/* Left Arm */}
          <path d="M340 340 L280 400 L260 500" opacity="0.6" />
          <circle cx="260" cy="500" r="3" fill="#F5F5F5" />
          
          {/* Right Arm */}
          <path d="M460 340 L520 400 L540 500" opacity="0.6" />
          <circle cx="540" cy="500" r="3" fill="#F5F5F5" />
        </g>

        {/* Legs: Structural Pillars */}
        <g stroke="#F5F5F5" strokeWidth="1">
          {/* Left Leg */}
          <path d="M370 550 L370 750 L340 850" opacity="0.4" />
          <line x1="330" y1="850" x2="350" y2="850" strokeWidth="2" />
          
          {/* Right Leg */}
          <path d="M430 550 L430 750 L460 850" opacity="0.4" />
          <line x1="450" y1="850" x2="470" y2="850" strokeWidth="2" />
        </g>

        {/* Floating UI Elements around the figure */}
        <g opacity="0.5">
          {/* Mini Chart */}
          <polyline points="550,600 570,580 590,590 610,550" stroke="#8B0000" strokeWidth="1" fill="none" />
          
          {/* Data Nodes */}
          <circle cx="200" cy="450" r="2" fill="#F5F5F5" />
          <circle cx="220" cy="470" r="2" fill="#F5F5F5" />
          <line x1="200" y1="450" x2="220" y2="470" stroke="#F5F5F5" strokeWidth="0.5" />
          
          {/* Warning Triangle */}
          <path d="M650 700 L660 720 H640 Z" stroke="#8B0000" strokeWidth="1" />
        </g>
      </motion.g>

      {/* Bottom Decorative Grid */}
      <g opacity="0.1">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={i} x1="0" y1={900 + i * 10} x2="800" y2={900 + i * 10} stroke="#F5F5F5" strokeWidth="0.5" />
        ))}
      </g>
    </svg>
  );
};

export default HeroIllustration;
