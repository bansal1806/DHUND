import React, { useState, useEffect } from 'react';
import { Eye, Clock, MapPin, Phone, AlertCircle, CheckCircle, Shield, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';

const Sightings = () => {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSightings();
  }, []);

  const loadSightings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSightings();
      if (response.status === 'success') {
        setSightings(response.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load sightings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    return `${window.location.protocol}//${window.location.host}${photoPath}`;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.7) return 'text-emerald-400';
    if (confidence >= 0.4) return 'text-amber-400';
    return 'text-red-400';
  };

  const FuiCorner = () => (
    <>
      <div className="fui-corner fui-corner-tl" />
      <div className="fui-corner fui-corner-tr" />
      <div className="fui-corner fui-corner-bl" />
      <div className="fui-corner fui-corner-br" />
    </>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-mono selection:bg-cyan-500/30">
      <div className="hud-overlay" />
      <div className="scanline" />
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-10">
        {/* Header HUD */}
        <div className="mb-8 sm:mb-12 border-b border-cyan-500/20 pb-6 sm:pb-8">
          <div className="flex items-center gap-3 mb-2">
            <Eye size={18} className="text-cyan-500" />
            <span className="text-[10px] font-bold text-cyan-500 tracking-[0.2em]">CITIZEN_REPORTS_v1.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black hologram-text text-white">SIGHTINGS_REGISTRY</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-xl font-mono">
            All citizen-reported sightings with AI verification scores.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="text-slate-500 mt-4 text-sm">LOADING_SIGHTINGS_DATA...</p>
          </div>
        ) : error ? (
          <div className="modern-card p-6 border-red-500/50 bg-red-500/5">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          </div>
        ) : sightings.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="h-16 w-16 text-slate-500/40 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">NO_SIGHTINGS_REPORTED</p>
            <Link to="/citizen-report" className="inline-block mt-4 modern-card px-6 py-3 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10">
              REPORT_SIGHTING
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sightings.map((sighting) => (
              <div
                key={sighting.id}
                className="modern-card p-6 border-slate-800/50 hover:border-cyan-500/20 transition-all"
              >
                <FuiCorner />
                <div className="flex flex-col md:flex-row gap-6">
                  {sighting.sighting_photo && (
                    <div className="flex-shrink-0">
                      <div className="w-full md:w-64 h-64 rounded-lg overflow-hidden bg-black/40 border border-slate-800">
                        <img
                          src={getImageUrl(sighting.sighting_photo)}
                          alt="Sighting"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-xl mb-2">
                          SIGHTING_ID: #{sighting.id}
                        </h3>
                        <p className="text-white/60">PERSON_ID: {sighting.person_id}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        sighting.verification_score >= 0.7
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : sighting.verification_score >= 0.4
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {sighting.verification_score >= 0.7 ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>VERIFIED</span>
                          </span>
                        ) : (
                          'PENDING_REVIEW'
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-slate-500 text-xs font-bold tracking-wider uppercase mb-1">LOCATION</p>
                          <p className="text-white">{sighting.location}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-slate-500 text-xs font-bold tracking-wider uppercase mb-1">REPORTER</p>
                          <p className="text-white">{sighting.reporter_phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-slate-500 text-xs font-bold tracking-wider uppercase mb-1">REPORTED</p>
                          <p className="text-white text-sm">{formatDate(sighting.report_time)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Activity className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-slate-500 text-xs font-bold tracking-wider uppercase mb-1">AI_CONFIDENCE</p>
                          <p className={`font-semibold text-lg ${getConfidenceColor(sighting.verification_score)}`}>
                            {(sighting.verification_score * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {sighting.description && (
                      <div>
                        <p className="text-slate-500 text-xs font-bold tracking-wider uppercase mb-2">DESCRIPTION</p>
                        <p className="text-white/80">{sighting.description}</p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800/50">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        sighting.status === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : sighting.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        STATUS: {sighting.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sightings;

