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
    { path: '/sightings', label: 'SIGHTINGS', icon: Eye, color: 'amber' },
    { path: '/age-progression', label: 'AGE_PROG', icon: Camera, color: 'purple' },
    { path: '/demo', label: 'LIVE_SIM', icon: Activity, color: 'amber' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/95 backdrop-blur-md border-b border-white/5 font-mono">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center min-h-[64px] sm:min-h-[72px] lg:h-20 py-2 lg:py-0">
          {/* Logo & ID */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 group flex-shrink-0">
            <div className="relative">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 border border-cyan-500/50 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-400 transition-colors">
                <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors" />
                <span className="text-cyan-400 font-black text-lg sm:text-xl relative z-10">ढ</span>
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base sm:text-lg lg:text-xl font-black hologram-text tracking-tighter text-white group-hover:text-cyan-400 transition-colors">DHUND_SYS</h1>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[7px] sm:text-[8px] text-slate-500 font-bold tracking-widest">NEURAL_GRID_ACTIVE</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-wrap justify-center max-w-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/');

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-2 xl:px-3 2xl:px-4 py-2 flex items-center gap-2 xl:gap-3 group transition-all
                    ${isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}
                  `}
                >
                  <Icon size={12} className="xl:w-[14px] xl:h-[14px] flex-shrink-0 ${isActive ? 'text-cyan-400' : 'group-hover:text-slate-300'}" />
                  <span className="text-[9px] xl:text-[10px] font-bold tracking-widest whitespace-nowrap">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-2 xl:left-3 2xl:left-4 right-2 xl:right-3 2xl:right-4 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  )}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </Link>
              );
            })}
          </nav>

          {/* System Status & Mobile Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 xl:space-x-6 flex-shrink-0">
            <div className="hidden xl:flex items-center gap-3 xl:gap-4 border-l border-white/10 pl-4 xl:pl-6">
              <div className="flex flex-col items-end">
                <span className="text-[7px] xl:text-[8px] text-slate-500 font-bold tracking-widest uppercase">Encryption</span>
                <span className="text-[9px] xl:text-[10px] text-emerald-500 font-bold tracking-tighter">MIL_STD_AES_256</span>
              </div>
              <Shield size={14} className="xl:w-4 xl:h-4 text-emerald-500/50 flex-shrink-0" />
            </div>

            <Link
              to="/emergency-alert"
              className="modern-card px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-rose-500/10 border-rose-500/40 text-rose-500 text-[9px] sm:text-[10px] font-bold tracking-widest hover:bg-rose-500 hover:text-white transition-all animate-pulse-glow flex items-center gap-1.5 sm:gap-2"
            >
              <AlertTriangle size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
              <span className="hidden sm:inline">EMERGENCY_ALERT</span>
              <span className="sm:hidden">ALERT</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-slate-400 hover:text-white p-2 flex-shrink-0"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/5 py-4 sm:py-6 bg-[#020617] overflow-hidden"
            >
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-4 border-l-2 transition-all
                        ${isActive
                          ? 'bg-cyan-500/5 border-cyan-500 text-cyan-400'
                          : 'border-transparent text-slate-500 hover:text-white hover:bg-white/5'
                        }
                        `}
                    >
                      <Icon size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                      <span className="text-xs font-bold tracking-widest">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
