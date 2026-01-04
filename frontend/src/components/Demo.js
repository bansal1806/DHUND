import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle, Search, User, MapPin, Camera, Scan, Shield, Activity, Fingerprint, Eye, Terminal, Zap, Globe, TrendingUp, AlertTriangle, Radio, Satellite } from 'lucide-react';
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
  const [networkActivity, setNetworkActivity] = useState([]);
  const [realTimeStats, setRealTimeStats] = useState({
    nodesScanned: 0,
    matchesFound: 0,
    confidence: 0,
    latency: 12
  });

  const containerRef = useRef(null);
  const consoleRef = useRef(null);
  const statsRef = useRef(null);

  const [logs, setLogs] = useState([
    "DHUND_OS v4.2 INITIALIZING...",
    "ESTABLISHING SECURE LINK TO NATIONAL GRID...",
    "FEDERATED NODES ONLINE: 15,842",
    "PRIVACY_PROTOCOL_ENFORCED: TRUE"
  ]);

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const demoSteps = [
    {
      title: "REPORT_INGESTION",
      description: "Biometric signature upload for Priya Sharma",
      icon: User,
      color: "cyan",
      details: "Priority Alpha-1. Mumbai Sector 7. Capturing neural hash.",
      duration: 3000,
      metrics: { nodes: 0, confidence: 0 }
    },
    {
      title: "AGE_PROGRESSION_ENGINE",
      description: "Generative appearance modeling (Street Delta)",
      icon: Activity,
      color: "purple",
      details: "Analyzing 50+ growth variables. Environmental stress factored.",
      duration: 4000,
      metrics: { nodes: 0, confidence: 45 }
    },
    {
      title: "SPATIO_TEMPORAL_TARGETING",
      description: "Narrowing search nodes via LBS data",
      icon: MapPin,
      color: "amber",
      details: "600km² -> 15 targeted transport hubs identified.",
      duration: 2500,
      metrics: { nodes: 15, confidence: 67 }
    },
    {
      title: "MULTI_MODAL_SURVEILLANCE",
      description: "Privacy-preserving scan across CCTV grid",
      icon: Camera,
      color: "cyan",
      details: "Face + Gait + Posture analysis at node level.",
      duration: 5000,
      metrics: { nodes: 15842, confidence: 82 }
    },
    {
      title: "VERIFIED_IDENTIFICATION",
      description: "Match confirmed at Dadar Railway Station",
      icon: CheckCircle,
      color: "emerald",
      details: "94.5% Confidence. Rescue protocols initiated.",
      duration: 2000,
      metrics: { nodes: 15842, confidence: 94.5 }
    }
  ];

  const runDemo = async () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setScanningProgress(0);
    setNetworkActivity([]);
    addLog("SEARCH_PROTOCOL_INITIATED");
    addLog("AUTHENTICATING_USER_CREDENTIALS...");

    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      addLog(`PROCESSING: ${demoSteps[i].title}`);
      
      const step = demoSteps[i];
      
      // Update real-time stats
      gsap.to(realTimeStats, {
        nodesScanned: step.metrics.nodes,
        confidence: step.metrics.confidence,
        duration: 1,
        ease: "power2.out"
      });

      if (i === 0) {
        // Report ingestion animation
        for (let progress = 0; progress <= 100; progress += 2) {
          setScanningProgress(progress);
          if (progress % 25 === 0) addLog(`UPLOAD_PROGRESS: ${progress}%`);
          await new Promise(resolve => setTimeout(resolve, 30));
        }
        addLog("BIOMETRIC_SIGNATURE_CAPTURED");
      }

      if (i === 1) {
        setFaceScanActive(true);
        for (let progress = 0; progress <= 100; progress += 3) {
          setScanningProgress(progress);
          if (progress % 20 === 0) {
            addLog(`ENCODING_GEOMETRY: ${progress}%`);
            setRealTimeStats(prev => ({ ...prev, confidence: progress * 0.45 }));
          }
          await new Promise(resolve => setTimeout(resolve, 60));
        }
        setFaceScanActive(false);
        addLog("FACE_MODEL_GENERATED");
      }

      if (i === 2) {
        // Spatial targeting with map nodes
        addLog("ANALYZING_LOCATION_DATA...");
        for (let node = 0; node <= 15; node++) {
          setRealTimeStats(prev => ({ ...prev, nodesScanned: node }));
          setNetworkActivity(prev => [...prev, {
            id: node,
            location: ['Mumbai Central', 'Dadar', 'Bandra', 'Churchgate'][node % 4],
            status: 'analyzing'
          }]);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        addLog("SPATIAL_TARGETING_COMPLETE");
      }

      if (i === 3) {
        setCctvScanActive(true);
        setScanningProgress(0);
        addLog("INITIATING_GRID_SCAN...");
        
        for (let progress = 0; progress <= 100; progress += 2) {
          setScanningProgress(progress);
          const nodesScanned = Math.floor((progress / 100) * 15842);
          setRealTimeStats(prev => ({ ...prev, nodesScanned }));
          
          if (progress % 10 === 0) {
            addLog(`GRID_SCAN_PROGRESS: ${progress}% | NODES: ${nodesScanned.toLocaleString()}`);
            
            // Simulate matches
            if (Math.random() > 0.7) {
              setNetworkActivity(prev => [...prev, {
                id: Date.now(),
                location: ['Dadar Station', 'Bandra Terminal', 'Churchgate'][Math.floor(Math.random() * 3)],
                status: 'potential_match',
                confidence: Math.floor(Math.random() * 20) + 75
              }]);
            }
          }
          await new Promise(resolve => setTimeout(resolve, 80));
        }
        setCctvScanActive(false);
        addLog("GRID_SCAN_COMPLETE");
      }

      if (i === 4) {
        addLog("CRITICAL_MATCH_DETECTED");
        addLog("LOCATION: DADAR_STATION_LVL2");
        addLog("CONFIDENCE: 94.5%");
        addLog("RESCUE_PROTOCOL_INITIATED");
        
        setRealTimeStats(prev => ({ ...prev, matchesFound: 1, confidence: 94.5 }));
        
        // Success animation
        gsap.to(containerRef.current, {
          backgroundColor: "rgba(16, 185, 129, 0.05)",
          duration: 0.5,
          yoyo: true,
          repeat: 3
        });
      }

      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
    
    addLog("PROTOCOL_COMPLETE");
    addLog("STATUS: SUCCESS");
    setIsPlaying(false);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setScanningProgress(0);
    setFaceScanActive(false);
    setCctvScanActive(false);
    setNetworkActivity([]);
    setRealTimeStats({ nodesScanned: 0, matchesFound: 0, confidence: 0, latency: 12 });
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

  useEffect(() => {
    // Real-time latency simulation
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        ...prev,
        latency: Math.floor(Math.random() * 5) + 10
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-mono selection:bg-cyan-500/30">
      {/* Cinematic Overlays */}
      <div className="hud-overlay" />
      <div className="scanline" />
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />

      {/* Header HUD */}
      <div className="relative z-50 border-b border-cyan-500/20 bg-black/60 backdrop-blur-md p-6 sticky top-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-cyan-500 flex items-center justify-center animate-pulse relative">
              <Terminal size={24} className="text-cyan-400" />
              <div className="absolute inset-0 border border-cyan-500/50 animate-ping" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter hologram-text">DHUND//COMMAND_CENTER</h1>
              <div className="flex flex-wrap gap-3 sm:gap-4 text-[9px] sm:text-[10px] text-cyan-500/60 font-mono mt-1">
                <span>LOCAL_TIME: {new Date().toLocaleTimeString()}</span>
                <span className="animate-pulse">LATENCY: {realTimeStats.latency}ms</span>
                <span>ENCRYPTION: AES-256</span>
                <span className="text-emerald-400">STATUS: ONLINE</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {!isPlaying ? (
              <button onClick={runDemo} className="modern-card py-3 px-6 sm:px-8 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-2 group transition-all">
                <Play size={18} className="group-hover:scale-110 transition-transform" /> 
                <span className="text-sm sm:text-base">START_PROTOCOL</span>
              </button>
            ) : (
              <div className="modern-card py-3 px-6 sm:px-8 border-rose-500/40 text-rose-400 animate-pulse flex items-center gap-2">
                <Activity size={18} className="animate-spin" /> 
                <span className="text-sm sm:text-base">PROTOCOL_ACTIVE</span>
              </div>
            )}
            <button onClick={resetDemo} className="modern-card py-3 px-4 sm:px-6 border-slate-700 text-slate-400 hover:text-white flex items-center gap-2 transition-all">
              <RotateCcw size={18} /> 
              <span className="text-sm sm:text-base hidden sm:inline">RESET</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-8 sm:pt-12 relative z-10">
        {/* Real-time Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: "NODES_SCANNED", value: realTimeStats.nodesScanned.toLocaleString(), icon: Satellite, color: "cyan" },
            { label: "MATCHES", value: realTimeStats.matchesFound, icon: CheckCircle, color: "emerald" },
            { label: "CONFIDENCE", value: `${realTimeStats.confidence.toFixed(1)}%`, icon: TrendingUp, color: "purple" },
            { label: "LATENCY", value: `${realTimeStats.latency}ms`, icon: Zap, color: "amber" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="modern-card p-4 border-slate-800/50"
            >
              <FuiCorner />
              <div className="flex items-center gap-3 mb-2">
                <stat.icon size={18} className={`text-${stat.color}-400`} />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className={`text-2xl sm:text-3xl font-black text-${stat.color}-400 hologram-text`}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
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
                  className={`modern-card p-4 group relative overflow-hidden ${
                    isActive 
                      ? 'border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_30px_rgba(14,165,233,0.3)] scale-105' 
                      : isCompleted 
                      ? 'opacity-50 grayscale border-emerald-500/30' 
                      : 'opacity-30 border-slate-800'
                  }`}
                >
                  <FuiCorner />
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  <div className="flex items-start gap-4 relative z-10">
                    <div className={`w-12 h-12 flex items-center justify-center border-2 ${
                      isActive 
                        ? 'border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(14,165,233,0.6)] animate-pulse' 
                        : isCompleted
                        ? 'border-emerald-400 text-emerald-400'
                        : 'border-slate-700 text-slate-500'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`font-bold text-xs sm:text-sm tracking-widest ${isActive ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {step.title}
                        </h3>
                        {isActive && <span className="text-[9px] animate-pulse text-cyan-400">ACTIVE</span>}
                        {isCompleted && <CheckCircle size={14} className="text-emerald-400" />}
                      </div>
                      <p className="text-[10px] text-slate-500 mb-2 leading-tight">{step.description}</p>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="bg-cyan-500/10 p-2 border-l-2 border-cyan-500 text-[9px] text-cyan-300 font-mono mt-2"
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
            <div className="modern-card mt-6 p-4 bg-black/60 min-h-[200px] max-h-[300px] overflow-hidden">
              <FuiCorner />
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-cyan-500" />
                  <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">SYSTEM_LOGS</span>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="space-y-1 font-mono overflow-y-auto h-[150px] pr-2">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[9px] text-cyan-500/70 whitespace-nowrap"
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visualization HUD */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="modern-card flex-1 bg-slate-950/40 border-cyan-500/20 min-h-[600px] relative flex flex-col items-center justify-center overflow-hidden">
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
                    className="text-center p-8"
                  >
                    <div className="relative inline-block mb-8">
                      <div className="absolute -inset-6 border-2 border-rose-500/30 animate-spin-slow rounded-full" />
                      <div className="absolute -inset-3 border border-rose-500/50 rounded-full" />
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&q=80&w=800"
                          alt="Target"
                          className="w-48 h-48 sm:w-64 sm:h-64 object-cover grayscale brightness-75 border-2 border-rose-500 rounded-lg"
                        />
                        <div className="absolute inset-0 bg-rose-500/20 mix-blend-overlay rounded-lg" />
                        <div className="absolute top-2 right-2 bg-rose-500 text-[10px] font-bold px-2 py-1 rounded">TARGET_B1</div>
                        {scanningProgress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
                            <div className="h-1 bg-rose-950">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${scanningProgress}%` }}
                                className="h-full bg-rose-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black hologram-text text-rose-500 mb-2">PRIYA SHARMA</h3>
                    <div className="mt-4 flex flex-wrap justify-center gap-6 text-[10px] sm:text-sm text-slate-500">
                      <div>AGE: <span className="text-white">08</span></div>
                      <div>LOCALITY: <span className="text-white">MUMBAI_S7</span></div>
                      <div>CLASS: <span className="text-rose-400">PRIORITY_A1</span></div>
                    </div>
                  </motion.div>
                )}

                {(faceScanActive || currentStep === 1) && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8"
                  >
                    <div className="w-full max-w-2xl h-[400px] sm:h-[500px] relative">
                      <SimpleFaceModel scanningProgress={scanningProgress} isScanning={faceScanActive} size="large" />
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <div className="inline-block bg-black/80 px-4 py-2 rounded border border-cyan-500/30">
                          <div className="text-[10px] text-cyan-400 font-mono">PROGRESS: {scanningProgress}%</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && !cctvScanActive && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-full p-6 sm:p-8"
                  >
                    <div className="text-center mb-6">
                      <MapPin className="mx-auto text-amber-400 mb-4" size={48} />
                      <h3 className="text-2xl sm:text-3xl font-black text-amber-400 mb-2">SPATIAL_TARGETING</h3>
                      <p className="text-slate-400 text-sm">15 Transport Hubs Identified</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {networkActivity.slice(0, 15).map((node, i) => (
                        <motion.div
                          key={node.id || i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-amber-500/10 border border-amber-500/30 p-3 rounded"
                        >
                          <div className="text-[10px] text-amber-400 font-bold">{node.location}</div>
                          <div className="text-[8px] text-slate-500 mt-1">NODE_{node.id}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {cctvScanActive && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full grid grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-8"
                  >
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="relative aspect-video bg-black border-2 border-cyan-500/30 overflow-hidden rounded">
                        <div className="absolute inset-0 cyber-grid opacity-20" />
                        <div className="absolute top-2 left-2 text-[8px] bg-cyan-500/20 px-2 py-1 border border-cyan-500/40 rounded font-mono">
                          CAM_NODE_DDR_0{i}
                        </div>
                        <BiometricOverlay landmarks={[[0.4, 0.3], [0.42, 0.45], [0.4, 0.6]]} type="gait" />
                        {scanningProgress < 100 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="w-2/3 h-1 bg-cyan-950 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${scanningProgress}%` }}
                                className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                              />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 text-[8px] animate-pulse text-cyan-400 font-mono">
                          ANALYZING...
                        </div>
                      </div>
                    ))}
                    {networkActivity.filter(a => a.status === 'potential_match').length > 0 && (
                      <div className="col-span-2 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="text-emerald-400" size={16} />
                          <span className="text-emerald-400 font-bold text-sm">POTENTIAL_MATCHES_DETECTED</span>
                        </div>
                        <div className="space-y-1">
                          {networkActivity.filter(a => a.status === 'potential_match').map((match, i) => (
                            <div key={i} className="text-[10px] text-slate-300">
                              {match.location} - {match.confidence}% confidence
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 4 && !cctvScanActive && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 sm:p-12"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-emerald-500 flex items-center justify-center mx-auto mb-6 sm:mb-8 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.6)]"
                    >
                      <CheckCircle size={64} className="text-emerald-400" />
                    </motion.div>
                    <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-400 hologram-text mb-4">
                      MATCH_FOUND
                    </h3>
                    <div className="space-y-4 mb-8">
                      <div className="text-xl sm:text-2xl text-white font-bold tracking-widest">DADAR_STATION_LVL2</div>
                      <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 max-w-2xl mx-auto">
                        {[
                          { label: "CONFIDENCE", value: "94.5%", color: "emerald" },
                          { label: "LATENCY", value: "45s", color: "cyan" },
                          { label: "NODES", value: "15.8k", color: "purple" }
                        ].map((stat, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className={`bg-${stat.color}-500/10 border border-${stat.color}-500/30 p-4 rounded`}
                          >
                            <div className={`text-[10px] text-${stat.color}-500/70 mb-1 font-bold`}>{stat.label}</div>
                            <div className={`text-2xl sm:text-3xl font-black text-${stat.color}-400`}>{stat.value}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Panel Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { label: "AI_ACCURACY", val: "96.4%", color: "cyan", icon: TrendingUp },
                { label: "SEARCH_SPEED", val: "40.2x", color: "purple", icon: Zap },
                { label: "RECOVERY_RATE", val: "+214%", color: "emerald", icon: CheckCircle }
              ].map((stat, i) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  key={i}
                  className={`modern-card p-4 sm:p-6 border-${stat.color}-500/20 relative overflow-hidden`}
                >
                  <FuiCorner />
                  <div className="flex items-center gap-3 mb-2">
                    <stat.icon className={`text-${stat.color}-400`} size={20} />
                    <div className="text-[10px] text-slate-500 font-bold tracking-widest">{stat.label}</div>
                  </div>
                  <div className={`text-2xl sm:text-3xl font-black text-${stat.color}-400 hologram-text`}>{stat.val}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
