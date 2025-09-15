import React, { useState, useEffect } from 'react';
import { Camera, Search, MapPin, Activity, Zap, Filter, Play, Pause, RotateCcw, Eye } from 'lucide-react';
import SimpleFaceModel from './SimpleFaceModel';

const SearchNetwork = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedCamera, setSelectedCamera] = useState(null);
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
      status: 'verified'
    },
    { 
      id: 2, 
      cameraId: 'CAM_CHN_001', 
      childName: 'Arjun Patel', 
      confidence: 87, 
      time: '15 min ago',
      status: 'investigating'
    },
    { 
      id: 3, 
      cameraId: 'CAM_MUM_002', 
      childName: 'Rahul Kumar', 
      confidence: 92, 
      time: '1 hour ago',
      status: 'found'
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        scansCompleted: prev.scansCompleted + Math.floor(Math.random() * 10),
        matchesFound: prev.matchesFound + Math.floor(Math.random() * 3),
        alertsSent: prev.alertsSent + Math.floor(Math.random() * 2)
      }));

      // Update camera statuses randomly
      setCameras(prev => prev.map(camera => ({
        ...camera,
        lastScan: camera.status === 'active' ? 
          ['30 sec ago', '45 sec ago', '1 min ago', '2 min ago'][Math.floor(Math.random() * 4)] :
          camera.lastScan
      })));
    }, 5000);

    return () => clearInterval(interval);
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

  const getStatusBg = (status) => {
    switch (status) {
      case 'active': return 'gradient-emerald';
      case 'scanning': return 'gradient-amber';
      case 'offline': return 'gradient-rose';
      default: return 'modern-card';
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

  const filteredCameras = cameras.filter(camera => {
    return (filters.location === 'all' || camera.location.toLowerCase().includes(filters.location.toLowerCase())) &&
           (filters.cameraType === 'all' || camera.type === filters.cameraType) &&
           (filters.status === 'all' || camera.status === filters.status);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-1/3 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Camera className="text-cyan-400" size={32} />
            <h1 className="text-5xl font-black text-gradient-cyan">CCTV Network Control</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            Monitor and control AI-powered facial recognition across 15,000+ cameras in real-time
          </p>

          {/* Control Panel */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={startNetworkScan}
              disabled={isScanning}
              className="btn-primary flex items-center gap-3 px-8 py-4 text-lg animate-pulse-glow"
            >
              {isScanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Scanning Network...</span>
                </>
              ) : (
                <>
                  <Zap size={24} />
                  <span>Start Network Scan</span>
                </>
              )}
            </button>
            <button className="btn-secondary flex items-center gap-3 px-6 py-4">
              <Eye size={20} />
              <span>Live Demo</span>
            </button>
            <button className="btn-secondary flex items-center gap-3 px-6 py-4">
              <RotateCcw size={20} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          <div className="modern-card gradient-cyan p-6 text-center">
            <Camera className="mx-auto text-cyan-400 mb-3" size={28} />
            <p className="text-2xl font-bold text-white">{networkStats.totalCameras.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Total Cameras</p>
          </div>
          <div className="modern-card gradient-emerald p-6 text-center">
            <Activity className="mx-auto text-emerald-400 mb-3" size={28} />
            <p className="text-2xl font-bold text-white">{networkStats.activeCameras.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Active Cameras</p>
          </div>
          <div className="modern-card gradient-rose p-6 text-center">
            <Zap className="mx-auto text-rose-400 mb-3" size={28} />
            <p className="text-2xl font-bold text-white">{networkStats.offlineCameras}</p>
            <p className="text-gray-400 text-sm">Offline</p>
          </div>
          <div className="modern-card gradient-purple p-6 text-center">
            <Search className="mx-auto text-purple-400 mb-3" size={28} />
            <p className="text-2xl font-bold text-white">{networkStats.scansCompleted.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Scans Completed</p>
          </div>
          <div className="modern-card gradient-amber p-6 text-center">
            <Eye className="mx-auto text-amber-400 mb-3" size={28} />
            <p className="text-2xl font-bold text-white">{networkStats.matchesFound}</p>
            <p className="text-gray-400 text-sm">Matches Found</p>
          </div>
          <div className="modern-card gradient-rose p-6 text-center">
            <Activity className="mx-auto text-rose-400 mb-3" size={28} />
            <p className="text-2xl font-bold text-white">{networkStats.alertsSent}</p>
            <p className="text-gray-400 text-sm">Alerts Sent</p>
          </div>
        </div>

        {/* Scanning Progress */}
        {isScanning && (
          <div className="modern-card p-8 mb-12 gradient-cyan">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-white">Network Scan in Progress</h2>
            </div>
            <div className="progress-bar h-4 mb-4">
              <div 
                className="progress-fill h-4"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Scanning {Math.floor(scanProgress * 159 / 100)} / 15,847 cameras</span>
              <span className="text-cyan-400 font-bold">{scanProgress}%</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Camera Grid */}
          <div className="xl:col-span-2">
            <div className="modern-card p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <MapPin className="text-purple-400" size={24} />
                  <h2 className="text-2xl font-bold text-white">Camera Network</h2>
                </div>
                
                {/* Filters */}
                <div className="flex items-center gap-4">
                  <Filter className="text-gray-400" size={20} />
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="scanning">Scanning</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCameras.map((camera) => (
                  <div 
                    key={camera.id} 
                    className={`modern-card ${getStatusBg(camera.status)} p-6 cursor-pointer transition-all hover:scale-105`}
                    onClick={() => setSelectedCamera(camera)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg">{camera.id}</h3>
                        <p className="text-gray-300 text-sm">{camera.location}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(camera.status)}`}>
                        {camera.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white capitalize">{camera.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Scan:</span>
                        <span className="text-white">{camera.lastScan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Matches:</span>
                        <span className={camera.matches > 0 ? 'text-amber-400 font-bold' : 'text-gray-400'}>{camera.matches}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Crowd Density:</span>
                        <span className={getCrowdColor(camera.crowd)}>{camera.crowd.toUpperCase()}</span>
                      </div>
                    </div>

                    {camera.status === 'scanning' && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-amber-400 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Matches */}
            <div className="modern-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-emerald-400" size={24} />
                <h2 className="text-xl font-bold text-white">Recent Matches</h2>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-2"></div>
              </div>
              <div className="space-y-4">
                {recentMatches.map((match) => (
                  <div key={match.id} className="modern-card gradient-emerald p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-semibold">{match.childName}</h3>
                      <span className="text-emerald-400 font-bold">{match.confidence}%</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{match.cameraId}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">{match.time}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        match.status === 'found' ? 'bg-emerald-500/20 text-emerald-400' :
                        match.status === 'verified' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {match.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Camera Details */}
            {selectedCamera && (
              <div className="modern-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Camera className="text-cyan-400" size={24} />
                  <h2 className="text-xl font-bold text-white">Camera Details</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{selectedCamera.id}</h3>
                    <p className="text-gray-400">{selectedCamera.location}</p>
                  </div>
                  
                  {/* Live Feed Simulation */}
                  <div className="bg-black rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black">
                      <div className="absolute top-2 left-2 text-emerald-400 text-xs font-mono">
                        LIVE • {selectedCamera.id}
                      </div>
                      <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      
                      {/* Simulated crowd */}
                      <div className="absolute bottom-4 left-4 w-2 h-4 bg-gray-600 rounded-full opacity-60"></div>
                      <div className="absolute bottom-4 right-6 w-1 h-3 bg-gray-600 rounded-full opacity-60"></div>
                      <div className="absolute bottom-4 left-1/2 w-1 h-2 bg-gray-600 rounded-full opacity-60"></div>
                      
                      {/* Scanning overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-pulse"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className={`font-medium ${getStatusColor(selectedCamera.status)}`}>
                        {selectedCamera.status.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Type</p>
                      <p className="text-white font-medium">{selectedCamera.type.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Matches</p>
                      <p className="text-white font-medium">{selectedCamera.matches}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Crowd</p>
                      <p className={`font-medium ${getCrowdColor(selectedCamera.crowd)}`}>
                        {selectedCamera.crowd.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {selectedCamera.matches > 0 && (
                    <button className="w-full btn-primary py-3">
                      View Match Details
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchNetwork;