/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight
} from 'lucide-react';
import gameContent from './gameContent.json';
import HeroIllustration from './components/HeroIllustration';
import BurnoutFace from './components/BurnoutFace';
import { sounds } from './lib/audio';

// --- Visual Components ---

const StatIcon = ({ type, value }: { type: string; value: number }) => {
  switch (type) {
    case 'energy':
      return (
        <div className={`relative w-6 h-10 border-2 border-brand-offwhite/30 p-0.5 flex flex-col-reverse ${value < 20 ? 'flicker border-brand-red' : ''}`}>
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-1 bg-brand-offwhite/30" />
          <motion.div 
            className={`w-full ${value < 20 ? 'bg-brand-red' : 'bg-brand-offwhite'}`}
            animate={{ height: `${value}%` }}
          />
        </div>
      );
    case 'money':
      return (
        <motion.div 
          animate={value < 20 ? { x: [-1, 1, -1] } : {}}
          transition={{ repeat: Infinity, duration: 0.1 }}
          className={`font-mono text-2xl font-black ${value < 20 ? 'text-brand-red' : 'text-brand-offwhite'}`}
        >
          ${value.toFixed(0)}
        </motion.div>
      );
    case 'sanity':
      return (
        <div className="relative w-12 h-12">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <motion.circle 
              cx="50" cy="50" r="45" 
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeDasharray="283"
              animate={{ strokeDashoffset: 283 - (283 * value) / 100 }}
              className={value < 20 ? 'text-brand-red' : 'text-brand-offwhite'}
            />
            {value < 50 && (
              <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="1" className="text-brand-red/30" />
            )}
            {value < 20 && (
              <path d="M20 20 L80 80 M80 20 L20 80" stroke="currentColor" strokeWidth="2" className="text-brand-red" />
            )}
          </svg>
        </div>
      );
    case 'ego':
      return (
        <motion.div 
          animate={{ scale: 0.5 + value / 100 }}
          className="w-10 h-10 bg-brand-offwhite/20 border border-brand-offwhite flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-brand-offwhite" />
        </motion.div>
      );
    case 'sleep':
      return (
        <div className="relative w-12 h-6 border-2 border-brand-offwhite/30 rounded-full overflow-hidden flex items-center justify-center">
          <motion.div 
            animate={{ height: value < 20 ? ['100%', '0%', '100%'] : '100%' }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-full bg-brand-black"
          />
          <div className="absolute w-4 h-4 rounded-full bg-brand-offwhite/40" />
        </div>
      );
    default:
      return null;
  }
};

const PathVisual = ({ pathId }: { pathId: string }) => {
  switch (pathId) {
    case 'corporate':
      return (
        <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M 10 10 H 90 V 20 H 20 V 40 H 80 V 60 H 10 V 80 H 90 V 90" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.8" 
              strokeDasharray="1 3"
            />
            <path 
              d="M 30 0 V 100 M 60 0 V 100 M 0 30 H 100 M 0 70 H 100" 
              stroke="currentColor" 
              strokeWidth="0.2" 
              opacity="0.5"
            />
            <motion.path 
              d="M 10 10 H 90 V 20 H 20 V 40 H 80 V 60 H 10 V 80 H 90 V 90" 
              fill="none" 
              stroke="brand-red" 
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>
      );
    case 'startup':
      return (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <motion.g
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <circle cx="50" cy="50" r="1.5" fill="currentColor" />
              <circle cx="30" cy="30" r="1" fill="currentColor" />
              <circle cx="70" cy="30" r="1" fill="currentColor" />
              <circle cx="30" cy="70" r="1" fill="currentColor" />
              <circle cx="70" cy="70" r="1" fill="currentColor" />
              
              <line x1="50" y1="50" x2="30" y2="30" stroke="currentColor" strokeWidth="0.3" />
              <line x1="50" y1="50" x2="70" y2="30" stroke="currentColor" strokeWidth="0.3" />
              <line x1="50" y1="50" x2="30" y2="70" stroke="currentColor" strokeWidth="0.3" />
              <line x1="50" y1="50" x2="70" y2="70" stroke="currentColor" strokeWidth="0.3" />
              <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="0.3" />
              <line x1="30" y1="30" x2="30" y2="70" stroke="currentColor" strokeWidth="0.3" />
              
              <motion.circle 
                cx="50" cy="50" r="10" 
                stroke="currentColor" strokeWidth="0.1" fill="none"
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.g>
          </svg>
        </div>
      );
    case 'freelance':
      return (
        <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div 
              key={i} 
              className="absolute bg-brand-offwhite/20 border border-brand-offwhite/10"
              style={{ 
                width: `${Math.random() * 40 + 20}px`,
                height: `${Math.random() * 40 + 20}px`,
                top: `${Math.random() * 80 + 10}%`, 
                left: `${Math.random() * 80 + 10}%`,
              }}
              animate={{ 
                x: [0, (Math.random() - 0.5) * 40, 0],
                y: [0, (Math.random() - 0.5) * 40, 0],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{ 
                duration: 10 + Math.random() * 10, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          ))}
        </div>
      );
    case 'academic':
      return (
        <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-col gap-4 p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div 
              key={i} 
              className="w-full h-12 border border-brand-offwhite/10 bg-brand-offwhite/5 relative p-2 overflow-hidden"
              style={{ rotate: `${(Math.random() - 0.5) * 10}deg` }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 5 + i, repeat: Infinity }}
            >
              <div className="w-full h-[1px] bg-brand-offwhite/20 mb-1" />
              <div className="w-3/4 h-[1px] bg-brand-offwhite/20 mb-1" />
              <div className="w-full h-[1px] bg-brand-offwhite/20 mb-1" />
              <div className="absolute bottom-1 right-2 text-[6px] font-mono opacity-30">[Ref: {Math.random().toString(36).substring(7)}]</div>
            </motion.div>
          ))}
        </div>
      );
    case 'gig':
      return (
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.g key={i}>
                <line 
                  x1="-10" y1={20 * i + 10} x2="110" y2={20 * i + 10} 
                  stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 4" 
                />
                <motion.circle 
                  r="1" fill="currentColor"
                  animate={{ cx: ["-10%", "110%"] }}
                  transition={{ 
                    duration: 3 + Math.random() * 4, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: Math.random() * 5
                  }}
                  style={{ cy: `${20 * i + 10}%` }}
                />
              </motion.g>
            ))}
          </svg>
        </div>
      );
    default:
      return null;
  }
};

// Types
type Stats = {
  energy: number;
  money: number;
  sanity: number;
  ego: number;
  sleep: number;
};

type Path = {
  id: string;
  title: string;
  shortDescription: string;
};

type Choice = {
  text: string;
  statEffects: Partial<Stats>;
};

type Event = {
  id: string;
  pathId?: string;
  isGlitch?: boolean;
  description: string;
  choices: Choice[];
};

type Ending = {
  title: string;
  description: string;
};

type GameState = 'intro' | 'selection' | 'gameplay' | 'ending';

const INITIAL_STATS: Stats = {
  energy: 100,
  money: 100,
  sanity: 100,
  ego: 50,
  sleep: 100,
};

const STAT_CONFIG = [
  { key: 'energy', label: 'Energy' },
  { key: 'money', label: 'Money' },
  { key: 'sanity', label: 'Sanity' },
  { key: 'ego', label: 'Ego' },
  { key: 'sleep', label: 'Sleep' },
] as const;

const BurnoutVisual = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
      <motion.div
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.05, 0.12, 0.05],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex items-center justify-center"
      >
        {/* Concentric Geometric Shapes */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              rotate: i % 2 === 0 ? [0, 360] : [360, 0],
            }}
            transition={{
              duration: 60 + i * 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute border border-brand-offwhite/5"
            style={{
              width: `${(i + 1) * 120}px`,
              height: `${(i + 1) * 120}px`,
              borderRadius: i % 4 === 0 ? '50%' : '0%',
            }}
          />
        ))}
        
        {/* Large Structural Lines */}
        <div className="absolute w-[2000px] h-[1px] bg-brand-offwhite/5 rotate-45" />
        <div className="absolute w-[2000px] h-[1px] bg-brand-offwhite/5 -rotate-45" />
        <div className="absolute w-[2000px] h-[1px] bg-brand-offwhite/5" />
        <div className="absolute h-[2000px] w-[1px] bg-brand-offwhite/5" />
      </motion.div>
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [selectedPath, setSelectedPath] = useState<Path | null>(null);
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [randomMessage, setRandomMessage] = useState('');
  const [quarter, setQuarter] = useState(1);
  const [lastStatChange, setLastStatChange] = useState<Partial<Stats> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [hasGlitched, setHasGlitched] = useState(false);

  // Shuffle events for each playthrough, filtering by path
  const shuffledEvents = useMemo(() => {
    const events = (gameContent.events as Event[]).filter(e => !e.pathId || e.pathId === selectedPath?.id);
    const nonGlitchEvents = events.filter(e => !e.isGlitch);
    return [...nonGlitchEvents].sort(() => Math.random() - 0.5);
  }, [selectedPath]);

  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (gameState === 'gameplay' && !currentEvent) {
      setCurrentEvent(shuffledEvents[0]);
    }
  }, [gameState, shuffledEvents, currentEvent]);

  useEffect(() => {
    if (gameState === 'gameplay') {
      const interval = setInterval(() => {
        const msg = gameContent.randomMessages[Math.floor(Math.random() * gameContent.randomMessages.length)];
        setRandomMessage(msg);
        sounds.notification();
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const handleBegin = () => {
    sounds.click();
    setGameState('selection');
  };

  const handleSelectPath = (path: Path) => {
    sounds.click();
    setSelectedPath(path);
    setGameState('gameplay');
  };

  const handleChoice = (choice: Choice) => {
    sounds.click();
    setIsProcessing(true);
    setLastStatChange(choice.statEffects);
    setScreenShake(true);
    
    setTimeout(() => {
      setScreenShake(false);
      const newStats = { ...stats };
      Object.entries(choice.statEffects).forEach(([key, value]) => {
        newStats[key as keyof Stats] = Math.max(0, Math.min(200, newStats[key as keyof Stats] + (value || 0)));
      });
      setStats(newStats);
      setHistory([...history, choice.text]);

      // Check if we should trigger the glitch event
      // Trigger it around the middle of the game (turn 3-5)
      const shouldGlitch = !hasGlitched && currentEventIndex >= 2 && Math.random() > 0.5;

      if (shouldGlitch) {
        const glitchEvent = (gameContent.events as Event[]).find(e => e.isGlitch);
        if (glitchEvent) {
          sounds.glitch();
          setCurrentEvent(glitchEvent);
          setHasGlitched(true);
          setIsProcessing(false);
          setLastStatChange(null);
          return;
        }
      }

      if (currentEventIndex < shuffledEvents.length - 1 && quarter < 4) {
        const nextIndex = currentEventIndex + 1;
        setCurrentEventIndex(nextIndex);
        setCurrentEvent(shuffledEvents[nextIndex]);
        if (nextIndex % 3 === 0) {
          setQuarter(prev => Math.min(4, prev + 1));
        }
      } else {
        setGameState('ending');
      }
      setIsProcessing(false);
      setLastStatChange(null);
    }, 800);
  };

  const getEnding = () => {
    if (stats.sanity < 20) return gameContent.endings[0];
    if (stats.ego > 150) return gameContent.endings[1];
    if (stats.energy < 20) return gameContent.endings[2];
    if (stats.sleep < 20) return gameContent.endings[3];
    if (stats.money < 20) return gameContent.endings[4];
    return gameContent.endings[Math.floor(Math.random() * gameContent.endings.length)];
  };

  const resetGame = () => {
    sounds.click();
    setGameState('intro');
    setStats(INITIAL_STATS);
    setCurrentEventIndex(0);
    setCurrentEvent(null);
    setHistory([]);
    setSelectedPath(null);
    setQuarter(1);
    setHasGlitched(false);
  };

  const isGlitchActive = currentEvent?.isGlitch;

  // Sound effects for the ending sequence
  useEffect(() => {
    if (gameState === 'ending') {
      // Staggered notification sounds for stats
      STAT_CONFIG.forEach((_, idx) => {
        setTimeout(() => {
          sounds.notification();
        }, (3.5 + idx * 0.2) * 1000);
      });

      // Glitch sound for the final verdict
      setTimeout(() => {
        sounds.glitch();
      }, 5500);
    }
  }, [gameState]);

  return (
    <div className={`min-h-screen bg-brand-black text-brand-offwhite font-sans selection:bg-brand-red selection:text-white grid-bg relative overflow-hidden ${screenShake ? 'shake' : ''} ${isGlitchActive ? 'glitch-mode' : ''}`}>
      {/* System Overlays */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1 bg-brand-red/10 animate-pulse ${isGlitchActive ? 'bg-brand-red/50 h-2' : ''}`} />
        <div className="absolute bottom-0 right-0 p-4 font-mono text-[8px] opacity-20 uppercase tracking-widest">
          System_Status: {isGlitchActive ? 'CRITICAL_FAILURE' : 'Active'} // Subject: saisyah.z****@gmail.com // ID: {Math.random().toString(36).substring(7)}
        </div>
        {/* Subtle animated lines */}
        <motion.div 
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: isGlitchActive ? 0.5 : 10, repeat: Infinity, ease: "linear" }}
          className={`absolute left-10 top-0 w-[1px] h-20 bg-brand-offwhite/5 ${isGlitchActive ? 'bg-brand-red/40 w-[2px]' : ''}`}
        />
        <motion.div 
          animate={{ y: ['100%', '0%'] }}
          transition={{ duration: isGlitchActive ? 0.8 : 15, repeat: Infinity, ease: "linear" }}
          className={`absolute right-20 top-0 w-[1px] h-40 bg-brand-offwhite/5 ${isGlitchActive ? 'bg-brand-red/40 w-[2px]' : ''}`}
        />
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row items-center justify-center min-h-screen p-6 md:p-20 gap-12 relative"
          >
            {/* Background Illustration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="w-full h-full max-w-4xl">
                <HeroIllustration />
              </div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl relative z-10 text-center lg:text-left"
            >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="inline-block px-4 py-1 border border-brand-red/30 text-brand-red text-[10px] font-mono uppercase tracking-[0.5em] mb-4"
              >
                A Monument to Ambition
              </motion.div>
              <h1 className="text-7xl md:text-[10rem] font-display font-black leading-[0.8] text-glow glitch-text" data-text="CHOOSE YOUR BURNOUT">
                CHOOSE YOUR <br />
                <span className="text-brand-red red-glow">BURNOUT</span>
              </h1>
              <p className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-brand-offwhite/40 mb-12 mt-8 max-w-xl">
                Premium Life Simulation // v4.02 // [DECAY_MODE_ENABLED]
              </p>
              <button
                onClick={handleBegin}
                className="btn-primary"
              >
                Initialize Collapse
              </button>
            </motion.div>
          </motion.div>
        )}

        {gameState === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-6 py-20"
          >
            <div className="mb-16 text-center">
              <h2 className="text-5xl md:text-7xl font-display font-black mb-2">Select Your Descent</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-brand-offwhite/40">Choose the architecture of your eventual collapse</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {gameContent.paths.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleSelectPath(p)}
                  className="glass-panel p-6 cursor-pointer group hover:border-brand-red/50 transition-all duration-500 flex flex-col h-full relative"
                >
                  <PathVisual pathId={p.id} />
                  <div className="relative z-10">
                    <div className="font-mono text-[8px] text-brand-offwhite/30 mb-4 uppercase tracking-tighter">Path_0{idx + 1}</div>
                    <h3 className="text-xl font-display font-bold mb-3 group-hover:text-brand-red transition-colors">{p.title}</h3>
                    <p className="text-xs text-brand-offwhite/50 leading-relaxed font-sans">{p.shortDescription}</p>
                  </div>
                  <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-brand-red">Select Path →</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'gameplay' && currentEvent && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col relative overflow-hidden"
          >
            {/* Background Grid */}
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

            {/* Top Stats Bar - Minimal */}
            <div className="relative z-20 p-4 md:p-8 flex justify-between items-center bg-gradient-to-b from-brand-black to-transparent">
              <div className="flex gap-6 items-center">
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-brand-offwhite/40 uppercase tracking-widest">Integrity</span>
                  <div className="h-1 w-24 bg-brand-offwhite/10 mt-1 overflow-hidden">
                    <motion.div 
                      className={`h-full ${stats.sanity < 20 || isGlitchActive ? 'bg-brand-red' : 'bg-brand-offwhite'}`}
                      animate={isGlitchActive ? { 
                        width: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
                        opacity: [1, 0.3, 1]
                      } : { 
                        width: `${(stats.sanity / 200) * 100}%` 
                      }}
                      transition={isGlitchActive ? { repeat: Infinity, duration: 0.1 } : {}}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-brand-offwhite/40 uppercase tracking-widest">Reserve</span>
                  <div className="h-1 w-24 bg-brand-offwhite/10 mt-1 overflow-hidden">
                    <motion.div 
                      className={`h-full ${stats.energy < 20 || isGlitchActive ? 'bg-brand-red' : 'bg-brand-offwhite'}`}
                      animate={isGlitchActive ? { 
                        width: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
                        opacity: [1, 0.3, 1]
                      } : { 
                        width: `${(stats.energy / 200) * 100}%` 
                      }}
                      transition={isGlitchActive ? { repeat: Infinity, duration: 0.1 } : {}}
                    />
                  </div>
                </div>
              </div>
              <div className="font-mono text-xs text-brand-offwhite/60 tracking-widest">
                CYCLE_{currentEventIndex + 1}
              </div>
            </div>

            {/* Main Content: Face First */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
              {/* Large Centered Face */}
              <div className="w-full max-w-md aspect-square mb-8 md:mb-12 flex items-center justify-center">
                <div className="w-full h-full transform scale-110 md:scale-125">
                  <BurnoutFace stats={stats} isProcessing={isProcessing} forceGlitch={isGlitchActive} />
                </div>
              </div>

              {/* Text & Choices Below Face */}
              <div className="w-full max-w-xl text-center space-y-8">
                <motion.div
                  key={currentEventIndex}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-2"
                >
                  <div className={`font-mono text-[10px] text-brand-red uppercase tracking-[0.5em] opacity-60 ${isGlitchActive ? 'animate-pulse' : ''}`}>
                    {isGlitchActive ? 'CRITICAL_SYSTEM_FAILURE' : 'Transmission_Received'}
                  </div>
                  <h3 className={`text-2xl md:text-4xl font-display font-bold leading-tight ${isGlitchActive ? 'text-brand-red glitch-text-hard' : ''}`}>
                    {currentEvent.description}
                  </h3>
                </motion.div>

                <div className="grid grid-cols-1 gap-3 w-full">
                  {currentEvent.choices.map((choice, idx) => (
                    <motion.button
                      key={idx}
                      disabled={isProcessing}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      onClick={() => handleChoice(choice)}
                      className={`btn-choice group ${isGlitchActive ? 'border-brand-red text-brand-red hover:bg-brand-red hover:text-white' : ''}`}
                    >
                      <span className="relative z-10 font-display font-bold text-lg md:text-xl">{choice.text}</span>
                      <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all relative z-10" />
                      <div className={`absolute inset-0 bg-brand-red transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`} />
                    </motion.button>
                  ))}
                </div>

                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-[8px] text-brand-red uppercase tracking-[0.6em] animate-pulse"
                  >
                    Recalculating_Existence...
                  </motion.div>
                )}
              </div>
            </div>

            {/* Bottom Status Log */}
            <div className="p-6 relative z-20">
              <AnimatePresence mode="wait">
                {randomMessage && !isProcessing && (
                  <motion.div
                    key={randomMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="font-mono text-[9px] text-brand-offwhite/20 uppercase tracking-widest text-center"
                  >
                    [LOG]: {randomMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {gameState === 'ending' && (
          <motion.div
            key="ending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-brand-black"
          >
            {/* Final Portrait Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,0,0,0.15)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
              {/* Large Final Face - 3D Static Tilt with Glitch */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, rotateX: 0, rotateY: 0 }}
                animate={{ scale: 1, opacity: 1, rotateX: 5, rotateY: -5 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="w-64 h-64 md:w-96 md:h-96 mb-16 relative preserve-3d"
              >
                <div className="absolute inset-0 animate-pulse opacity-20 blur-3xl bg-brand-red rounded-full" />
                <BurnoutFace stats={stats} isFinal={true} />
                
                {/* Scanner Line Effect */}
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-[-10%] right-[-10%] h-[1px] bg-brand-red/30 z-20 blur-[1px]"
                />
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.8,
                      delayChildren: 1
                    }
                  }
                }}
                className="space-y-8"
              >
                {/* Line 1: Status */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="font-mono text-[10px] uppercase tracking-[0.6em] text-brand-red"
                >
                  [ DECOMMISSIONING_REPORT_FINALIZED ]
                </motion.div>

                {/* Line 2: Title */}
                <motion.h2
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="text-6xl md:text-9xl font-display font-black tracking-tighter text-glow uppercase leading-none"
                >
                  {getEnding()?.title}
                </motion.h2>
                
                {/* Line 3: Description */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                  }}
                  className="text-sm md:text-xl font-serif italic text-brand-offwhite/70 max-w-2xl mx-auto leading-relaxed"
                >
                  "{getEnding()?.description}"
                </motion.p>

                {/* Line 4: Stats Staggered */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                  }}
                  className="flex flex-wrap justify-center gap-6 md:gap-12 py-10 border-y border-brand-offwhite/10"
                >
                  {STAT_CONFIG.map(({ key, label }, idx) => (
                    <motion.div 
                      key={key}
                      variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: { opacity: 1, scale: 1 }
                      }}
                      transition={{ delay: 3.5 + (idx * 0.2) }}
                      className="text-center"
                    >
                      <div className="text-[9px] font-mono text-brand-offwhite/30 uppercase tracking-widest mb-2">{label}</div>
                      <div className="text-2xl md:text-4xl font-display font-bold text-brand-offwhite">
                        {stats[key as keyof Stats].toFixed(0)}%
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Line 5: The Final Verdict */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 1.1 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  transition={{ delay: 5.5, duration: 1.5 }}
                  className="pt-4"
                >
                  <div className="text-2xl md:text-4xl font-display font-black uppercase tracking-[0.3em] text-brand-offwhite/90 glitch-text" data-text="YOU DID EVERYTHING RIGHT.">
                    You did everything right.
                  </div>
                </motion.div>

                {/* Line 6: Actions */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                  }}
                  transition={{ delay: 7 }}
                  className="pt-12 flex flex-col items-center gap-6"
                >
                  <button
                    onClick={resetGame}
                    className="btn-primary group"
                  >
                    <span className="relative z-10">Restart Simulation</span>
                    <div className="absolute inset-0 bg-brand-red transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                  
                  <div className="flex flex-col gap-1 opacity-30">
                    <div className="font-mono text-[8px] uppercase tracking-widest">
                      Subject: saisyah.z****@gmail.com // Cycle: {currentEventIndex + 1}
                    </div>
                    <div className="font-mono text-[8px] uppercase tracking-widest">
                      Timestamp: {new Date().toISOString()} // Archive_ID: {Math.floor(Math.random() * 1000000)}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
