import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, FileText, Target, AlertTriangle, Camera, Eye, Menu, X, Activity, Shield } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'DASHBOARD', icon: Target, color: 'purple' },
    { path: '/report-missing', label: 'REPORT_MISSING', icon: FileText, color: 'rose' },
    { path: '/search-network', label: 'SURVEILLANCE', icon: Camera, color: 'cyan' },
    { path: '/citizen-report', label: 'CITIZEN_ENTRY', icon: Users, color: 'emerald' },
    { path: '/demo', label: 'LIVE_SIM', icon: Eye, color: 'amber' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & ID */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-10 h-10 border border-cyan-500/50 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-400 transition-colors">
                <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors" />
                <span className="text-cyan-400 font-black text-xl relative z-10">ढ</span>
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black hologram-text tracking-tighter text-white group-hover:text-cyan-400 transition-colors">DHUND_SYS</h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[8px] text-slate-500 font-bold tracking-widest">NEURAL_GRID_ACTIVE</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/');

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-4 py-2 flex items-center gap-3 group transition-all
                    ${isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}
                  `}
                >
                  <Icon size={14} className={isActive ? 'text-cyan-400' : 'group-hover:text-slate-300'} />
                  <span className="text-[10px] font-bold tracking-widest">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  )}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </Link>
              );
            })}
          </nav>

          {/* System Status & Mobile Toggle */}
          <div className="flex items-center space-x-6">
            <div className="hidden xl:flex items-center gap-4 border-l border-white/10 pl-6">
              <div className="flex flex-col items-end">
                <span className="text-[8px] text-slate-500 font-bold tracking-widest uppercase">Encryption</span>
                <span className="text-[10px] text-emerald-500 font-bold tracking-tighter">MIL_STD_AES_256</span>
              </div>
              <Shield size={16} className="text-emerald-500/50" />
            </div>

            <Link
              to="/emergency-alert"
              className="modern-card px-4 py-2 bg-rose-500/10 border-rose-500/40 text-rose-500 text-[10px] font-bold tracking-widest hover:bg-rose-500 hover:text-white transition-all animate-pulse-glow flex items-center gap-2"
            >
              <AlertTriangle size={14} />
              <span className="hidden sm:inline">EMERGENCY_ALERT</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-slate-400 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-white/5 py-6 bg-[#020617]">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center space-x-4 px-4 py-4 border-l-2 transition-all
                        ${isActive
                          ? 'bg-cyan-500/5 border-cyan-500 text-cyan-400'
                          : 'border-transparent text-slate-500 hover:text-white hover:bg-white/5'
                        }
                        `}
                    >
                      <Icon size={18} />
                      <span className="text-xs font-bold tracking-widest">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
