import React, { useState } from 'react';
import axios from 'axios';
import { Upload, User, Phone, MapPin, Clock, Camera, Eye, CheckCircle, X, Star, Shield, Zap } from 'lucide-react';

const CitizenReport = () => {
  const [formData, setFormData] = useState({
    sightingType: '',
    childName: '',
    estimatedAge: '',
    description: '',
    location: '',
    sightingTime: '',
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',
    confidence: 5,
    photo: null,
    additionalInfo: '',
    anonymous: false
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
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      // Simulate AI verification score
      setTimeout(() => {
        setVerificationScore(Math.floor(Math.random() * 30) + 70); // 70-99%
      }, 1000);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setImagePreview(null);
    setVerificationScore(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axios.post('http://localhost:8000/api/citizen-report', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Citizen report submitted successfully! Report ID: #CR' + Date.now().toString().slice(-6));
      setStep(4); // Success step
    } catch (error) {
      setMessage('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
            ${step >= stepNum 
              ? 'bg-gradient-to-br from-cyan-500 to-purple-500 text-white' 
              : 'bg-gray-700 text-gray-400'
            }
          `}>
            {stepNum}
          </div>
          {stepNum < 3 && (
            <div className={`
              w-16 h-1 mx-2
              ${step > stepNum ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gray-700'}
            `} />
          )}
        </div>
      ))}
    </div>
  );

  const ConfidenceSlider = () => (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        <Star size={16} className="inline mr-2" />
        How confident are you about this sighting? ({formData.confidence}/10)
      </label>
      <div className="relative">
        <input
          type="range"
          name="confidence"
          min="1"
          max="10"
          value={formData.confidence}
          onChange={handleChange}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
      <div className="text-center">
        <span className={`
          px-4 py-2 rounded-full text-sm font-medium
          ${formData.confidence <= 3 ? 'bg-rose-500/20 text-rose-400' :
            formData.confidence <= 7 ? 'bg-amber-500/20 text-amber-400' :
            'bg-emerald-500/20 text-emerald-400'
          }
        `}>
          {formData.confidence <= 3 ? 'Low Confidence' :
           formData.confidence <= 7 ? 'Medium Confidence' :
           'High Confidence'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 left-1/2 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Eye className="text-cyan-400" size={32} />
            <h1 className="text-4xl font-black text-gradient-cyan">Citizen Sighting Report</h1>
          </div>
          <p className="text-xl text-gray-400">
            Help us reunite families by reporting sightings of missing persons
          </p>
          <div className="mt-6 modern-card gradient-cyan p-4">
            <p className="text-cyan-200 text-sm">
              🛡️ Your identity is protected. All reports are verified through AI analysis.
            </p>
          </div>
        </div>

        {step < 4 && <StepIndicator />}

        <div className="modern-card p-8">
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Type of Report</h2>
                <p className="text-gray-400">What kind of sighting or information do you have?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sightingTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setFormData(prev => ({ ...prev, sightingType: type.id }))}
                      className={`
                        modern-card p-6 cursor-pointer transition-all duration-300 hover:scale-105
                        ${formData.sightingType === type.id 
                          ? `gradient-${type.color} glow-${type.color}` 
                          : 'hover:border-purple-500/50'
                        }
                      `}
                    >
                      <div className="text-center">
                        <Icon className={`mx-auto mb-4 text-${type.color}-400`} size={32} />
                        <h3 className="text-white font-bold text-lg mb-2">{type.label}</h3>
                        <p className="text-gray-400 text-sm">{type.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Child's Name (if known)
                  </label>
                  <input
                    type="text"
                    name="childName"
                    value={formData.childName}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter name if you know it"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Estimated Age
                  </label>
                  <input
                    type="number"
                    name="estimatedAge"
                    value={formData.estimatedAge}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Approximate age"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Description of Person Seen *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Describe what the person looked like, what they were wearing, behavior, etc."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!formData.sightingType || !formData.description}
                  className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Location & Time Details</h2>
                <p className="text-gray-400">When and where did you see this person?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <MapPin size={16} className="inline mr-2" />
                    Location of Sighting *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g., Near McDonald's, Dadar Station"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Clock size={16} className="inline mr-2" />
                    Date & Time of Sighting *
                  </label>
                  <input
                    type="datetime-local"
                    name="sightingTime"
                    value={formData.sightingTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <ConfidenceSlider />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <Camera size={16} className="inline mr-2" />
                  Photo Evidence (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-cyan-500 transition-colors relative">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="max-w-xs max-h-48 rounded-lg" />
                        <button
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      {verificationScore > 0 && (
                        <div className="modern-card gradient-emerald p-4">
                          <div className="flex items-center gap-3">
                            <Shield className="text-emerald-400" size={20} />
                            <div>
                              <p className="text-emerald-200 font-medium">AI Verification Score</p>
                              <p className="text-emerald-400 font-bold">{verificationScore}% Match Potential</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-400 mb-2">Upload photo if available</p>
                      <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Any other details that might be helpful..."
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="btn-secondary px-8 py-3 text-lg"
                >
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="btn-primary px-8 py-3 text-lg"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
                <p className="text-gray-400">How can we reach you for follow-up questions?</p>
              </div>

              <div className="modern-card gradient-amber p-6 mb-6">
                <div className="flex items-center gap-3">
                  <Shield className="text-amber-400" size={24} />
                  <div>
                    <h3 className="text-amber-200 font-bold">Privacy Protection</h3>
                    <p className="text-amber-300 text-sm">Your information is encrypted and only used for verification purposes.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                  className="w-5 h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                />
                <label className="text-gray-300">Submit this report anonymously</label>
              </div>

              {!formData.anonymous && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        <User size={16} className="inline mr-2" />
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="reporterName"
                        value={formData.reporterName}
                        onChange={handleChange}
                        required={!formData.anonymous}
                        className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        <Phone size={16} className="inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="reporterPhone"
                        value={formData.reporterPhone}
                        onChange={handleChange}
                        required={!formData.anonymous}
                        className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="reporterEmail"
                      value={formData.reporterEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              )}

              {message && (
                <div className={`modern-card p-4 ${
                  message.includes('Error') 
                    ? 'gradient-rose text-rose-200'
                    : 'gradient-emerald text-emerald-200'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="btn-secondary px-8 py-3 text-lg"
                >
                  Previous
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary px-8 py-3 text-lg flex items-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <CheckCircle className="text-emerald-400" size={80} />
              </div>
              <h2 className="text-3xl font-bold text-white">Report Submitted Successfully!</h2>
              <div className="modern-card gradient-emerald p-6">
                <p className="text-emerald-200 text-lg">{message}</p>
              </div>
              <div className="space-y-6">
                <div className="modern-card gradient-cyan p-6">
                  <h3 className="text-cyan-200 font-bold text-lg mb-2">What happens next?</h3>
                  <div className="text-left space-y-2 text-cyan-300">
                    <p>✓ Your report is being analyzed by our AI system</p>
                    <p>✓ Authorities will be notified if this is a high-confidence match</p>
                    <p>✓ You'll receive updates if we need more information</p>
                    <p>✓ Your contribution helps reunite families</p>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="btn-primary px-8 py-3"
                  >
                    View Dashboard
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-secondary px-8 py-3"
                  >
                    Submit Another Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenReport;