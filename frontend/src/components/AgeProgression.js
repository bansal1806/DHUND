import React, { useState, useEffect } from 'react';
import { Camera, User, Upload, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import apiService from '../services/apiService';

const AgeProgression = () => {
  const [missingPersons, setMissingPersons] = useState([]);
  const [usePersonId, setUsePersonId] = useState(true);
  const [formData, setFormData] = useState({
    person_id: '',
    current_age: '',
    target_age: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPersons, setLoadingPersons] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (usePersonId) {
      loadMissingPersons();
    }
  }, [usePersonId]);

  const loadMissingPersons = async () => {
    try {
      setLoadingPersons(true);
      const response = await apiService.getMissingPersons();
      if (response.status === 'success') {
        setMissingPersons(response.data || []);
      }
    } catch (err) {
      console.error('Error loading missing persons:', err);
    } finally {
      setLoadingPersons(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResults(null);

    if (usePersonId && !formData.person_id) {
      setError('Please select a missing person');
      return;
    }

    if (!usePersonId && !photoFile) {
      setError('Please upload a photo');
      return;
    }

    if (!formData.current_age || !formData.target_age) {
      setError('Please enter both current and target ages');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      if (usePersonId) {
        formDataToSend.append('person_id', formData.person_id);
      } else {
        formDataToSend.append('photo', photoFile);
      }
      formDataToSend.append('current_age', formData.current_age);
      formDataToSend.append('target_age', formData.target_age);

      const response = await apiService.generateAgeProgression(formDataToSend);

      if (response.status === 'success') {
        setResults(response);
      } else {
        setError('Failed to generate age progression');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-10">
        {/* Header HUD */}
        <div className="mb-8 sm:mb-12 border-b border-cyan-500/20 pb-6 sm:pb-8">
          <div className="flex items-center gap-3 mb-2">
            <Camera size={18} className="text-cyan-500" />
            <span className="text-[10px] font-bold text-cyan-500 tracking-[0.2em]">AGE_PROGRESSION_ENGINE_v2.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black hologram-text text-white">AGE_PROGRESSION</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-xl font-mono">
            Generate AI-powered age progression images for missing persons.
          </p>
        </div>

        <div className="modern-card p-6 sm:p-8 bg-black/40 border-slate-800">
          <FuiCorner />

          {/* Toggle between Person ID and Photo Upload */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => {
                setUsePersonId(true);
                setPhotoFile(null);
                setPhotoPreview(null);
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all text-sm ${
                usePersonId
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Use Existing Person
            </button>
            <button
              onClick={() => {
                setUsePersonId(false);
                setFormData(prev => ({ ...prev, person_id: '' }));
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all text-sm ${
                !usePersonId
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <Camera className="h-4 w-4 inline mr-2" />
              Upload Photo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Person Selection or Photo Upload */}
            {usePersonId ? (
              <div>
                <label className="block text-white/80 mb-2 text-sm font-semibold">Missing Person *</label>
                {loadingPersons ? (
                  <div className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-500 text-sm">
                    Loading...
                  </div>
                ) : (
                  <select
                    name="person_id"
                    value={formData.person_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Select a missing person</option>
                    {missingPersons.map((person) => (
                      <option key={person.id} value={person.id} className="bg-slate-900">
                        {person.name} (Age: {person.age})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-white/80 mb-2 text-sm font-semibold">Photo *</label>
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-12 w-12 text-slate-500 mb-4" />
                      <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-slate-500">PNG, JPG, JPEG</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            )}

            {/* Current Age */}
            <div>
              <label className="block text-white/80 mb-2 text-sm font-semibold">Current Age *</label>
              <input
                type="number"
                name="current_age"
                value={formData.current_age}
                onChange={handleInputChange}
                required
                min="1"
                max="120"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter current age"
              />
            </div>

            {/* Target Age */}
            <div>
              <label className="block text-white/80 mb-2 text-sm font-semibold">Target Age *</label>
              <input
                type="number"
                name="target_age"
                value={formData.target_age}
                onChange={handleInputChange}
                required
                min="1"
                max="120"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter target age"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-2 text-red-300">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5" />
                  <span>Generate Age Progression</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {results && (
          <div className="modern-card p-6 sm:p-8 bg-black/40 border-slate-800 mt-8">
            <FuiCorner />
            <h2 className="text-2xl font-bold text-white mb-6">Age Progression Results</h2>
            {results.progression_images && results.progression_images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.progression_images.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                      <img
                        src={image}
                        alt={`Progression ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%231e293b" width="400" height="400"/%3E%3Ctext fill="%2364758b" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Not Available%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <p className="text-slate-400 text-sm text-center">
                      {results.scenarios && results.scenarios[index] 
                        ? results.scenarios[index] 
                        : `Scenario ${index + 1}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No progression images generated</p>
            )}
            {results.confidence && (
              <div className="mt-6 p-4 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                <p className="text-white">
                  <span className="font-semibold">Confidence:</span> {(results.confidence * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeProgression;

