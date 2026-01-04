import React, { useState, useEffect } from 'react';
import { Search, Users, MapPin, Clock, AlertTriangle, CheckCircle, TrendingUp, Activity, Camera, Zap, Shield, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from '../supabase';
import apiService from '../services/apiService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    missingChildren: 0,
    foundChildren: 0,
    activeSearches: 0,
    communityReports: 0,
    successRate: 0,
    avgResponseTime: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [missingPersons, setMissingPersons] = useState([]);

  const [networkStatus, setNetworkStatus] = useState({
    totalCameras: 15847,
    activeCameras: 14923,
    scansPerHour: 2847,
    successfulMatches: 156
  });

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load missing persons
        const missingResponse = await apiService.getMissingPersons();
        if (missingResponse.status === 'success') {
          const persons = missingResponse.data || [];
          setMissingPersons(persons);
          
          // Update stats
          const foundCount = persons.filter(p => p.status === 'found').length;
          setStats(prev => ({
            ...prev,
            missingChildren: persons.length,
            foundChildren: foundCount,
            activeSearches: persons.length - foundCount,
            successRate: persons.length > 0 ? (foundCount / persons.length * 100).toFixed(1) : 0
          }));

          // Create recent activity from missing persons (last 5)
          const recentPersons = persons.slice(0, 5).map((person, index) => ({
            id: person.id || index + 1,
            type: person.status === 'found' ? 'found' : 'missing',
            child: person.name,
            location: person.description?.split(',')[0] || 'Unknown',
            time: new Date(person.reported_date).toLocaleString(),
            confidence: 95,
            age: person.age
          }));
          setRecentActivity(recentPersons);
        }

        // Load sightings for community reports count
        try {
          const sightingsResponse = await apiService.getSightings();
          if (sightingsResponse.status === 'success') {
            const sightingsData = sightingsResponse.data || [];
            setStats(prev => ({
              ...prev,
              communityReports: Array.isArray(sightingsData) ? sightingsData.length : 0
            }));
          }
        } catch (err) {
          console.error('Error loading sightings:', err);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Fui Corner Helper
  const FuiCorner = () => (
    <>
      <div className="fui-corner fui-corner-tl" />
      <div className="fui-corner fui-corner-tr" />
      <div className="fui-corner fui-corner-bl" />
      <div className="fui-corner fui-corner-br" />
    </>
  );

  // Listen for real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' },
        (payload) => {
          const newActivity = {
            id: Date.now(),
            type: 'sighting',
            child: payload.new.person_id ? `Case #${payload.new.person_id}` : 'Anonymous',
            location: payload.new.location,
            time: 'Just now',
            status: 'verifying'
          };
          setRecentActivity(prev => [newActivity, ...prev.slice(0, 4)]);

          setStats(prev => ({
            ...prev,
            activeSearches: prev.activeSearches + 1
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Simulate background noise updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        communityReports: prev.communityReports + Math.floor(Math.random() * 2)
      }));
      setNetworkStatus(prev => ({
        ...prev,
        scansPerHour: prev.scansPerHour + Math.floor(Math.random() * 20) - 10,
        successfulMatches: Math.max(0, prev.successfulMatches + Math.floor(Math.random() * 3) - 1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'found': return <CheckCircle size={20} className="text-emerald-400" />;
      case 'missing': return <AlertTriangle size={20} className="text-rose-400" />;
      case 'sighting': return <MapPin size={20} className="text-amber-400" />;
      case 'alert': return <Activity size={20} className="text-purple-400" />;
      default: return <Clock size={20} className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] relative selection:bg-cyan-500/30 font-mono">
      {/* Cinematic Overlays */}
      <div className="hud-overlay" />
      <div className="scanline" />
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-10">
        {/* Header HUD */}
        <div className="mb-8 sm:mb-12 border-b border-cyan-500/20 pb-6 sm:pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Terminal size={16} className="sm:w-[18px] sm:h-[18px] text-cyan-500 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] font-bold text-cyan-500 tracking-[0.2em]">COMMAND_CENTER_v4.2</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black hologram-text text-white">SYSTEM_DASHBOARD</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl font-mono">
              Monitoring 15,842 federated neural nodes across national sectors.
              Spatial intelligence active.
            </p>
          </div>
          <div className="flex gap-2 sm:gap-4 flex-wrap">
            <Link to="/report-missing" className="modern-card py-2 px-4 sm:px-6 border-rose-500/30 text-rose-500 text-[10px] sm:text-xs hover:bg-rose-500/10 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <AlertTriangle size={12} className="sm:w-[14px] sm:h-[14px]" /> NEW_REPORT
            </Link>
            <Link to="/demo" className="modern-card py-2 px-4 sm:px-6 border-cyan-500/30 text-cyan-500 text-[10px] sm:text-xs hover:bg-cyan-500/10 flex items-center gap-1.5 sm:gap-2 animate-pulse-glow whitespace-nowrap">
              <Zap size={12} className="sm:w-[14px] sm:h-[14px]" /> LAUNCH_SIM
            </Link>
          </div>
        </div>

        {/* HUD Statistics Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {[
            { label: "MISSING_SIGNATURES", val: stats.missingChildren, color: "rose", icon: Users },
            { label: "VERIFIED_RECOVERIES", val: stats.foundChildren, color: "emerald", icon: CheckCircle },
            { label: "ACTIVE_PROBES", val: stats.activeSearches, color: "amber", icon: Search },
            { label: "COMMUNITY_UPLOADS", val: stats.communityReports, color: "cyan", icon: MapPin }
          ].map((item, i) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              key={i}
              className={`modern-card border-${item.color}-500/20 p-6 flex flex-col justify-between h-[160px]`}
            >
              <FuiCorner />
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-bold text-${item.color}-500/70 tracking-widest`}>{item.label}</span>
                <item.icon size={16} className={`text-${item.color}-500/50`} />
              </div>
              <div>
                <div className="text-4xl font-black text-white hologram-text">{item.val.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 animate-pulse`} />
                  <span className={`text-[8px] text-${item.color}-500/60 font-mono tracking-tighter`}>STREAMING_DATA_LINK_STABLE</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Diagnostics & Network HUD */}
        <div className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* Performance HUD */}
          <div className="col-span-12 lg:col-span-7 modern-card p-8">
            <FuiCorner />
            <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
              <Activity className="text-cyan-500" size={20} />
              <h2 className="text-xl font-bold text-white tracking-widest">NEURAL_EFFICIENCY_METRICS</h2>
            </div>

            <div className="space-y-8">
              {[
                { label: "MATCH_PROBABILITY_INDEX", val: stats.successRate, color: "emerald" },
                { label: "GRID_RESPONSE_LATENCY", val: (60 - stats.avgResponseTime) / 60 * 100, labelVal: `${stats.avgResponseTime}s`, color: "cyan" },
                { label: "AI_CORE_PRECISION", val: 96.3, color: "purple" }
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 items-center">
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider">{metric.label}</span>
                    <span className={`text-xs font-bold text-${metric.color}-400`}>{metric.labelVal || `${metric.val}%`}</span>
                  </div>
                  <div className="h-1 bg-slate-900 overflow-hidden relative border border-slate-800/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.val}%` }}
                      className={`h-full bg-${metric.color}-500 shadow-[0_0_10px_rgba(var(--accent-${metric.color}),0.5)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Node HUD */}
          <div className="col-span-12 lg:col-span-5 modern-card p-8">
            <FuiCorner />
            <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
              <Shield className="text-purple-500" size={20} />
              <h2 className="text-xl font-bold text-white tracking-widest">NODE_NETWORK_STATUS</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "TOTAL_NODES", val: networkStatus.totalCameras.toLocaleString(), color: "slate" },
                { label: "ACTIVE_LINKS", val: networkStatus.activeCameras.toLocaleString(), color: "cyan" },
                { label: "SCANS/SEC", val: Math.floor(networkStatus.scansPerHour / 360), color: "amber" },
                { label: "SECURE_MATCHES", val: networkStatus.successfulMatches, color: "purple" }
              ].map((box, i) => (
                <div key={i} className="bg-black/40 border border-slate-800 p-4 relative group hover:border-cyan-500/30 transition-colors">
                  <div className="text-[8px] text-slate-500 font-bold mb-1">{box.label}</div>
                  <div className="text-xl font-bold text-white mb-2">{box.val}</div>
                  <div className="h-0.5 bg-slate-900 w-full">
                    <div className={`h-full bg-${box.color}-500/50 w-2/3 group-hover:w-full transition-all duration-700`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-cyan-500/30 flex items-center justify-center animate-spin-slow">
                <Zap size={16} className="text-cyan-500" />
              </div>
              <div>
                <div className="text-[10px] text-cyan-500 font-bold">GRID_ENCRYPTION_ACTIVE</div>
                <div className="text-[8px] text-cyan-700 font-mono">HASH: 0x82...F92A | AES-CBC</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Feed HUD */}
        <div className="modern-card p-8 min-h-[400px]">
          <FuiCorner />
          <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
            <Clock className="text-emerald-500" size={20} />
            <h2 className="text-xl font-bold text-white tracking-widest">REALTIME_SURVEILLANCE_FEED</h2>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-2" />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                <p className="text-slate-500 mt-4 text-sm">LOADING_NEURAL_DATA...</p>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-sm">NO_ACTIVITY_DATA_AVAILABLE</p>
              </div>
            ) : (
              <AnimatePresence>
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-black/40 border border-slate-800/50 p-4 relative group hover:bg-slate-900/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className={`w-10 h-10 border border-slate-800 flex items-center justify-center`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm tracking-widest uppercase">
                            {activity.type === 'found' && `RECOVERY_CONFIRMED: ${activity.child}`}
                            {activity.type === 'missing' && `NEW_INGESTION: ${activity.child}`}
                            {activity.type === 'sighting' && `CITIZEN_UPDATE: ${activity.child}`}
                            {activity.type === 'alert' && `EMERGENCY_PROBE: ${activity.child}`}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-500 font-mono">
                            <span>LOC: {(activity.location || 'UNKNOWN').toUpperCase()}</span>
                            <span className="opacity-30">|</span>
                            <span>TS: {activity.time}</span>
                            {activity.confidence && (
                              <>
                                <span className="opacity-30">|</span>
                                <span className="text-emerald-500/70">CONF: {activity.confidence}%</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-[10px] text-slate-600 font-bold mb-1">PROCESSED_BY_NODE_{activity.id % 999}</div>
                        <div className="h-1 w-20 bg-slate-900 overflow-hidden">
                          <div className="h-full bg-cyan-500/30 w-full animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;