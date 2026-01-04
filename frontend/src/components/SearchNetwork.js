import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Scan, Shield, AlertTriangle, CheckCircle, Activity, Satellite, Filter, Terminal, Zap, Globe, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { apiUrl } from '../config/api';
import MapComponent from './MapComponent';
import supabase from '../supabase';
import BiometricOverlay from './BiometricOverlay';
import SimpleFaceModel from './SimpleFaceModel';
import apiService from '../services/apiService';

const SearchNetwork = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('map');
  const [activeSearch, setActiveSearch] = useState(null);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [searchType, setSearchType] = useState('semantic'); // 'semantic' or 'cctv'
  const [searchQuery, setSearchQuery] = useState('');
  const [cctvPersonId, setCctvPersonId] = useState('');
  const [missingPersons, setMissingPersons] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const mockLocations = [
    { id: 1, position: [19.0176, 72.8562], title: "Dadar Station", description: "CAM_MUM_DADAR_001", isMatch: true },
    { id: 2, position: [19.0596, 72.8295], title: "Bandra Terminal", description: "CAM_MUM_BANDRA_002", isMatch: false },
    { id: 3, position: [18.9218, 72.8340], title: "Gateway of India", description: "CAM_MUM_GATEWAY_001", isMatch: false }
  ];

  const [filters, setFilters] = useState({
    location: 'all',
    cameraType: 'all',
    status: 'all'
  });

  const [networkStats, setNetworkStats] = useState({
    totalCameras: 15847,
    activeCameras: 14923,
    offlineCameras: 924,
    scansCompleted: 45632,
    matchesFound: 847,
    alertsSent: 234
  });

  const [cameras, setCameras] = useState([
    {
      id: 'CAM_MUM_001',
      location: 'Mumbai Central Station - Platform 1',
      status: 'active',
      type: 'hd',
      lat: 18.9690,
      lng: 72.8205,
      lastScan: '2 min ago',
      matches: 0,
      crowd: 'high'
    },
    {
      id: 'CAM_MUM_002',
      location: 'Dadar Railway Station - Exit Gate',
      status: 'active',
      type: 'ai',
      lat: 19.0176,
      lng: 72.8562,
      lastScan: '1 min ago',
      matches: 2,
      crowd: 'medium'
    },
    {
      id: 'CAM_DEL_001',
      location: 'New Delhi Railway Station - Platform 2',
      status: 'scanning',
      type: 'hd',
      lat: 28.6431,
      lng: 77.2197,
      lastScan: 'scanning...',
      matches: 0,
      crowd: 'high'
    },
    {
      id: 'CAM_BLR_001',
      location: 'Bangalore City Railway Station',
      status: 'offline',
      type: 'standard',
      lat: 12.9762,
      lng: 77.5993,
      lastScan: '1 hour ago',
      matches: 0,
      crowd: 'low'
    },
    {
      id: 'CAM_CHN_001',
      location: 'Chennai Central - Main Hall',
      status: 'active',
      type: 'ai',
      lat: 13.0843,
      lng: 80.2705,
      lastScan: '30 sec ago',
      matches: 1,
      crowd: 'medium'
    },
    {
      id: 'CAM_KOL_001',
      location: 'Howrah Junction - Platform 12',
      status: 'active',
      type: 'hd',
      lat: 22.5726,
      lng: 88.3639,
      lastScan: '45 sec ago',
      matches: 0,
      crowd: 'high'
    }
  ]);

  const [recentMatches, setRecentMatches] = useState([
    {
      id: 1,
      cameraId: 'CAM_MUM_002',
      childName: 'Priya Sharma',
      confidence: 94,
      time: '2 min ago',
      status: 'verified',
      breakdown: { facial: 96, gait: 92, context: 89 }
    },
    {
      id: 2,
      cameraId: 'CAM_CHN_001',
      childName: 'Arjun Patel',
      confidence: 87,
      time: '15 min ago',
      status: 'investigating',
      breakdown: { facial: 82, gait: 94, context: 85 }
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        scansCompleted: prev.scansCompleted + Math.floor(Math.random() * 10),
        matchesFound: prev.matchesFound + Math.floor(Math.random() * 3),
        alertsSent: prev.alertsSent + Math.floor(Math.random() * 2)
      }));

      setCameras(prev => prev.map(camera => ({
        ...camera,
        lastScan: camera.status === 'active' ?
          ['30 sec ago', '45 sec ago', '1 min ago', '2 min ago'][Math.floor(Math.random() * 4)] :
          camera.lastScan
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('sightings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' },
        (payload) => {
          setActiveSearch({
            ...payload.new,
            status: 'MATCH FOUND'
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const startNetworkScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-emerald-400';
      case 'scanning': return 'text-amber-400';
      case 'offline': return 'text-rose-400';
      default: return 'text-gray-400';
    }
  };

  const getCrowdColor = (crowd) => {
    switch (crowd) {
      case 'high': return 'text-rose-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };

  const FuiCorner = () => (
    <>
      <div className="fui-corner fui-corner-tl" />
      <div className="fui-corner fui-corner-tr" />
      <div className="fui-corner fui-corner-bl" />
      <div className="fui-corner fui-corner-br" />
    </>
  );

  const filteredCameras = cameras.filter(camera => {
    return (filters.location === 'all' || camera.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.cameraType === 'all' || camera.type === filters.cameraType) &&
      (filters.status === 'all' || camera.status === filters.status);
  });

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-mono selection:bg-cyan-500/30">
      {/* Cinematic Overlays */}
      <div className="hud-overlay" />
      <div className="scanline" />
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-10">
        {/* Header HUD */}
        <div className="mb-8 sm:mb-12 border-b border-cyan-500/20 pb-6 sm:pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Globe size={16} className="sm:w-[18px] sm:h-[18px] text-cyan-500 animate-spin-slow flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] font-bold text-cyan-500 tracking-[0.2em]">SURVEILLANCE_GRID_v2.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black hologram-text text-white">NETWORK_CONTROL</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl font-mono">
              Monitoring 15,842 federated neural nodes. Spatial intelligence active.
              Latent identification protocols engaged.
            </p>
          </div>
          <div className="flex gap-2 sm:gap-4 flex-wrap">
            <button onClick={startNetworkScan} disabled={isScanning} className={`modern-card py-2 px-8 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-3 group ${isScanning ? 'animate-pulse' : ''}`}>
              {isScanning ? <Activity size={16} className="animate-spin" /> : <Scan size={16} className="group-hover:scale-110 transition-transform" />}
              {isScanning ? 'SCANNING...' : 'INITIATE_SCAN'}
            </button>
            <div className={`modern-card py-2 px-6 border-${privacyMode ? 'emerald' : 'rose'}-500/30 text-${privacyMode ? 'emerald' : 'rose'}-500 text-xs flex items-center gap-2`}>
              <Shield size={14} className={privacyMode ? 'animate-pulse' : ''} /> {privacyMode ? 'PRIVACY_ACTIVE' : 'SECURITY_BREACH'}
            </div>
          </div>
        </div>

        {/* Network Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {[
            { label: "NODES", val: networkStats.totalCameras, icon: Camera, color: "slate" },
            { label: "ACTIVE", val: networkStats.activeCameras, icon: Activity, color: "emerald" },
            { label: "OFFLINE", val: networkStats.offlineCameras, icon: AlertTriangle, color: "rose" },
            { label: "SCANS", val: networkStats.scansCompleted, icon: Scan, color: "cyan" },
            { label: "MATCHES", val: networkStats.matchesFound, icon: CheckCircle, color: "amber" },
            { label: "ALERTS", val: networkStats.alertsSent, icon: Terminal, color: "purple" }
          ].map((stat, i) => (
            <div key={i} className="modern-card p-4 border-slate-800/50 bg-black/40 group hover:border-cyan-500/20 transition-all">
              <FuiCorner />
              <div className="flex justify-between items-start mb-2">
                <span className="text-[8px] font-bold text-slate-500 tracking-widest">{stat.label}</span>
                <stat.icon size={12} className={`text-${stat.color}-500/50 group-hover:text-${stat.color}-500 transition-colors`} />
              </div>
              <div className="text-xl font-black hologram-text">{stat.val.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Scanning Animation */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="modern-card p-8 mb-12 border-cyan-500/30 bg-cyan-500/5 overflow-hidden"
            >
              <FuiCorner />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Activity size={16} className="text-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">BROADCAST_SCAN_ACTIVE</span>
                </div>
                <span className="text-xs font-bold text-cyan-400 font-mono">{scanProgress}%</span>
              </div>
              <div className="h-1 bg-cyan-950 w-full relative overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: `${scanProgress - 100}%` }}
                  className="absolute inset-0 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                />
              </div>
              <div className="mt-4 flex justify-between text-[8px] text-cyan-700 font-mono">
                <span>Pinging sector indices...</span>
                <span>0xAB...{Math.floor(Math.random() * 9999)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-12 gap-8">
          {/* Left: Camera Feed & Network List */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="modern-card p-6 bg-slate-900/10">
              <FuiCorner />
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Satellite size={18} className="text-purple-500" />
                  <h2 className="text-xl font-bold tracking-widest">CAMERA_NODES</h2>
                </div>
                <div className="flex gap-4">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="bg-black/40 border border-slate-800 text-[10px] px-3 py-1 text-slate-400 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="all">ALL_STATUS</option>
                    <option value="active">ACTIVE_ONLY</option>
                    <option value="scanning">SCANNING_ONLY</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCameras.map((camera) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    key={camera.id}
                    onClick={() => setSelectedMatch(camera)}
                    className={`modern-card p-4 cursor-pointer border-slate-800 hover:border-cyan-500/20 bg-black/40 h-full flex flex-col justify-between`}
                  >
                    <FuiCorner />
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-[10px] font-bold text-white mb-1">{camera.id}</div>
                        <div className="text-[8px] text-slate-500 font-mono truncate max-w-[150px]">{camera.location}</div>
                      </div>
                      <span className={`text-[8px] font-bold px-2 py-0.5 border ${getStatusColor(camera.status).replace('text', 'border')}/30 ${getStatusColor(camera.status)}`}>
                        {camera.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-1.5 border-t border-slate-800/50 pt-3 mt-auto">
                      <div className="flex justify-between text-[8px] font-mono">
                        <span className="text-slate-500">LAST_PROBE</span>
                        <span className="text-slate-300">{camera.lastScan}</span>
                      </div>
                      <div className="flex justify-between text-[8px] font-mono">
                        <span className="text-slate-500">CROWD_DENSITY</span>
                        <span className={getCrowdColor(camera.crowd)}>{camera.crowd.toUpperCase()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map HUD */}
            <div className="modern-card p-0 relative h-[500px] overflow-hidden">
              <FuiCorner />
              <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                <div className="bg-black/60 backdrop-blur-md border border-cyan-500/20 px-3 py-1 flex items-center gap-3">
                  <MapPin size={14} className="text-cyan-400" />
                  <span className="text-[10px] font-bold text-cyan-400 tracking-widest">GLOBAL_POSITIONING_HUD</span>
                </div>
              </div>
              <MapComponent center={[19.0176, 72.8562]} markers={mockLocations} searchRadius={2000} />
            </div>
          </div>

          {/* Right: Matches & Active Feed */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* Active Match Signal */}
            <AnimatePresence>
              {activeSearch && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="modern-card p-6 border-rose-500/50 bg-rose-500/5 glow-rose"
                >
                  <FuiCorner />
                  <div className="flex items-center gap-3 mb-4 animate-pulse">
                    <AlertTriangle size={20} className="text-rose-500" />
                    <h3 className="text-sm font-bold text-rose-500 tracking-widest">TARGET_MATCH_DETECTED</h3>
                  </div>
                  <div className="bg-black/60 p-4 border border-rose-500/20 mb-4">
                    <div className="text-[10px] text-slate-500 mb-1">DATA_STREAM</div>
                    <div className="text-xs font-mono text-rose-300">GEO: {activeSearch.location}</div>
                    <div className="text-xs font-mono text-rose-300 mt-1">SIG: 0x{Math.random().toString(16).slice(2, 8).toUpperCase()}</div>
                  </div>
                  <button className="w-full py-2 bg-rose-500/20 border border-rose-500/50 text-rose-500 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                    ENGAGE_RESPONSE_TEAM
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Interface */}
            <div className="modern-card p-6">
              <FuiCorner />
              <div className="flex items-center gap-3 mb-4">
                <Activity size={16} className="text-emerald-500" />
                <h2 className="text-sm font-bold tracking-widest uppercase">SEARCH_INTERFACE</h2>
              </div>
              
              {/* Search Type Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSearchType('semantic')}
                  className={`flex-1 px-3 py-2 text-xs font-semibold rounded transition-all ${
                    searchType === 'semantic'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  SEMANTIC
                </button>
                <button
                  onClick={() => setSearchType('cctv')}
                  className={`flex-1 px-3 py-2 text-xs font-semibold rounded transition-all ${
                    searchType === 'cctv'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  CCTV
                </button>
              </div>

              {/* Semantic Search Input */}
              {searchType === 'semantic' && (
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSemanticSearch()}
                    placeholder="Enter search query..."
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded text-white text-sm focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                  />
                  <button
                    onClick={handleSemanticSearch}
                    disabled={loadingSearch || !searchQuery.trim()}
                    className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold rounded transition-all flex items-center justify-center gap-2"
                  >
                    <Search size={14} />
                    SEARCH
                  </button>
                </div>
              )}

              {/* CCTV Search Input */}
              {searchType === 'cctv' && (
                <div className="space-y-3 mb-4">
                  <select
                    value={cctvPersonId}
                    onChange={(e) => setCctvPersonId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select Missing Person</option>
                    {missingPersons.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name} (Age: {person.age})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleCCTVSearch}
                    disabled={loadingSearch || !cctvPersonId}
                    className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold rounded transition-all flex items-center justify-center gap-2"
                  >
                    <Camera size={14} />
                    SEARCH_CCTV
                  </button>
                </div>
              )}

              {/* Search Results */}
              {loadingSearch && (
                <div className="text-center py-4">
                  <Activity className="h-6 w-6 text-cyan-500 animate-spin mx-auto" />
                </div>
              )}
              
              {!loadingSearch && searchResults.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {searchResults.slice(0, 5).map((result, index) => (
                    <div key={index} className="modern-card p-3 border-slate-800 bg-black/40 relative group">
                      {result.name && (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-xs font-bold text-white uppercase tracking-tighter">{result.name}</div>
                            {result.similarity && (
                              <div className="text-xs font-black text-emerald-400">{(result.similarity * 100).toFixed(0)}%</div>
                            )}
                          </div>
                          <div className="text-[8px] text-slate-500 font-mono mb-2">Age: {result.age}</div>
                          {result.description && (
                            <div className="text-[8px] text-slate-400 font-mono mb-2 line-clamp-2">{result.description}</div>
                          )}
                        </>
                      )}
                      {result.camera_id && (
                        <>
                          <div className="text-xs font-bold text-white mb-1">{result.camera_id}</div>
                          {result.location && (
                            <div className="text-[8px] text-slate-500 font-mono mb-2">{result.location}</div>
                          )}
                          {result.confidence && (
                            <div className="text-xs font-black text-emerald-400">{(result.confidence * 100).toFixed(0)}%</div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Node Feed Simulation */}
            <div className="modern-card p-0 aspect-square relative bg-black border-slate-800 overflow-hidden">
              <FuiCorner />
              <div className="absolute inset-0 cyber-grid opacity-10" />
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  LIVE_NODE_MUM_024
                </div>
                <div className="text-[8px] text-slate-500 font-mono tracking-widest">ID_HASH: 0xFD...21C</div>
              </div>

              <div className="w-full h-full flex flex-col items-center justify-center pt-8">
                <div className="w-full h-[300px] relative">
                  <SimpleFaceModel scanningProgress={scanProgress} isScanning={isScanning} size="small" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4 text-[8px] text-cyan-400 font-bold tracking-widest animate-pulse">
                ANALYZING_GAIT...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchNetwork;