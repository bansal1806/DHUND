import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Users, FileText, Target, AlertTriangle, Camera, Eye, Menu, X } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Target, color: 'purple' },
    { path: '/report-missing', label: 'Report Missing', icon: FileText, color: 'rose' },
    { path: '/search-network', label: 'Search Network', icon: Camera, color: 'cyan' },
    { path: '/citizen-report', label: 'Citizen Report', icon: Users, color: 'emerald' },
    { path: '/demo', label: 'Live Demo', icon: Eye, color: 'amber' },
  ];

  return (
    <header className="glass border-b border-gray-700/50 backdrop-blur-xl bg-black/30 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">ढ</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gradient-purple">DHUND</h1>
              <p className="text-gray-400 text-sm font-medium">AI-Powered Missing Person Detection</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/');
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 group
                    ${isActive
                      ? `gradient-${item.color} text-white shadow-lg glow-${item.color}`
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} className={isActive ? `text-${item.color}-200` : 'text-gray-400 group-hover:text-white'} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Emergency Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              to="/emergency-alert"
              className="btn-primary flex items-center gap-3 px-6 py-3 animate-pulse-glow"
            >
              <AlertTriangle size={20} />
              <span className="hidden sm:inline">Emergency Alert</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-700/50 pt-4 pb-6">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/');
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive
                        ? `gradient-${item.color} text-white`
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
