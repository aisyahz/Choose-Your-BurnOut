import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface Stats {
  energy: number;
  money: number;
  sanity: number;
  ego: number;
  sleep: number;
}

interface BurnoutFaceProps {
  stats: Stats;
  isProcessing?: boolean;
  forceGlitch?: boolean;
  isFinal?: boolean;
}

const BurnoutFace: React.FC<BurnoutFaceProps> = ({ stats, isProcessing, forceGlitch, isFinal }) => {
  // Normalize stats to 0-1 range for easier mapping
  const s = useMemo(() => ({
    energy: stats.energy / 100,
    money: stats.money / 100,
    sanity: stats.sanity / 100,
    ego: stats.ego / 100,
    sleep: stats.sleep / 100,
  }), [stats]);

  // Overall burnout level (0 to 1, where 1 is total burnout)
  const burnoutLevel = (forceGlitch || isFinal) ? 1 : 1 - (s.energy + s.sanity + s.sleep) / 3;
  
  // 5-Stage Progression Logic
  const stage = useMemo(() => {
    if (burnoutLevel < 0.2) return 1; // Composed
    if (burnoutLevel < 0.4) return 2; // Tired
    if (burnoutLevel < 0.6) return 3; // Strained
    if (burnoutLevel < 0.8) return 4; // Unstable
    return 5; // Burnout / Mad Engineer
  }, [burnoutLevel]);

  // Derived visual properties for "Ugly" and "3D" look
  const eyeDroopL = (1 - s.sleep) * (1 + (1 - s.sanity) * 0.5);
  const eyeDroopR = (1 - s.sleep) * (1 + (1 - s.sanity) * 0.2); // Asymmetric droop
  const asymmetry = (1 - s.sanity) * 15;
  const headTilt = (1 - s.energy) * 12 + (stage > 3 ? (Math.random() - 0.5) * 5 : 0);
  const mouthSmile = (s.ego - 0.5) * 25; 
  const cheekHollow = burnoutLevel * 12;
  const jawWarp = (1 - s.sanity) * 10;

  // Hair strands generation - more "wire-like" and chaotic
  const hairStrands = useMemo(() => {
    const count = Math.floor(180 + burnoutLevel * 120); // Significantly increased count for "full" look
    const strands = Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * 280 - 240; 
      const length = 40 + Math.random() * 50 + (burnoutLevel * 60);
      const thickness = 0.4 + Math.random() * 1.2; // Increased thickness for fullness
      const isMessy = burnoutLevel > 0.3;
      const isChaotic = burnoutLevel > 0.6;
      const isGlitching = burnoutLevel > 0.85 || isFinal;
      
      // Vary start point to follow mask edge more naturally
      const startRadius = 52 + (Math.random() - 0.5) * 15;
      const startX = Math.sin((angle * Math.PI) / 180) * 5; // Slight horizontal spread at start
      const startY = -startRadius;

      // Stabilize path points
      const cp1x = (Math.random() - 0.5) * (isMessy ? 50 : 15);
      const cp1y = startY - length / 2;
      const endX = (Math.random() - 0.5) * (isChaotic ? 70 : 25);
      const endY = startY - length;

      // Jagged path for high burnout
      const isJagged = (isChaotic || isFinal) && Math.random() > 0.6;
      const midX = (cp1x + endX) / 2 + (Math.random() - 0.5) * 25;
      const midY = (cp1y + endY) / 2;

      return {
        id: i,
        angle,
        length,
        thickness,
        isMessy,
        isChaotic,
        isGlitching,
        isJagged,
        startX,
        startY,
        path: isJagged 
          ? `M ${startX} ${startY} L ${midX} ${midY} L ${endX} ${endY}`
          : `M ${startX} ${startY} Q ${cp1x} ${cp1y} ${endX} ${endY}`,
        endX,
        endY,
        hasNode: Math.random() > 0.5,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 2
      };
    });

    // Add a few extra long, chaotic strands for "fullness" and "messiness"
    const extraCount = Math.floor(20 + burnoutLevel * 40);
    const extraStrands = Array.from({ length: extraCount }).map((_, i) => {
      const angle = Math.random() * 360;
      const length = 80 + Math.random() * 100 * burnoutLevel;
      const thickness = 0.2 + Math.random() * 0.5;
      const startRadius = 45 + Math.random() * 10;
      const startX = Math.cos((angle * Math.PI) / 180) * startRadius;
      const startY = Math.sin((angle * Math.PI) / 180) * startRadius;
      const endX = startX + (Math.random() - 0.5) * length;
      const endY = startY + (Math.random() - 0.5) * length;

      return {
        id: `extra-${i}`,
        angle: 0,
        length,
        thickness,
        isMessy: true,
        isChaotic: true,
        isGlitching: burnoutLevel > 0.8 || isFinal,
        isJagged: true,
        startX,
        startY,
        path: `M ${startX} ${startY} Q ${startX + (endX - startX)/2 + (Math.random()-0.5)*40} ${startY + (endY - startY)/2 + (Math.random()-0.5)*40} ${endX} ${endY}`,
        endX,
        endY,
        hasNode: Math.random() > 0.7,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2
      };
    });

    return [...strands, ...extraStrands];
  }, [burnoutLevel, isFinal]);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      <motion.svg 
        viewBox="0 0 200 200" 
        fill="none" 
        className="w-full h-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
        animate={{
          y: [0, -8, 0],
          rotateZ: isFinal ? 0 : headTilt,
          rotateX: isFinal ? 15 : (1 - s.energy) * 18 - 6,
          rotateY: isFinal ? -10 : (s.ego - 0.5) * 30,
          scale: isProcessing ? [1, 1.05, 1] : 1,
        }}
        transition={{
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          rotateZ: { duration: 1.2 },
          rotateX: { duration: 1.5 },
          rotateY: { duration: 1.5 },
          scale: { duration: 0.2 }
        }}
      >
        <defs>
          {/* 1. Back Glow Gradient - Pulsing and Reactive */}
          <radialGradient id="backGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={burnoutLevel > 0.7 ? "#FF0000" : "#F5F5F5"} stopOpacity={0.1 + burnoutLevel * 0.2} />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>

          {/* 2. Head Base Gradient (Sculpted Mask) */}
          <linearGradient id="maskSurface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#333" />
            <stop offset="20%" stopColor="#222" />
            <stop offset="50%" stopColor="#111" />
            <stop offset="80%" stopColor="#080808" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>

          {/* 3. Shadow Plane Gradient */}
          <linearGradient id="shadowPlane" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
          </linearGradient>

          {/* 4. Highlight Gradient - Dynamic Rim Light */}
          <linearGradient id="highlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF" stopOpacity={0.2 + burnoutLevel * 0.1} />
            <stop offset="50%" stopColor="#FFF" stopOpacity="0" />
            <stop offset="100%" stopColor="#FFF" stopOpacity={0.2 + burnoutLevel * 0.1} />
          </linearGradient>

          <radialGradient id="eyeSocket" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>

          {/* 5. Glitch Filter */}
          <filter id="glitchFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="noise">
              <animate attributeName="baseFrequency" values="0.01;0.05;0.01" dur="0.1s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={(burnoutLevel > 0.8 || isFinal) ? 8 : 0} />
          </filter>

          {/* 6. Specular Highlight */}
          <radialGradient id="specular" cx="30%" cy="30%" r="30%">
            <stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* LAYER 1: BACK GLOW */}
        <motion.circle
          cx="100" cy="100" r="100"
          fill="url(#backGlow)"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* LAYER 2: HAIR (Wired behind the head) */}
        <g transform="translate(100, 100)">
          {/* Hair Volume Base */}
          <motion.path
            d="M -65 -45 C -80 -80 -40 -110 0 -110 C 40 -110 80 -80 65 -45"
            fill={burnoutLevel > 0.8 ? "#300" : "#222"}
            opacity={0.3 + burnoutLevel * 0.4}
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          {hairStrands.map((hair) => (
            <g key={hair.id} transform={`rotate(${hair.angle})`}>
              <motion.path
                d={hair.path}
                stroke={burnoutLevel > 0.8 ? "#FF0000" : "#F5F5F5"}
                strokeWidth={hair.thickness}
                opacity={0.25 + (burnoutLevel * 0.5)}
                animate={hair.isGlitching ? {
                  opacity: [0.1, 1, 0.1],
                  strokeWidth: [hair.thickness, hair.thickness * 2.5, hair.thickness],
                  pathLength: [1, 0.7, 1]
                } : {
                  rotate: [0, hair.isMessy ? 3 : 0.8, 0]
                }}
                transition={{
                  duration: hair.isGlitching ? 0.04 : hair.duration,
                  repeat: Infinity,
                  delay: hair.delay
                }}
              />
              {/* Junction Nodes at wire ends - Glow more at high burnout */}
              {hair.hasNode && (
                <motion.circle
                  cx={hair.endX}
                  cy={hair.endY}
                  r={hair.thickness * 2}
                  fill={burnoutLevel > 0.8 ? "#FF0000" : "#F5F5F5"}
                  opacity={0.3 + (burnoutLevel * 0.6)}
                  animate={hair.isGlitching ? {
                    scale: [1, 3, 1],
                    opacity: [0.3, 1, 0.3]
                  } : {
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ 
                    duration: hair.isGlitching ? 0.08 : 2, 
                    repeat: Infinity,
                    delay: hair.delay 
                  }}
                />
              )}
            </g>
          ))}
        </g>

        <motion.g
          animate={{ 
            x: (isProcessing || isFinal) ? [0, -2, 2, -2, 0] : 0,
          }}
          transition={{ duration: isFinal ? 0.1 : 0.4, repeat: isFinal ? Infinity : 0 }}
          filter={(burnoutLevel > 0.8 || isFinal) ? "url(#glitchFilter)" : "none"}
        >
          {/* Chromatic Aberration Layers for Final State */}
          {isFinal && (
            <>
              <motion.g
                animate={{ x: [-1, 1, -1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                style={{ mixBlendMode: 'screen' }}
              >
                <path
                  d={`M 60 60 
                     C 50 ${70 + cheekHollow} 50 ${130 - cheekHollow} ${60 + jawWarp} 150 
                     Q 100 ${165 + jawWarp/2} ${140 - jawWarp} 150 
                     C 150 ${130 - cheekHollow} 150 ${70 + cheekHollow} 140 60 
                     Q 100 40 60 60`}
                  fill="#F00"
                  opacity="0.2"
                />
              </motion.g>
              <motion.g
                animate={{ x: [1, -1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 0.15, repeat: Infinity }}
                style={{ mixBlendMode: 'screen' }}
              >
                <path
                  d={`M 60 60 
                     C 50 ${70 + cheekHollow} 50 ${130 - cheekHollow} ${60 + jawWarp} 150 
                     Q 100 ${165 + jawWarp/2} ${140 - jawWarp} 150 
                     C 150 ${130 - cheekHollow} 150 ${70 + cheekHollow} 140 60 
                     Q 100 40 60 60`}
                  fill="#0FF"
                  opacity="0.2"
                />
              </motion.g>
            </>
          )}

          {/* LAYER 3: HEAD BASE (The Mask) */}
          <path
            d={`M 60 60 
               C 50 ${70 + cheekHollow} 50 ${130 - cheekHollow} ${60 + jawWarp} 150 
               Q 100 ${165 + jawWarp/2} ${140 - jawWarp} 150 
               C 150 ${130 - cheekHollow} 150 ${70 + cheekHollow} 140 60 
               Q 100 40 60 60`}
            fill="url(#maskSurface)"
            stroke="#333"
            strokeWidth="0.5"
          />

          {/* LAYER 4: SHADOW PLANES (Contouring) */}
          {/* Forehead Shadow */}
          <path d="M 65 65 Q 100 55 135 65 L 130 75 Q 100 65 70 75 Z" fill="url(#shadowPlane)" opacity="0.4" />
          {/* Cheek Shadows */}
          <path d={`M 55 90 Q 70 110 65 140 L 75 135 Q 80 115 70 95 Z`} fill="url(#shadowPlane)" opacity="0.5" />
          <path d={`M 145 90 Q 130 110 135 140 L 125 135 Q 120 115 130 95 Z`} fill="url(#shadowPlane)" opacity="0.5" />
          {/* Jaw Shadow */}
          <path d="M 70 145 Q 100 155 130 145 L 125 152 Q 100 162 75 152 Z" fill="url(#shadowPlane)" opacity="0.6" />

          {/* LAYER 5: HIGHLIGHTS (Subtle Edge Light) */}
          <path d="M 62 62 Q 100 45 138 62" stroke="url(#highlight)" strokeWidth="1" opacity="0.4" fill="none" />
          <path d="M 65 140 Q 100 155 135 140" stroke="url(#highlight)" strokeWidth="0.5" opacity="0.2" fill="none" />

          {/* LAYER 6: EYES (Sunken Detail) */}
          <g>
            {/* Left Eye Socket */}
            <circle cx={80 + asymmetry/2} cy="85" r="18" fill="url(#eyeSocket)" />
            <g transform={`translate(${80 + asymmetry/2}, 85)`}>
              {/* Sunken Eyelid */}
              <path d="M -10 -5 Q 0 -12 10 -5" stroke="#000" strokeWidth="2" opacity="0.6" fill="none" />
              <motion.ellipse
                cx="0" cy="0" rx="8" ry={8 * (1 - eyeDroopL * 0.85)}
                stroke="#F5F5F5"
                strokeWidth="0.5"
                animate={isFinal ? {
                  ry: [0.5, 8, 0.5],
                  stroke: ["#F5F5F5", "#FF0000", "#F5F5F5"],
                  opacity: [1, 0.5, 1]
                } : { 
                  ry: [8 * (1 - eyeDroopL * 0.85), 0.5, 8 * (1 - eyeDroopL * 0.85)] 
                }}
                transition={isFinal ? {
                  duration: 0.1, repeat: Infinity
                } : { 
                  duration: 6, repeat: Infinity, delay: 1, times: [0, 0.05, 1] 
                }}
              />
              <motion.circle
                cx="0" cy="0" r="1.2"
                fill={(burnoutLevel > 0.6 || isFinal) ? "#FF0000" : "#F5F5F5"}
                animate={(stage === 5 || isFinal) ? { scale: [1, 4, 1], opacity: [1, 0.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: isFinal ? 0.05 : 0.1 }}
              />
              {/* Specular Highlight */}
              <circle cx="-2" cy="-2" r="1" fill="url(#specular)" opacity="0.6" />
            </g>

            {/* Right Eye Socket */}
            <circle cx={120 - asymmetry/2} cy={85 + asymmetry/3} r="18" fill="url(#eyeSocket)" />
            <g transform={`translate(${120 - asymmetry/2}, ${85 + asymmetry/3})`}>
              {/* Sunken Eyelid */}
              <path d="M -10 -5 Q 0 -12 10 -5" stroke="#000" strokeWidth="2" opacity="0.6" fill="none" />
              <motion.ellipse
                cx="0" cy="0" rx="8" ry={8 * (1 - eyeDroopR * 0.85)}
                stroke="#F5F5F5"
                strokeWidth="0.5"
                animate={isFinal ? {
                  ry: [8, 0.5, 8],
                  stroke: ["#F5F5F5", "#FF0000", "#F5F5F5"],
                  opacity: [1, 0.2, 1]
                } : { 
                  ry: [8 * (1 - eyeDroopR * 0.85), 0.5, 8 * (1 - eyeDroopR * 0.85)] 
                }}
                transition={isFinal ? {
                  duration: 0.15, repeat: Infinity
                } : { 
                  duration: 5.2, repeat: Infinity, delay: 2, times: [0, 0.05, 1] 
                }}
              />
              <motion.circle
                cx="0" cy="0" r="1.2"
                fill={(burnoutLevel > 0.6 || isFinal) ? "#FF0000" : "#F5F5F5"}
                animate={(stage >= 4 || isFinal) ? { x: [0, -2, 2, 0], y: [0, 2, -2, 0] } : {}}
                transition={{ repeat: Infinity, duration: isFinal ? 0.05 : 0.15 }}
              />
              {/* Specular Highlight */}
              <circle cx="-2" cy="-2" r="1" fill="url(#specular)" opacity="0.6" />
            </g>
          </g>

          {/* LAYER 7: MOUTH (Expressive Distortion) */}
          <g>
            {/* Mouth Shadow - Pronounced and distorted during spasms */}
            <motion.path
              stroke="#000"
              fill="none"
              animate={stage === 5 ? {
                d: [
                  `M 80 ${138 + asymmetry/2} Q 100 ${138 + asymmetry/2 + mouthSmile} 120 ${138 + asymmetry/2}`, // Strained smile
                  `M 80 ${138 + asymmetry/2} L 120 ${138 + asymmetry/2}`, // Straighten
                  `M 78 ${140 + asymmetry/2} L 95 ${148 + asymmetry/2} L 105 ${132 + asymmetry/2} L 122 ${150 + asymmetry/2}`, // Distorted shadow
                  `M 80 ${138 + asymmetry/2} Q 100 ${138 + asymmetry/2 + mouthSmile} 120 ${138 + asymmetry/2}`, // Revert
                  `M 80 ${138 + asymmetry/2} Q 100 ${138 + asymmetry/2 + mouthSmile} 120 ${138 + asymmetry/2}`  // Hold
                ],
                opacity: [0.3, 0.2, 0.6, 0.4, 0.3],
                strokeWidth: [2, 1.5, 4, 2.5, 2]
              } : {
                d: `M 80 ${138 + asymmetry/2} Q 100 ${138 + asymmetry/2 + mouthSmile} 120 ${138 + asymmetry/2}`,
                opacity: 0.3,
                strokeWidth: 2
              }}
              transition={stage === 5 ? {
                duration: 6,
                repeat: Infinity,
                repeatDelay: 2,
                times: [0, 0.05, 0.15, 0.3, 1],
                ease: "easeInOut"
              } : { duration: 0.5 }}
            />
            {/* Main Mouth Path - Intermittent snapping distortion */}
            <motion.path
              stroke={stage === 5 ? "#8B0000" : "#F5F5F5"}
              strokeWidth="1.5"
              fill="none"
              animate={stage === 5 ? {
                d: [
                  `M 80 ${135 + asymmetry/2} Q 100 ${135 + asymmetry/2 + mouthSmile} 120 ${135 + asymmetry/2}`, // Strained smile
                  `M 80 ${135 + asymmetry/2} L 120 ${135 + asymmetry/2}`, // Straighten
                  `M 80 ${135 + asymmetry/2} L 95 ${142 + asymmetry/2} L 102 ${128 + asymmetry/2} L 115 ${146 + asymmetry/2} L 120 ${135 + asymmetry/2}`, // Sharp grimace
                  `M 80 ${135 + asymmetry/2} Q 100 ${135 + asymmetry/2 + mouthSmile} 120 ${135 + asymmetry/2}`, // Revert
                  `M 80 ${135 + asymmetry/2} Q 100 ${135 + asymmetry/2 + mouthSmile} 120 ${135 + asymmetry/2}`  // Hold
                ],
                stroke: ["#8B0000", "#660000", "#FF0000", "#A00000", "#8B0000"]
              } : {
                d: `M 80 ${135 + asymmetry/2} Q 100 ${135 + asymmetry/2 + mouthSmile} 120 ${135 + asymmetry/2}`,
                stroke: "#F5F5F5"
              }}
              transition={stage === 5 ? {
                duration: 6,
                repeat: Infinity,
                repeatDelay: 2,
                times: [0, 0.05, 0.15, 0.3, 1],
                ease: "easeInOut"
              } : { duration: 0.5 }}
            />
          </g>

          {/* LAYER 8: GLITCH OVERLAYS (System Failure) */}
          {stage >= 4 && (
            <motion.g
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 2 }}
            >
              <rect x="70" y="80" width="60" height="1" fill="#8B0000" />
              <rect x="75" y="120" width="50" height="0.5" fill="#8B0000" />
            </motion.g>
          )}

          {/* Subtle Nose Ridge & Shadow */}
          <g>
            <path d={`M 100 85 Q ${100 + asymmetry/5} 110 ${98 + asymmetry/3} 120`} stroke="#F5F5F5" strokeWidth="0.3" opacity="0.15" fill="none" />
            <path d={`M 98 120 Q 100 125 102 120`} stroke="#000" strokeWidth="1" opacity="0.2" fill="none" />
          </g>
        </motion.g>
      </motion.svg>
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default BurnoutFace;
