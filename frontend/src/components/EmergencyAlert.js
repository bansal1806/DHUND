import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, MapPin, Clock, Phone, Send, X, CheckCircle, Zap, Shield, Users, Radio, Globe, TrendingUp, Activity, Satellite, Eye, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from './MapComponent';
import apiService from '../services/apiService';

const EmergencyAlert = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 'ALERT_001',
      type: 'amber',
      title: 'Priya Sharma - High Priority',
      location: 'Mumbai Central Area',
      coordinates: [19.0760, 72.8777],
      timeIssued: '2024-01-15T14:30:00',
      status: 'active',
      confidence: 94,
      description: 'Last seen wearing red dress, 8 years old. Missing since 2 hours.',
      photo: null,
      alertsSent: 15847,
      responses: 234,
      verifiedSightings: 3,
      reach: 45.2,
      engagement: 78.5
    },
    {
      id: 'ALERT_002',
      type: 'silver',
      title: 'Arjun Patel - Medium Priority',
      location: 'Delhi NCR Region',
      coordinates: [28.6139, 77.2090],
      timeIssued: '2024-01-15T10:15:00',
      status: 'active',
      confidence: 76,
      description: 'School uniform, blue backpack, 12 years old. Last seen near school.',
      photo: null,
      alertsSent: 8934,
      responses: 89,
      verifiedSightings: 1,
      reach: 32.1,
      engagement: 65.3
    },
    {
      id: 'ALERT_003',
      type: 'found',
      title: 'Kavya Reddy - FOUND',
      location: 'Bangalore City',
      coordinates: [12.9716, 77.5946],
      timeIssued: '2024-01-14T18:45:00',
      status: 'resolved',
      confidence: 98,
      description: 'Found safe at relative\'s house. Recovery successful.',
      photo: null,
      alertsSent: 12456,
      responses: 156,
      verifiedSightings: 5,
      reach: 52.8,
      engagement: 89.2
    }
  ]);

  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: 'amber',
    title: '',
    description: '',
    location: '',
    urgency: 'high'
  });

  const [networkStats, setNetworkStats] = useState({
    totalSubscribers: 2847291,
    activeAlerts: 156,
    alertsSentToday: 45632,
    averageResponseTime: 12,
    successRate: 78.3,
    coverage: 94.5
  });

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        totalSubscribers: prev.totalSubscribers + Math.floor(Math.random() * 50),
        alertsSentToday: prev.alertsSentToday + Math.floor(Math.random() * 20),
        averageResponseTime: Math.max(8, prev.averageResponseTime + Math.floor(Math.random() * 3) - 1)
      }));

      // Update alert responses
      setAlerts(prev => prev.map(alert => ({
        ...alert,
        responses: alert.status === 'active' ? alert.responses + Math.floor(Math.random() * 5) : alert.responses,
        alertsSent: alert.status === 'active' ? alert.alertsSent + Math.floor(Math.random() * 50) : alert.alertsSent
      })));

      // Add real-time update
      if (Math.random() > 0.7) {
        setRealTimeUpdates(prev => [{
          id: Date.now(),
          message: `Alert ${alerts[0]?.id} reached ${Math.floor(Math.random() * 1000) + 1000} new subscribers`,
          timestamp: new Date()
        }, ...prev.slice(0, 4)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [alerts]);

  const getAlertTypeConfig = (type) => {
    switch (type) {
      case 'amber':
        return {
          color: 'amber',
          bgClass: 'gradient-amber',
          textClass: 'text-amber-400',
          borderClass: 'border-amber-500/30',
          label: 'AMBER ALERT',
          priority: 'Critical',
          glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]'
        };
      case 'silver':
        return {
          color: 'cyan',
          bgClass: 'gradient-cyan',
          textClass: 'text-cyan-400',
          borderClass: 'border-cyan-500/30',
          label: 'SILVER ALERT',
          priority: 'High',
          glow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]'
        };
      case 'found':
        return {
          color: 'emerald',
          bgClass: 'gradient-emerald',
          textClass: 'text-emerald-400',
          borderClass: 'border-emerald-500/30',
          label: 'RECOVERED',
          priority: 'Resolved',
          glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]'
        };
      default:
        return {
          color: 'purple',
          bgClass: 'gradient-purple',
          textClass: 'text-purple-400',
          borderClass: 'border-purple-500/30',
          label: 'ALERT',
          priority: 'Medium',
          glow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]'
        };
    }
  };

  const handleCreateAlert = () => {
    const alertConfig = getAlertTypeConfig(newAlert.type);
    const alert = {
      id: 'ALERT_' + Date.now().toString().slice(-3),
      ...newAlert,
      coordinates: [19.0760, 72.8777], // Default to Mumbai
      timeIssued: new Date().toISOString(),
      status: 'active',
      confidence: Math.floor(Math.random() * 20) + 80,
      alertsSent: 0,
      responses: 0,
      verifiedSightings: 0,
      reach: 0,
      engagement: 0
    };

    setAlerts(prev => [alert, ...prev]);
    setNewAlert({ type: 'amber', title: '', description: '', location: '', urgency: 'high' });
    setIsCreatingAlert(false);

    // Simulate alert distribution
    setTimeout(() => {
      setAlerts(prev => prev.map(a => 
        a.id === alert.id 
          ? { ...a, alertsSent: Math.floor(Math.random() * 20000) + 5000, reach: Math.random() * 50 }
          : a
      ));
    }, 2000);
  };

  const FuiCorner = () => (
    <>
      <div className="fui-corner fui-corner-tl" />
      <div className="fui-corner fui-corner-tr" />
      <div className="fui-corner fui-corner-bl" />
      <div className="fui-corner fui-corner-br" />
    </>
  );

  const AlertCard = ({ alert }) => {
    const config = getAlertTypeConfig(alert.type);
    const timeAgo = Math.floor((Date.now() - new Date(alert.timeIssued).getTime()) / (1000 * 60));

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`modern-card ${config.bgClass} p-5 sm:p-6 cursor-pointer transition-all relative overflow-hidden ${config.glow} ${alert.status === 'active' ? 'border-2 ' + config.borderClass : ''}`}
        onClick={() => setSelectedAlert(alert)}
      >
        {alert.status === 'active' && (
          <motion.div
            className={`absolute inset-0 bg-${config.color}-500/10`}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <FuiCorner />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-${config.color}-500/20 rounded border border-${config.color}-500/30`}>
                <AlertTriangle className={config.textClass} size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg sm:text-xl mb-1">{alert.title}</h3>
                <p className={`text-xs sm:text-sm font-medium ${config.textClass}`}>{config.label}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold bg-${config.color}-500/20 ${config.textClass} border border-${config.color}-500/30`}>
              {alert.confidence}%
            </div>
          </div>

          <p className="text-gray-300 mb-4 text-sm">{alert.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              <span className="text-gray-300 text-xs sm:text-sm truncate">{alert.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span className="text-gray-300 text-xs sm:text-sm">{timeAgo}m ago</span>
            </div>
            <div className="flex items-center gap-2">
              <Send size={16} className="text-gray-400" />
              <span className="text-gray-300 text-xs sm:text-sm">{alert.alertsSent.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-400" />
              <span className="text-gray-300 text-xs sm:text-sm">{alert.responses}</span>
            </div>
          </div>

          {alert.status === 'active' && (
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`w-2 h-2 bg-${config.color}-400 rounded-full`}
                />
                <span className={`text-xs font-medium ${config.textClass}`}>BROADCASTING LIVE</span>
              </div>
              <div className="text-xs text-gray-400">
                Reach: {alert.reach.toFixed(1)}% | Engagement: {alert.engagement.toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-mono selection:bg-cyan-500/30">
      {/* Cinematic Overlays */}
      <div className="hud-overlay" />
      <div className="scanline" />
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-rose-500 flex items-center justify-center relative">
                <Bell className="text-rose-400" size={24} />
                <div className="absolute inset-0 border border-rose-500/50 animate-ping" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black hologram-text text-white">EMERGENCY_ALERT_CENTER</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-mono">
                  Real-time alert distribution network • {networkStats.totalSubscribers.toLocaleString()} subscribers
                </p>
              </div>
            </div>

            {/* Control Panel */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsCreatingAlert(true)}
                className="modern-card py-2 sm:py-3 px-4 sm:px-6 border-rose-500/40 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 text-sm sm:text-base transition-all animate-pulse-glow"
              >
                <AlertTriangle size={18} />
                <span>CREATE_ALERT</span>
              </button>
              <button 
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                className="modern-card py-2 sm:py-3 px-4 sm:px-6 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-2 text-sm sm:text-base transition-all"
              >
                <Globe size={18} />
                <span>{viewMode === 'list' ? 'MAP_VIEW' : 'LIST_VIEW'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: "SUBSCRIBERS", value: networkStats.totalSubscribers.toLocaleString(), icon: Users, color: "cyan" },
            { label: "ACTIVE", value: networkStats.activeAlerts, icon: AlertTriangle, color: "amber" },
            { label: "SENT_TODAY", value: networkStats.alertsSentToday.toLocaleString(), icon: Send, color: "purple" },
            { label: "RESPONSE", value: `${networkStats.averageResponseTime}s`, icon: Zap, color: "emerald" },
            { label: "SUCCESS", value: `${networkStats.successRate}%`, icon: CheckCircle, color: "rose" },
            { label: "COVERAGE", value: `${networkStats.coverage}%`, icon: Satellite, color: "cyan" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`modern-card ${stat.color === 'cyan' ? 'gradient-cyan' : stat.color === 'amber' ? 'gradient-amber' : stat.color === 'purple' ? 'gradient-purple' : stat.color === 'emerald' ? 'gradient-emerald' : 'gradient-rose'} p-4 sm:p-5 text-center relative overflow-hidden`}
            >
              <FuiCorner />
              <stat.icon className={`mx-auto text-${stat.color}-400 mb-2`} size={24} />
              <p className="text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-gray-400 text-[10px] sm:text-xs font-bold tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Active Alerts / Map View */}
          <div className="xl:col-span-2">
            {viewMode === 'list' ? (
              <div className="modern-card p-4 sm:p-6 sm:p-8 bg-black/40">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-amber-400" size={24} />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">ACTIVE_ALERTS</h2>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500">
                    {alerts.filter(a => a.status === 'active').length} ACTIVE
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <AnimatePresence>
                    {alerts.map((alert) => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="modern-card p-4 sm:p-6 bg-black/40 h-[600px] sm:h-[700px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Globe className="text-cyan-400" size={24} />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">ALERT_DISTRIBUTION_MAP</h2>
                  </div>
                </div>
                <div className="h-[500px] sm:h-[600px] rounded-lg overflow-hidden border border-cyan-500/20">
                  <MapComponent
                    center={[19.0760, 72.8777]}
                    markers={alerts.map(alert => ({
                      position: alert.coordinates,
                      title: alert.title,
                      description: alert.description,
                      isMatch: alert.status === 'resolved'
                    }))}
                    searchRadius={50000}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Real-time Updates */}
            <div className="modern-card p-4 sm:p-6 bg-black/40">
              <FuiCorner />
              <div className="flex items-center gap-3 mb-4">
                <Activity className="text-emerald-400" size={20} />
                <h2 className="text-lg sm:text-xl font-bold text-white">LIVE_UPDATES</h2>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {realTimeUpdates.length === 0 ? (
                  <div className="text-slate-500 text-sm text-center py-4">No recent updates</div>
                ) : (
                  realTimeUpdates.map((update) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded"
                    >
                      <p className="text-cyan-300 text-xs sm:text-sm mb-1">{update.message}</p>
                      <p className="text-slate-500 text-[10px]">
                        {update.timestamp.toLocaleTimeString()}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="modern-card p-4 sm:p-6 bg-black/40">
              <FuiCorner />
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-purple-400" size={20} />
                <h2 className="text-lg sm:text-xl font-bold text-white">QUICK_ACTIONS</h2>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Bell, label: "SEND_TEST_ALERT", color: "rose" },
                  { icon: Radio, label: "CHECK_NETWORK", color: "cyan" },
                  { icon: Users, label: "VIEW_SUBSCRIBERS", color: "purple" },
                  { icon: Shield, label: "SYSTEM_STATUS", color: "emerald" }
                ].map((action, i) => (
                  <button
                    key={i}
                    className={`w-full modern-card py-3 px-4 border-${action.color}-500/30 text-${action.color}-400 hover:bg-${action.color}-500/10 text-left flex items-center gap-3 text-sm transition-all`}
                  >
                    <action.icon size={18} />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="modern-card p-4 sm:p-6 bg-black/40">
              <FuiCorner />
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-emerald-400" size={20} />
                <h2 className="text-lg sm:text-xl font-bold text-white">SYSTEM_HEALTH</h2>
              </div>
              <div className="space-y-4">
                {[
                  { label: "UPTIME", value: "99.9%", color: "emerald" },
                  { label: "LATENCY", value: "12ms", color: "cyan" },
                  { label: "CAPACITY", value: "87%", color: "amber" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500 font-bold">{stat.label}</span>
                      <span className={`text-sm font-bold text-${stat.color}-400`}>{stat.value}</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: stat.value.replace('%', '').replace('ms', '').replace('9', '100') + '%' }}
                        className={`h-full bg-${stat.color}-500`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Create Alert Modal */}
        {isCreatingAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="modern-card max-w-2xl w-full p-6 sm:p-8 bg-black/90 border-cyan-500/30"
            >
              <FuiCorner />
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">CREATE_EMERGENCY_ALERT</h2>
                <button
                  onClick={() => setIsCreatingAlert(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    ALERT_TYPE
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'amber', label: 'AMBER', desc: 'Critical', color: 'amber' },
                      { value: 'silver', label: 'SILVER', desc: 'High Priority', color: 'cyan' },
                      { value: 'general', label: 'GENERAL', desc: 'Standard', color: 'purple' }
                    ].map((type) => (
                      <div
                        key={type.value}
                        onClick={() => setNewAlert(prev => ({ ...prev, type: type.value }))}
                        className={`modern-card p-4 cursor-pointer transition-all text-center border-2 ${
                          newAlert.type === type.value 
                            ? `border-${type.color}-500 bg-${type.color}-500/20` 
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <p className="text-white font-bold">{type.label}</p>
                        <p className="text-gray-400 text-sm">{type.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    ALERT_TITLE *
                  </label>
                  <input
                    type="text"
                    value={newAlert.title}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                    placeholder="Missing Child - Urgent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    DESCRIPTION *
                  </label>
                  <textarea
                    value={newAlert.description}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono resize-none"
                    placeholder="Detailed description of the missing person and circumstances"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    LOCATION *
                  </label>
                  <input
                    type="text"
                    value={newAlert.location}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                    placeholder="Area or city where person was last seen"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsCreatingAlert(false)}
                    className="modern-card px-6 py-3 border-slate-700 text-slate-400 hover:text-white transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleCreateAlert}
                    disabled={!newAlert.title || !newAlert.description || !newAlert.location}
                    className="modern-card px-6 py-3 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    BROADCAST_ALERT
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Selected Alert Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="modern-card max-w-4xl w-full p-6 sm:p-8 bg-black/90 border-cyan-500/30"
            >
              <FuiCorner />
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">ALERT_DETAILS</h2>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className={`modern-card ${getAlertTypeConfig(selectedAlert.type).bgClass} p-6 border-2 ${getAlertTypeConfig(selectedAlert.type).borderClass}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <AlertTriangle className={getAlertTypeConfig(selectedAlert.type).textClass} size={32} />
                    <div>
                      <h3 className="text-white font-bold text-xl sm:text-2xl">{selectedAlert.title}</h3>
                      <p className={`font-medium ${getAlertTypeConfig(selectedAlert.type).textClass}`}>
                        {getAlertTypeConfig(selectedAlert.type).label}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-200 text-base sm:text-lg">{selectedAlert.description}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { icon: Send, label: "ALERTS_SENT", value: selectedAlert.alertsSent.toLocaleString(), color: "purple" },
                    { icon: Users, label: "RESPONSES", value: selectedAlert.responses, color: "cyan" },
                    { icon: CheckCircle, label: "VERIFIED", value: selectedAlert.verifiedSightings, color: "emerald" },
                    { icon: TrendingUp, label: "CONFIDENCE", value: `${selectedAlert.confidence}%`, color: "amber" }
                  ].map((stat, i) => (
                    <div key={i} className="modern-card p-4 text-center border-slate-800">
                      <stat.icon className={`mx-auto text-${stat.color}-400 mb-2`} size={24} />
                      <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-gray-400 text-xs font-bold">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4">
                  <button className="modern-card px-6 py-3 border-slate-700 text-slate-400 hover:text-white transition-all">
                    UPDATE
                  </button>
                  <button className="modern-card px-6 py-3 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 transition-all">
                    RESEND
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyAlert;
