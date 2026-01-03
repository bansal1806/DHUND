import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle, Search, User, MapPin, Camera, Scan, Shield, Activity, Fingerprint, Eye, Terminal } from 'lucide-react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import SimpleFaceModel from './SimpleFaceModel';
import BiometricOverlay from './BiometricOverlay';
import { apiUrl } from '../config/api';

const Demo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [faceScanActive, setFaceScanActive] = useState(false);
  const [cctvScanActive, setCctvScanActive] = useState(false);

  const containerRef = useRef(null);
  const consoleRef = useRef(null);

  const [logs, setLogs] = useState([
    "DHUND_OS v4.2 INITIALIZING...",
    "ESTABLISHING SECURE LINK TO NATIONAL GRID...",
    "FEDERATED NODES ONLINE: 15,842",
    "PRIVACY_PROTOCOL_ENFORCED: TRUE"
  ]);

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-5), `> ${msg}`]);
  };

  const demoSteps = [
    {
      title: "REPORT_INGESTION",
      description: "Biometric signature upload for Priya Sharma",
      icon: User,
      color: "cyan",
      details: "Priority Alpha-1. Mumbai Sector 7. Capturing neural hash."
    },
    {
      title: "AGE_PROGRESSION_ENGINE",
      description: "Generative appearance modeling (Street Delta)",
      icon: Activity,
      color: "purple",
      details: "Analyzing 50+ growth variables. Environmental stress factored."
    },
    {
      title: "SPATIO_TEMPORAL_TARGETING",
      description: "Narrowing search nodes via LBS data",
      icon: MapPin,
      color: "amber",
      details: "600km² -> 15 targeted transport hubs identified."
    },
    {
      title: "MULTI_MODAL_SURVEILLANCE",
      description: "Privacy-preserving scan across CCTV grid",
      icon: Camera,
      color: "cyan",
      details: "Face + Gait + Posture analysis at node level."
    },
    {
      title: "VERIFIED_IDENTIFICATION",
      description: "Match confirmed at Dadar Railway Station",
      icon: CheckCircle,
      color: "emerald",
      details: "94.5% Confidence. Rescue protocols initiated."
    }
  ];

  const runDemo = async () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setScanningProgress(0);
    addLog("SEARCH_PROTOCOL_INITIATED");

    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      addLog(`PROCESSING: ${demoSteps[i].title}`);

      if (i === 1) {
        setFaceScanActive(true);
        for (let progress = 0; progress <= 100; progress += 5) {
          setScanningProgress(progress);
          if (progress % 20 === 0) addLog(`ENCODING_GEOMETRY: ${progress}%`);
          await new Promise(resolve => setTimeout(resolve, 80));
        }
        setFaceScanActive(false);
      }

      if (i === 3) {
        setCctvScanActive(true);
        setScanningProgress(0);
        for (let progress = 0; progress <= 100; progress += 10) {
          setScanningProgress(progress);
          addLog(`GRID_SCAN_PROGRESS: ${progress}%`);
          await new Promise(resolve => setTimeout(resolve, 150));
        }
        setCctvScanActive(false);
      }

      if (i === 4) {
        addLog("CRITICAL_MATCH_DETECTED");
        gsap.to(containerRef.current, {
          backgroundColor: "rgba(16, 185, 129, 0.05)",
          duration: 0.5,
          yoyo: true,
          repeat: 3
        });
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    setIsPlaying(false);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setScanningProgress(0);
    setFaceScanActive(false);
    setCctvScanActive(false);
    setLogs(["SYSTEM_RESET", "READY_FOR_PROTOCOL_Z1"]);
  };

  const FuiCorner = () => (
    <>
      <div className="fui-corner fui-corner-tl" />
      <div className="fui-corner fui-corner-tr" />
      <div className="fui-corner fui-corner-bl" />
      <div className="fui-corner fui-corner-br" />
    </>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-mono selection:bg-cyan-500/30">
      {/* Cinematic Overlays */}
      <div className="hud-overlay" />
      <div className="scanline" />
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />

      {/* Header HUD */}
      <div className="relative z-10 border-b border-cyan-500/20 bg-black/40 backdrop-blur-md p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-cyan-500 flex items-center justify-center animate-pulse">
              <Terminal size={20} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter hologram-text">DHUND//COMMAND_CENTER</h1>
              <div className="flex gap-4 text-[10px] text-cyan-500/60 font-mono">
                <span>LOCAL_TIME: {new Date().toLocaleTimeString()}</span>
                <span className="animate-pulse">LATENCY: 12ms</span>
                <span>ENCRYPTION: AES-256</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            {!isPlaying ? (
              <button onClick={runDemo} className="modern-card py-2 px-8 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-2 group">
                <Play size={16} className="group-hover:scale-110 transition-transform" /> START_PROTOCOL
              </button>
            ) : (
              <div className="modern-card py-2 px-8 border-rose-500/40 text-rose-400 animate-pulse flex items-center gap-2">
                <Activity size={16} /> PROTOCOL_ACTIVE
              </div>
            )}
            <button onClick={resetDemo} className="modern-card py-2 px-6 border-slate-700 text-slate-400 hover:text-white flex items-center gap-2">
              <RotateCcw size={16} /> RESET
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 grid grid-cols-12 gap-8">
        {/* Left Column: Sequence of Events */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {demoSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index && isPlaying;
            const isCompleted = currentStep > index;

            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className={`modern-card p-4 group ${isActive ? 'border-cyan-500/60 bg-cyan-500/5 shadow-[0_0_20px_rgba(14,165,233,0.15)]' : isCompleted ? 'opacity-40 grayscale' : 'opacity-20'}`}
              >
                <FuiCorner />
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center border ${isActive ? 'border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'border-slate-700 text-slate-500'}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-bold text-xs tracking-widest ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>{step.title}</h3>
                      {isActive && <span className="text-[10px] animate-pulse text-cyan-400">LOADING...</span>}
                    </div>
                    <p className="text-[10px] text-slate-500 mb-2 leading-tight">{step.description}</p>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-cyan-500/10 p-2 border-l border-cyan-500 text-[9px] text-cyan-300 font-mono"
                      >
                        {step.details}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* System Logs */}
          <div className="modern-card mt-8 p-4 bg-black/60 min-h-[150px]">
            <FuiCorner />
            <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
              <Terminal size={12} className="text-cyan-500" />
              <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">SYSTEM_LOGS</span>
            </div>
            <div className="space-y-1 font-mono">
              {logs.map((log, i) => (
                <div key={i} className="text-[9px] text-cyan-500/70 whitespace-nowrap overflow-hidden animate-typing">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visualization HUD */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="modern-card flex-1 bg-slate-950/20 border-cyan-500/10 min-h-[500px] relative flex flex-col items-center justify-center">
            <FuiCorner />

            {/* HUD Grid Overlay */}
            <div className="absolute inset-4 cyber-grid opacity-10 pointer-events-none" />

            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="text-center"
                >
                  <div className="relative inline-block mb-8">
                    <div className="absolute -inset-4 border border-rose-500/30 animate-spin-slow" />
                    <div className="absolute -inset-2 border border-rose-500/50" />
                    <img
                      src="https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&q=80&w=800"
                      alt="Target"
                      className="w-48 h-48 object-cover grayscale brightness-75 border-2 border-rose-500"
                    />
                    <div className="absolute inset-0 bg-rose-500/20 mix-blend-overlay" />
                    <div className="absolute top-0 right-0 bg-rose-500 text-[10px] font-bold px-2 py-1">TARGET_B1</div>
                  </div>
                  <h3 className="text-3xl font-black hologram-text text-rose-500">PRIYA SHARMA</h3>
                  <div className="mt-4 flex justify-center gap-8 text-[10px] text-slate-500">
                    <div>AGE: 08</div>
                    <div>LOCALITY: MUMBAI_S7</div>
                    <div>CLASS: PRIORITY_A1</div>
                  </div>
                </motion.div>
              )}

              {(faceScanActive || currentStep === 1) && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-center pt-8"
                >
                  <div className="w-full h-[400px] relative">
                    <SimpleFaceModel scanningProgress={scanningProgress} isScanning={faceScanActive} size="large" />
                  </div>
                </motion.div>
              )}

              {cctvScanActive && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full grid grid-cols-2 gap-4 p-8"
                >
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="relative aspect-video bg-black border border-cyan-500/30 overflow-hidden">
                      <div className="absolute inset-0 cyber-grid opacity-20" />
                      <div className="absolute top-2 left-2 text-[8px] bg-cyan-500/20 px-1 border border-cyan-500/40">CAM_NODE_DDR_0{i}</div>
                      <BiometricOverlay landmarks={[[0.4, 0.3], [0.42, 0.45], [0.4, 0.6]]} type="gait" />
                      {scanningProgress < 100 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1/2 h-1 bg-cyan-950">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${scanningProgress}%` }}
                              className="h-full bg-cyan-400 shadow-[0_0_10px_var(--glow-cyan)]"
                            />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 text-[8px] animate-pulse text-cyan-400">ANALYZING_GAIT...</div>
                    </div>
                  ))}
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center p-12"
                >
                  <div className="w-24 h-24 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <CheckCircle size={48} className="text-emerald-400 animate-bounce" />
                  </div>
                  <h3 className="text-5xl font-black text-emerald-400 hologram-text mb-4">MATCH_FOUND</h3>
                  <div className="space-y-4">
                    <div className="text-2xl text-white font-bold tracking-widest">DADAR_STATION_LVL2</div>
                    <div className="grid grid-cols-3 gap-4 mt-8">
                      <div className="bg-emerald-500/10 border border-emerald-500/30 p-4">
                        <div className="text-[10px] text-emerald-500/70 mb-1">CONFIDENCE</div>
                        <div className="text-2xl font-black text-white">94.5%</div>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/30 p-4">
                        <div className="text-[10px] text-emerald-500/70 mb-1">LATENCY</div>
                        <div className="text-2xl font-black text-white">45s</div>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/30 p-4">
                        <div className="text-[10px] text-emerald-500/70 mb-1">NODES</div>
                        <div className="text-2xl font-black text-white">15.8k</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Panel Statistics */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "AI_ACCURACY", val: "96.4%", color: "cyan" },
              { label: "SEARCH_SPEED", val: "40.2x", color: "purple" },
              { label: "RECOVERY_RATE", val: "+214%", color: "emerald" }
            ].map((stat, i) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={i}
                className={`modern-card p-4 border-${stat.color}-500/20`}
              >
                <FuiCorner />
                <div className="text-[10px] text-slate-500 font-bold mb-1 tracking-widest">{stat.label}</div>
                <div className={`text-2xl font-black text-${stat.color}-400 hologram-text`}>{stat.val}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
