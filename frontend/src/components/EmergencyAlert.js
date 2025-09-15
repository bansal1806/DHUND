import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, MapPin, Clock, Phone, Send, X, CheckCircle, Zap, Shield, Users, Radio } from 'lucide-react';

const EmergencyAlert = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 'ALERT_001',
      type: 'amber',
      title: 'Priya Sharma - High Priority',
      location: 'Mumbai Central Area',
      timeIssued: '2024-01-15T14:30:00',
      status: 'active',
      confidence: 94,
      description: 'Last seen wearing red dress, 8 years old',
      photo: null,
      alertsSent: 15847,
      responses: 234,
      verifiedSightings: 3
    },
    {
      id: 'ALERT_002',
      type: 'silver',
      title: 'Arjun Patel - Medium Priority',
      location: 'Delhi NCR Region',
      timeIssued: '2024-01-15T10:15:00',
      status: 'active',
      confidence: 76,
      description: 'School uniform, blue backpack, 12 years old',
      photo: null,
      alertsSent: 8934,
      responses: 89,
      verifiedSightings: 1
    },
    {
      id: 'ALERT_003',
      type: 'found',
      title: 'Kavya Reddy - FOUND',
      location: 'Bangalore City',
      timeIssued: '2024-01-14T18:45:00',
      status: 'resolved',
      confidence: 98,
      description: 'Found safe at relative\'s house',
      photo: null,
      alertsSent: 12456,
      responses: 156,
      verifiedSightings: 5
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
    successRate: 78.3
  });

  const [selectedAlert, setSelectedAlert] = useState(null);

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
        responses: alert.status === 'active' ? alert.responses + Math.floor(Math.random() * 5) : alert.responses
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getAlertTypeConfig = (type) => {
    switch (type) {
      case 'amber':
        return {
          color: 'amber',
          bgClass: 'gradient-amber',
          textClass: 'text-amber-400',
          label: 'AMBER ALERT',
          priority: 'Critical'
        };
      case 'silver':
        return {
          color: 'cyan',
          bgClass: 'gradient-cyan',
          textClass: 'text-cyan-400',
          label: 'SILVER ALERT',
          priority: 'High'
        };
      case 'found':
        return {
          color: 'emerald',
          bgClass: 'gradient-emerald',
          textClass: 'text-emerald-400',
          label: 'RECOVERED',
          priority: 'Resolved'
        };
      default:
        return {
          color: 'purple',
          bgClass: 'gradient-purple',
          textClass: 'text-purple-400',
          label: 'ALERT',
          priority: 'Medium'
        };
    }
  };

  const handleCreateAlert = () => {
    const alertConfig = getAlertTypeConfig(newAlert.type);
    const alert = {
      id: 'ALERT_' + Date.now().toString().slice(-3),
      ...newAlert,
      timeIssued: new Date().toISOString(),
      status: 'active',
      confidence: Math.floor(Math.random() * 20) + 80,
      alertsSent: 0,
      responses: 0,
      verifiedSightings: 0
    };

    setAlerts(prev => [alert, ...prev]);
    setNewAlert({ type: 'amber', title: '', description: '', location: '', urgency: 'high' });
    setIsCreatingAlert(false);

    // Simulate alert distribution
    setTimeout(() => {
      setAlerts(prev => prev.map(a => 
        a.id === alert.id 
          ? { ...a, alertsSent: Math.floor(Math.random() * 20000) + 5000 }
          : a
      ));
    }, 2000);
  };

  const AlertCard = ({ alert }) => {
    const config = getAlertTypeConfig(alert.type);
    const timeAgo = Math.floor((Date.now() - new Date(alert.timeIssued).getTime()) / (1000 * 60));

    return (
      <div 
        className={`modern-card ${config.bgClass} p-6 cursor-pointer transition-all hover:scale-102`}
        onClick={() => setSelectedAlert(alert)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className={config.textClass} size={24} />
            <div>
              <h3 className="text-white font-bold text-lg">{alert.title}</h3>
              <p className={`text-sm font-medium ${config.textClass}`}>{config.label}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${config.textClass}`}>
            {alert.confidence}% MATCH
          </div>
        </div>

        <p className="text-gray-300 mb-4">{alert.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span className="text-gray-300">{alert.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-gray-300">{timeAgo}m ago</span>
          </div>
          <div className="flex items-center gap-2">
            <Send size={16} className="text-gray-400" />
            <span className="text-gray-300">{alert.alertsSent.toLocaleString()} sent</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <span className="text-gray-300">{alert.responses} responses</span>
          </div>
        </div>

        {alert.status === 'active' && (
          <div className="mt-4 flex gap-2">
            <div className={`w-2 h-2 ${config.textClass.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
            <span className={`text-xs font-medium ${config.textClass}`}>BROADCASTING</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 left-1/2 w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Bell className="text-rose-400" size={32} />
            <h1 className="text-5xl font-black text-gradient-purple">Emergency Alert Center</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            Manage and broadcast emergency alerts across India's missing person network
          </p>

          {/* Control Panel */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsCreatingAlert(true)}
              className="btn-primary flex items-center gap-3 px-8 py-4 text-lg animate-pulse-glow"
            >
              <AlertTriangle size={24} />
              <span>Create Emergency Alert</span>
            </button>
            <button className="btn-secondary flex items-center gap-3 px-6 py-4">
              <Radio size={20} />
              <span>Broadcast Status</span>
            </button>
            <button className="btn-secondary flex items-center gap-3 px-6 py-4">
              <Shield size={20} />
              <span>System Health</span>
            </button>
          </div>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="modern-card gradient-cyan p-6 text-center">
            <Users className="mx-auto text-cyan-400 mb-3" size={28} />
            <p className="text-2xl font-bold text-white">{networkStats.totalSubscribers.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Subscribers</p>
          </div>
          <div className="modern-card gradient-amber p-6 text-center">
            <AlertTriangle className="mx-auto text-amber-400 mb-3" size={28} />
            <p className="text-2xl font-bold text-white">{networkStats.activeAlerts}</p>
            <p className="text-gray-400 text-sm">Active Alerts</p>
          </div>
          <div className="modern-card gradient-purple p-6 text-center">
            <Send className="mx-auto text-purple-400 mb-3" size={28} />
            <p className="text-2xl font-bold text-white">{networkStats.alertsSentToday.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Sent Today</p>
          </div>
          <div className="modern-card gradient-emerald p-6 text-center">
            <Clock className="mx-auto text-emerald-400 mb-3" size={28} />
            <p className="text-2xl font-bold text-white">{networkStats.averageResponseTime}s</p>
            <p className="text-gray-400 text-sm">Avg Response</p>
          </div>
          <div className="modern-card gradient-rose p-6 text-center">
            <CheckCircle className="mx-auto text-rose-400 mb-3" size={28} />
            <p className="text-2xl font-bold text-white">{networkStats.successRate}%</p>
            <p className="text-gray-400 text-sm">Success Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Active Alerts */}
          <div className="xl:col-span-2">
            <div className="modern-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <AlertTriangle className="text-amber-400" size={24} />
                <h2 className="text-2xl font-bold text-white">Active Alerts</h2>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse ml-2"></div>
              </div>

              <div className="space-y-6">
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="modern-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="text-purple-400" size={24} />
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              </div>
              <div className="space-y-4">
                <button className="w-full btn-primary py-3 text-left flex items-center gap-3">
                  <Bell size={20} />
                  <span>Send Test Alert</span>
                </button>
                <button className="w-full btn-secondary py-3 text-left flex items-center gap-3">
                  <Radio size={20} />
                  <span>Check Network</span>
                </button>
                <button className="w-full btn-secondary py-3 text-left flex items-center gap-3">
                  <Users size={20} />
                  <span>View Subscribers</span>
                </button>
                <button className="w-full btn-secondary py-3 text-left flex items-center gap-3">
                  <Shield size={20} />
                  <span>System Status</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="modern-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-emerald-400" size={24} />
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              </div>
              <div className="space-y-4">
                <div className="modern-card gradient-emerald p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-emerald-400" size={16} />
                    <div>
                      <p className="text-emerald-200 text-sm font-medium">Child Found</p>
                      <p className="text-emerald-400 text-xs">Kavya Reddy - 2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="modern-card gradient-amber p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-amber-400" size={16} />
                    <div>
                      <p className="text-amber-200 text-sm font-medium">New Alert Issued</p>
                      <p className="text-amber-400 text-xs">Priya Sharma - 4 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="modern-card gradient-cyan p-4">
                  <div className="flex items-center gap-3">
                    <Users className="text-cyan-400" size={16} />
                    <div>
                      <p className="text-cyan-200 text-sm font-medium">Mass Alert Sent</p>
                      <p className="text-cyan-400 text-xs">15,847 recipients - 6 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Alert Modal */}
        {isCreatingAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="modern-card max-w-2xl w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create Emergency Alert</h2>
                <button
                  onClick={() => setIsCreatingAlert(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Alert Type
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'amber', label: 'AMBER Alert', desc: 'Critical' },
                      { value: 'silver', label: 'SILVER Alert', desc: 'High Priority' },
                      { value: 'general', label: 'General Alert', desc: 'Standard' }
                    ].map((type) => (
                      <div
                        key={type.value}
                        onClick={() => setNewAlert(prev => ({ ...prev, type: type.value }))}
                        className={`
                          modern-card p-4 cursor-pointer transition-all text-center
                          ${newAlert.type === type.value 
                            ? 'gradient-amber glow-amber' 
                            : 'hover:border-purple-500/50'
                          }
                        `}
                      >
                        <p className="text-white font-bold">{type.label}</p>
                        <p className="text-gray-400 text-sm">{type.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Alert Title *
                  </label>
                  <input
                    type="text"
                    value={newAlert.title}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="e.g., Missing Child - Urgent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Description *
                  </label>
                  <textarea
                    value={newAlert.description}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Detailed description of the missing person and circumstances"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newAlert.location}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Area or city where person was last seen"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsCreatingAlert(false)}
                    className="btn-secondary px-6 py-3"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAlert}
                    disabled={!newAlert.title || !newAlert.description || !newAlert.location}
                    className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Alert Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="modern-card max-w-3xl w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Alert Details</h2>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className={`modern-card ${getAlertTypeConfig(selectedAlert.type).bgClass} p-6`}>
                  <div className="flex items-center gap-4 mb-4">
                    <AlertTriangle className={getAlertTypeConfig(selectedAlert.type).textClass} size={32} />
                    <div>
                      <h3 className="text-white font-bold text-xl">{selectedAlert.title}</h3>
                      <p className={`font-medium ${getAlertTypeConfig(selectedAlert.type).textClass}`}>
                        {getAlertTypeConfig(selectedAlert.type).label}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-200 text-lg">{selectedAlert.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center modern-card p-4">
                    <Send className="mx-auto text-purple-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">{selectedAlert.alertsSent.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">Alerts Sent</p>
                  </div>
                  <div className="text-center modern-card p-4">
                    <Users className="mx-auto text-cyan-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">{selectedAlert.responses}</p>
                    <p className="text-gray-400 text-sm">Responses</p>
                  </div>
                  <div className="text-center modern-card p-4">
                    <CheckCircle className="mx-auto text-emerald-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">{selectedAlert.verifiedSightings}</p>
                    <p className="text-gray-400 text-sm">Verified Sightings</p>
                  </div>
                  <div className="text-center modern-card p-4">
                    <Zap className="mx-auto text-amber-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">{selectedAlert.confidence}%</p>
                    <p className="text-gray-400 text-sm">Confidence</p>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button className="btn-secondary px-6 py-3">
                    Update Alert
                  </button>
                  <button className="btn-primary px-6 py-3">
                    Resend Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyAlert;
