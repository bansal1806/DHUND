import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, User, Phone, MapPin, Clock, Camera, Eye, CheckCircle, X, Star, Shield, Zap, Terminal, Activity } from 'lucide-react';
import { apiUrl } from '../config/api';
import apiService from '../services/apiService';

const CitizenReport = () => {
  const [missingPersons, setMissingPersons] = useState([]);
  const [loadingPersons, setLoadingPersons] = useState(false);
  const [formData, setFormData] = useState({
    person_id: '',
    description: '',
    location: '',
    reporter_phone: '',
    photo: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [verificationScore, setVerificationScore] = useState(0);

  const sightingTypes = [
    { id: 'direct', label: 'Direct Sighting', desc: 'I saw the missing person directly', icon: Eye, color: 'emerald' },
    { id: 'photo', label: 'Photo Evidence', desc: 'I have a photo that might match', icon: Camera, color: 'cyan' },
    { id: 'information', label: 'Helpful Information', desc: 'I have relevant information', icon: Zap, color: 'purple' },
    { id: 'suspicious', label: 'Suspicious Activity', desc: 'Something seemed unusual', icon: Shield, color: 'amber' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      setTimeout(() => {
        setVerificationScore(Math.floor(Math.random() * 30) + 70);
      }, 1000);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setImagePreview(null);
    setVerificationScore(0);
  };

  // Load missing persons on mount
  useEffect(() => {
    const loadMissingPersons = async () => {
      setLoadingPersons(true);
      try {
        const response = await apiService.getMissingPersons();
        if (response.status === 'success') {
          setMissingPersons(response.data || []);
        }
      } catch (error) {
        console.error('Error loading missing persons:', error);
      } finally {
        setLoadingPersons(false);
      }
    };
    loadMissingPersons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Validate required fields - backend expects: person_id, location, description, reporter_phone, sighting_photo
    if (!formData.person_id || !formData.location || !formData.description || !formData.reporter_phone || !formData.photo) {
      setMessage('Error: Please fill in all required fields (Missing Person, Location, Description, Phone, and Photo)');
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('person_id', parseInt(formData.person_id));
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('reporter_phone', formData.reporter_phone);
      formDataToSend.append('sighting_photo', formData.photo);

      const response = await axios.post(apiUrl('api/citizen-report'), formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        const confidence = response.data.verification?.confidence || 0;
        setMessage(`Citizen report submitted successfully! Report ID: #${response.data.report_id}. Verification confidence: ${(confidence * 100).toFixed(1)}%`);
        setStep(4);
      } else {
        setMessage('Error submitting report. Please try again.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Error submitting report. Please try again.';
      setMessage(`Error: ${errorMsg}`);
      console.error('Citizen report submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const FuiCorner = () => (
    <>
      <div className="fui-corner fui-corner-tl" />
      <div className="fui-corner fui-corner-tr" />
      <div className="fui-corner fui-corner-bl" />
      <div className="fui-corner fui-corner-br" />
    </>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-16 relative">
      <div className="absolute inset-x-0 h-px bg-slate-800 top-1/2 -z-10" />
      {[1, 2, 3].map((stepNum) => (
        <div key={stepNum} className="flex items-center mx-10 relative">
          <motion.div
            animate={{
              scale: step >= stepNum ? 1.1 : 1,
              borderColor: step >= stepNum ? '#22d3ee' : '#1e293b'
            }}
            className={`
                w-12 h-12 border-2 flex items-center justify-center bg-[#020617] relative z-10
                ${step >= stepNum ? 'text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-slate-600'}
            `}
          >
            <FuiCorner />
            <span className="font-black text-sm">{stepNum.toString().padStart(2, '0')}</span>
          </motion.div>
          {step === stepNum && (
            <motion.div
              layoutId="active-step-glow"
              className="absolute inset-0 bg-cyan-500/10 blur-xl -z-10"
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-mono selection:bg-cyan-500/30">
      <div className="hud-overlay" />
      <div className="scanline" />
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-12">
        {/* Header HUD */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-1 border border-cyan-500/30 bg-cyan-500/5 mb-6">
            <Activity size={14} className="text-cyan-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-500">INITIATE_SIGHTING_PROTOCOL</span>
          </div>
          <h1 className="text-5xl font-black hologram-text mb-4">CITIZEN_ENTRY</h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-mono">
            Contribute to the neural grid. Every data point accelerates recovery.
            Verified identities ensure rapid response.
          </p>
        </div>

        {step < 4 && <StepIndicator />}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="modern-card p-10 bg-black/40 border-slate-800"
          >
            <FuiCorner />

            {step === 1 && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sightingTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setFormData(prev => ({ ...prev, sightingType: type.id }))}
                        className={`
                          modern-card p-6 cursor-pointer transition-all border-slate-800 bg-slate-900/10 relative group
                          ${formData.sightingType === type.id
                            ? 'border-cyan-500/50 bg-cyan-500/5'
                            : 'hover:border-slate-600'
                          }
                        `}
                      >
                        <FuiCorner />
                        <div className="flex gap-4 items-center">
                          <div className={`p-3 border border-${type.color}-500/30 ${formData.sightingType === type.id ? `bg-${type.color}-500/20` : 'bg-black/40'}`}>
                            <Icon className={`text-${type.color}-500`} size={24} />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-xs tracking-widest">{type.label.toUpperCase()}</h3>
                            <p className="text-slate-500 text-[10px] mt-1">{type.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-6 border-t border-slate-800/50">
                  <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Missing Person *</label>
                  {loadingPersons ? (
                    <div className="px-4 py-4 bg-black/40 border border-slate-800 text-slate-500 text-sm">Loading missing persons...</div>
                  ) : (
                    <select
                      name="person_id"
                      value={formData.person_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-black/40 border border-slate-800 text-cyan-400 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                    >
                      <option value="">Select Missing Person</option>
                      {missingPersons.map((person) => (
                        <option key={person.id} value={person.id} className="bg-slate-900">
                          {person.name} (Age: {person.age})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Subject Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-6 py-4 bg-black/40 border border-slate-800 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                    placeholder="ENTER_VISUAL_DATA_HERE..."
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={nextStep}
                    disabled={!formData.person_id || !formData.description}
                    className="modern-card px-10 py-3 bg-cyan-500/10 border-cyan-500/40 text-cyan-400 text-xs font-bold tracking-widest hover:bg-cyan-500 hover:text-white disabled:opacity-30 transition-all uppercase"
                  >
                    Proceed_to_Location
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Spatial Coordinates *</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-slate-800 text-cyan-400 placeholder-slate-700 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                        placeholder="GEO_LOCATION_REF"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Temporal Marker *</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                      <input
                        type="datetime-local"
                        name="sightingTime"
                        value={formData.sightingTime}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-slate-800 text-cyan-400 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-800/50">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Signal Confidence</label>
                    <span className="text-xl font-black hologram-text text-cyan-400">{formData.confidence}/10</span>
                  </div>
                  <input
                    type="range"
                    name="confidence"
                    min="1"
                    max="10"
                    value={formData.confidence}
                    onChange={handleChange}
                    className="w-full h-1 bg-slate-900 appearance-none cursor-pointer range-cyan"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Visual Evidence Upload</label>
                  <div className="border border-dashed border-slate-800 bg-black/20 p-8 text-center relative group hover:border-cyan-500/30 transition-all">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="max-w-xs max-h-48 grayscale hover:grayscale-0 transition-all border border-slate-700" />
                        <div className="absolute inset-0 border border-cyan-500/20 pointer-events-none" />
                        <button onClick={removeImage} className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500/20 border border-rose-500/50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-6">
                        <Camera className="mx-auto text-slate-700 mb-4 group-hover:text-cyan-500 transition-colors" size={40} />
                        <p className="text-slate-500 text-[10px] tracking-widest">DRAG_DROP_OR_CLICK_TO_UPLOAD</p>
                      </div>
                    )}
                    <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={prevStep} className="text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest">Back</button>
                  <button onClick={nextStep} className="modern-card px-10 py-3 bg-cyan-500/10 border-cyan-500/40 text-cyan-400 text-xs font-bold tracking-widest hover:bg-cyan-500 hover:text-white transition-all uppercase">Enter_Contact_Data</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10">
                <div className="modern-card p-4 border-amber-500/30 bg-amber-500/5 flex gap-4 items-center">
                  <Shield size={20} className="text-amber-500" />
                  <div>
                    <div className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">Neural Privacy Active</div>
                    <p className="text-amber-700 text-[8px] font-mono">Your identification vector is hashed and stored separately from report data.</p>
                  </div>
                </div>

                <div className="space-y-8 pt-6 border-t border-slate-800/50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Neural Link (Phone) *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                      <input
                        type="tel"
                        name="reporter_phone"
                        value={formData.reporter_phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-slate-800 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
                        placeholder="+91_MOBILE_HASH"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={prevStep} className="text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest">Back</button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="modern-card px-12 py-4 bg-emerald-500/10 border-emerald-500/40 text-emerald-400 text-xs font-bold tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all uppercase flex items-center gap-3"
                  >
                    {isSubmitting ? <Activity size={16} className="animate-spin" /> : <Terminal size={16} />}
                    {isSubmitting ? 'UPLOADING_DATA...' : 'COMMIT_REPORT'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CitizenReport;