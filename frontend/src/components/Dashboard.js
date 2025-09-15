import React, { useState, useEffect } from 'react';
import { Search, Users, MapPin, Clock, AlertTriangle, CheckCircle, TrendingUp, Activity, Camera, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    missingChildren: 2847,
    foundChildren: 1923,
    activeSearches: 156,
    communityReports: 4521,
    successRate: 67.8,
    avgResponseTime: 45
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'found', child: 'Priya Sharma', location: 'Mumbai', time: '2 hours ago', confidence: 94 },
    { id: 2, type: 'missing', child: 'Arjun Patel', location: 'Delhi', time: '4 hours ago', age: 7 },
    { id: 3, type: 'sighting', child: 'Rahul Kumar', location: 'Bangalore', time: '6 hours ago', status: 'verified' },
    { id: 4, type: 'found', child: 'Ananya Singh', location: 'Chennai', time: '8 hours ago', confidence: 87 },
    { id: 5, type: 'alert', child: 'Vikash Joshi', location: 'Pune', time: '1 day ago', priority: 'high' }
  ]);

  const [networkStatus, setNetworkStatus] = useState({
    totalCameras: 15847,
    activeCameras: 14923,
    scansPerHour: 2847,
    successfulMatches: 156
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeSearches: Math.max(0, prev.activeSearches + Math.floor(Math.random() * 3) - 1),
        communityReports: prev.communityReports + Math.floor(Math.random() * 5)
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
      case 'found': return <CheckCircle className="text-emerald-400" size={20} />;
      case 'missing': return <AlertTriangle className="text-rose-400" size={20} />;
      case 'sighting': return <MapPin className="text-amber-400" size={20} />;
      case 'alert': return <Activity className="text-purple-400" size={20} />;
      default: return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'found': return 'gradient-emerald';
      case 'missing': return 'gradient-rose';
      case 'sighting': return 'gradient-amber';
      case 'alert': return 'gradient-purple';
      default: return 'modern-card';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-3 h-3 bg-purple-500 rounded-full glow-purple"></div>
            <h1 className="text-5xl font-black text-gradient-purple">DHUND Control Center</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            Real-time monitoring and analytics for missing person detection across India
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <Link to="/report-missing" className="btn-primary flex items-center gap-3 px-6 py-3">
              <AlertTriangle size={20} />
              <span>Report Missing</span>
            </Link>
            <Link to="/search-network" className="btn-secondary flex items-center gap-3 px-6 py-3">
              <Camera size={20} />
              <span>CCTV Network</span>
            </Link>
            <Link to="/demo" className="btn-secondary flex items-center gap-3 px-6 py-3 glow-cyan">
              <Zap size={20} />
              <span>Live Demo</span>
            </Link>
          </div>
        </div>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <div className="modern-card gradient-rose p-8 text-center status-active">
            <div className="flex items-center justify-center mb-4">
              <Users className="text-rose-400" size={32} />
            </div>
            <h3 className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-2">Missing Children</h3>
            <p className="text-4xl font-black text-white mb-2">{stats.missingChildren.toLocaleString()}</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
              <p className="text-rose-400 text-sm font-medium">Active Cases</p>
            </div>
          </div>
          
          <div className="modern-card gradient-emerald p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="text-emerald-400" size={32} />
            </div>
            <h3 className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-2">Found Children</h3>
            <p className="text-4xl font-black text-white mb-2">{stats.foundChildren.toLocaleString()}</p>
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="text-emerald-400" size={16} />
              <p className="text-emerald-400 text-sm font-medium">This Month</p>
            </div>
          </div>
          
          <div className="modern-card gradient-amber p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Search className="text-amber-400" size={32} />
            </div>
            <h3 className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-2">Active Searches</h3>
            <p className="text-4xl font-black text-white mb-2">{stats.activeSearches}</p>
            <div className="flex items-center justify-center gap-2">
              <Activity className="text-amber-400" size={16} />
              <p className="text-amber-400 text-sm font-medium">In Progress</p>
            </div>
          </div>
          
          <div className="modern-card gradient-cyan p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="text-cyan-400" size={32} />
            </div>
            <h3 className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-2">Community Reports</h3>
            <p className="text-4xl font-black text-white mb-2">{stats.communityReports.toLocaleString()}</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              <p className="text-cyan-400 text-sm font-medium">This Week</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="modern-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-purple-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Success Metrics</h2>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Success Rate</span>
                  <span className="text-emerald-400 font-bold">{stats.successRate}%</span>
                </div>
                <div className="progress-bar h-3">
                  <div className="progress-fill h-3" style={{ width: `${stats.successRate}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Avg Response Time</span>
                  <span className="text-cyan-400 font-bold">{stats.avgResponseTime}s</span>
                </div>
                <div className="progress-bar h-3">
                  <div className="progress-fill h-3" style={{ width: `${(60 - stats.avgResponseTime) / 60 * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">AI Accuracy</span>
                  <span className="text-purple-400 font-bold">96.3%</span>
                </div>
                <div className="progress-bar h-3">
                  <div className="progress-fill h-3" style={{ width: '96.3%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="modern-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Camera className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Network Status</h2>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-2"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center modern-card p-4 gradient-cyan">
                <p className="text-3xl font-bold text-cyan-400 mb-1">{networkStatus.totalCameras.toLocaleString()}</p>
                <p className="text-gray-300 text-sm font-medium">Total Cameras</p>
              </div>
              <div className="text-center modern-card p-4 gradient-emerald">
                <p className="text-3xl font-bold text-emerald-400 mb-1">{networkStatus.activeCameras.toLocaleString()}</p>
                <p className="text-gray-300 text-sm font-medium">Active Cameras</p>
              </div>
              <div className="text-center modern-card p-4 gradient-amber">
                <p className="text-3xl font-bold text-amber-400 mb-1">{networkStatus.scansPerHour.toLocaleString()}</p>
                <p className="text-gray-300 text-sm font-medium">Scans/Hour</p>
              </div>
              <div className="text-center modern-card p-4 gradient-purple">
                <p className="text-3xl font-bold text-purple-400 mb-1">{networkStatus.successfulMatches}</p>
                <p className="text-gray-300 text-sm font-medium">Matches Today</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="modern-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="text-emerald-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Live Activity Feed</h2>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-2"></div>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className={`modern-card ${getActivityColor(activity.type)} p-6 animate-fade-in-up`}
                   style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getActivityIcon(activity.type)}
                    <div>
                      <p className="text-white font-semibold text-lg">
                        {activity.type === 'found' && `Child Found: ${activity.child}`}
                        {activity.type === 'missing' && `New Missing Report: ${activity.child}`}
                        {activity.type === 'sighting' && `Citizen Sighting: ${activity.child}`}
                        {activity.type === 'alert' && `Emergency Alert: ${activity.child}`}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-gray-400">{activity.location}</p>
                        <span className="text-gray-500">•</span>
                        <p className="text-gray-400">{activity.time}</p>
                        {activity.confidence && (
                          <>
                            <span className="text-gray-500">•</span>
                            <p className="text-emerald-400 font-medium">{activity.confidence}% confidence</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {activity.type === 'found' && <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">Found</span>}
                    {activity.type === 'missing' && <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-sm font-medium">Missing</span>}
                    {activity.type === 'sighting' && <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">Sighting</span>}
                    {activity.type === 'alert' && <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">Alert</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Section */}
        <div className="mt-12">
          <div className="modern-card gradient-rose p-10 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Emergency Helplines</h3>
            <p className="text-gray-300 mb-8 text-lg">24/7 Support for Missing Person Cases</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="modern-card p-6 gradient-amber">
                <p className="text-4xl font-black text-amber-400 mb-2">1098</p>
                <p className="text-gray-300 font-medium">Child Helpline</p>
              </div>
              <div className="modern-card p-6 gradient-cyan">
                <p className="text-4xl font-black text-cyan-400 mb-2">100</p>
                <p className="text-gray-300 font-medium">Police Emergency</p>
              </div>
              <div className="modern-card p-6 gradient-purple">
                <p className="text-4xl font-black text-purple-400 mb-2">181</p>
                <p className="text-gray-300 font-medium">Women Helpline</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;