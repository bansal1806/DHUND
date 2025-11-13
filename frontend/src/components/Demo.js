import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Search, User, MapPin, Camera, Scan, Eye } from 'lucide-react';
import axios from 'axios';
import SimpleFaceModel from './SimpleFaceModel';
import { apiUrl } from '../config/api';

const Demo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [faceScanActive, setFaceScanActive] = useState(false);
  const [cctvScanActive, setCctvScanActive] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const animationRef = useRef();
  const [demoData, setDemoData] = useState({
    missingChild: {
      name: 'Priya Sharma',
      age: 8,
      description: 'Last seen wearing red dress with white flowers',
      photo: '/demo/priya_original.jpg'
    },
    results: null
  });

  // Continuous 3D animation loop
  useEffect(() => {
    const animate = () => {
      setAnimationTime(Date.now() * 0.001);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const demoSteps = [
    {
      title: "Missing Child Report",
      description: "Family reports 8-year-old Priya missing from Mumbai",
      icon: User,
      color: "bg-red-500",
      details: "Last seen wearing red dress with white flowers, carrying pink backpack"
    },
    {
      title: "AI Age Progression",
      description: "DHUND generates current appearance predictions",
      icon: Search,
      color: "bg-blue-500",
      details: "12 variations generated accounting for 6 months of growth and conditions"
    },
    {
      title: "Geo-Fenced Search",
      description: "Smart search zones deployed based on behavioral patterns",
      icon: MapPin,
      color: "bg-yellow-500",
      details: "Railway stations (HIGH), Bus terminals (MEDIUM), Markets (LOW priority)"
    },
    {
      title: "CCTV Network Scan",
      description: "Multi-modal recognition across 1,247 cameras",
      icon: Camera,
      color: "bg-purple-500",
      details: "Facial + gait + clothing recognition in crowded environments"
    },
    {
      title: "Match Found!",
      description: "94% confidence match at Dadar Railway Station",
      icon: CheckCircle,
      color: "bg-green-500",
      details: "Authorities notified, family alerted, rescue team dispatched"
    }
  ];

  const runDemo = async () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setScanningProgress(0);
    setFaceScanActive(false);
    setCctvScanActive(false);

    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      
      // Step 1: Face scanning animation
      if (i === 1) {
        setFaceScanActive(true);
        // Simulate progress scanning
        for (let progress = 0; progress <= 100; progress += 10) {
          setScanningProgress(progress);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        setFaceScanActive(false);
      }
      
      // Step 3: CCTV scanning animation
      if (i === 3) {
        setCctvScanActive(true);
        setScanningProgress(0);
        // Simulate CCTV scanning with faster progress
        for (let progress = 0; progress <= 100; progress += 5) {
          setScanningProgress(progress);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        setCctvScanActive(false);
      }
      
      if (i === 4) { // Match found step
        try {
          const response = await axios.post(apiUrl('api/demo-match'), null, {
            params: { person_id: 1 }
          });
          setDemoData(prev => ({
            ...prev,
            results: response.data.match_details
          }));
        } catch (error) {
          console.error('Demo API call failed:', error);
          // Set mock data for demo
          setDemoData(prev => ({
            ...prev,
            results: {
              match_found: true,
              confidence: 94.5,
              location: "Dadar Railway Station, Mumbai",
              timestamp: new Date().toISOString(),
              alerts_sent: {
                police: true,
                family: true,
                nearby_citizens: true
              }
            }
          }));
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setIsPlaying(false);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setScanningProgress(0);
    setFaceScanActive(false);
    setCctvScanActive(false);
    setDemoData(prev => ({
      ...prev,
      results: null
    }));
  };

  const StepCard = ({ step, index, isActive, isCompleted }) => {
    const Icon = step.icon;
    
    return (
      <div className={`
        modern-card p-6 transition-all duration-500 transform relative overflow-hidden
        ${isActive 
          ? 'status-active scale-105 glow-cyan' 
          : isCompleted 
            ? 'border-emerald-500/30 glow-emerald' 
            : 'hover:border-purple-500/30'
        }
      `}>
        {/* Progress indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent">
          {isActive && (
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse"></div>
          )}
          {isCompleted && (
            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400"></div>
          )}
        </div>

        <div className="flex items-start space-x-6">
          <div className={`
            flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center relative
            ${isActive 
              ? 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white animate-pulse-glow' 
              : isCompleted 
                ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white' 
                : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400'
            }
          `}>
            {isCompleted ? <CheckCircle size={28} /> : <Icon size={28} />}
            
            {/* Step number badge */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-black border border-gray-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{index + 1}</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`
              font-bold text-xl mb-3 
              ${isActive 
                ? 'text-gradient-cyan' 
                : isCompleted 
                  ? 'text-emerald-400' 
                  : 'text-white'
              }
            `}>
              {step.title}
            </h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              {step.description}
            </p>
            {step.details && (
              <div className="bg-black/30 rounded-lg p-3 border border-gray-700/50">
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.details}
                </p>
              </div>
            )}
            
            {/* Status indicator */}
            <div className="flex items-center gap-2 mt-4">
              <div className={`
                w-3 h-3 rounded-full
                ${isActive 
                  ? 'bg-cyan-400 animate-pulse' 
                  : isCompleted 
                    ? 'bg-emerald-400' 
                    : 'bg-gray-600'
                }
              `}></div>
              <span className={`
                text-sm font-medium
                ${isActive 
                  ? 'text-cyan-400' 
                  : isCompleted 
                    ? 'text-emerald-400' 
                    : 'text-gray-500'
                }
              `}>
                {isActive ? 'Processing...' : isCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Modern Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="mb-8">
            <h1 className="text-6xl lg:text-8xl font-black mb-6">
              <span className="text-gradient-purple">DHUND</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full mb-8"></div>
            <p className="text-3xl lg:text-4xl text-gradient-cyan font-light mb-4">
              AI-Powered Missing Person Detection
            </p>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Advanced facial recognition with movie-quality 3D analysis and real-time CCTV network scanning
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
            <button
              onClick={runDemo}
              disabled={isPlaying}
              className="btn-primary flex items-center space-x-4 px-10 py-5 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed min-w-[240px] animate-pulse-glow"
            >
              {isPlaying ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Play size={28} />
                  <span>Start Demo</span>
                </>
              )}
            </button>
            <button
              onClick={resetDemo}
              className="btn-secondary flex items-center space-x-4 px-10 py-5 text-xl font-bold min-w-[200px]"
            >
              <RotateCcw size={24} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Modern Demo Steps */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-16">
          {/* Enhanced Steps List */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-12 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-white">Demo Process</h2>
            </div>
            {demoSteps.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                index={index}
                isActive={currentStep === index && isPlaying}
                isCompleted={currentStep > index || (currentStep === index && !isPlaying && index === demoSteps.length - 1)}
              />
            ))}
          </div>

          {/* Enhanced Demo Visualization */}
          <div className="modern-card rounded-2xl p-8 min-h-[600px]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-3 h-3 bg-cyan-500 rounded-full glow-cyan"></div>
              <h2 className="text-3xl font-bold text-white">Live Analysis</h2>
            </div>
          
            {/* Modern Missing Child Profile */}
            <div className="mb-8">
              <div className="gradient-rose rounded-2xl p-6 border-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                  <h3 className="text-white font-bold text-lg">Missing Child Profile</h3>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="relative w-20 h-20 bg-black rounded-xl flex items-center justify-center overflow-hidden border border-gray-700">
                    {/* Movie-Quality 3D Face Model */}
                    <SimpleFaceModel 
                      scanningProgress={scanningProgress}
                      isScanning={faceScanActive}
                      size="small"
                    />
                    
                    {/* Fallback icon when Three.js fails */}
                    {!faceScanActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <User size={32} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-xl mb-2">{demoData.missingChild.name}</p>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Age:</span>
                        <span className="text-white font-medium">{demoData.missingChild.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Status:</span>
                        <span className="text-rose-400 font-medium">Missing</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mt-3 leading-relaxed">{demoData.missingChild.description}</p>
                    {faceScanActive && (
                      <div className="mt-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                          <span className="text-cyan-400 font-medium">Facial Analysis Active</span>
                        </div>
                        <div className="progress-bar h-3 mb-2">
                          <div 
                            className="progress-fill h-3"
                            style={{ width: `${scanningProgress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Processing...</span>
                          <span className="text-cyan-400 font-bold">{scanningProgress}%</span>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Large 3D Face Scanning Display */}
          {faceScanActive && (
            <div className="mb-6">
              <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Eye size={20} className="text-blue-400 mr-2" />
                  Movie-Quality 3D Facial Analysis
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Movie-Quality Large 3D Face Model */}
                  <div className="relative h-64 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    <SimpleFaceModel 
                      scanningProgress={scanningProgress}
                      isScanning={faceScanActive}
                      size="large"
                    />
                  </div>
                  
                  {/* Analysis Data Panel */}
                  <div className="space-y-4">
                    <div className="text-sm text-blue-200 space-y-3">
                      <div className="flex justify-between">
                        <span>Facial Landmarks Detected</span>
                        <span className="text-cyan-400">{Math.min(Math.floor(scanningProgress * 68 / 100), 68)} / 68</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Eye Detection Confidence</span>
                        <span className="text-green-400">{Math.min(Math.floor(scanningProgress * 0.98), 98)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nose Bridge Mapping</span>
                        <span className="text-yellow-400">{Math.min(Math.floor(scanningProgress * 0.94), 94)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mouth Contour Analysis</span>
                        <span className="text-purple-400">{Math.min(Math.floor(scanningProgress * 0.91), 91)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Facial Symmetry Score</span>
                        <span className="text-pink-400">{Math.min(Math.floor(scanningProgress * 0.87), 87)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3D Depth Mapping</span>
                        <span className="text-indigo-400">{Math.min(Math.floor(scanningProgress * 0.92), 92)}%</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-blue-400/30">
                      <div className="text-xs text-blue-300 mb-2">Biometric Encoding Status</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`p-2 rounded ${scanningProgress > 20 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          Geometry ✓
                        </div>
                        <div className={`p-2 rounded ${scanningProgress > 40 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          Texture ✓
                        </div>
                        <div className={`p-2 rounded ${scanningProgress > 60 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          Proportions ✓
                        </div>
                        <div className={`p-2 rounded ${scanningProgress > 80 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          Encoding ✓
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CCTV Scanning Visual */}
          {cctvScanActive && (
            <div className="mb-6">
              <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Camera size={20} className="text-purple-400 mr-2" />
                  Live CCTV Scanning
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[1, 2, 3, 4].map((cam) => (
                    <div key={cam} className="relative bg-black rounded-lg aspect-video overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black">
                        <div className="absolute top-2 left-2 text-green-400 text-xs font-mono">
                          CAM-{cam.toString().padStart(3, '0')}
                        </div>
                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        
                        {/* Scanning lines */}
                        <div className="absolute inset-0">
                          <div className="absolute w-full h-0.5 bg-green-400/50 animate-pulse"
                               style={{ 
                                 top: `${(scanningProgress * 0.8)}%`,
                                 transition: 'top 0.1s linear'
                               }}>
                          </div>
                          <div className="absolute w-0.5 h-full bg-green-400/50 animate-pulse"
                               style={{ 
                                 left: `${(scanningProgress * 0.8)}%`,
                                 transition: 'left 0.1s linear'
                               }}>
                          </div>
                        </div>

                        {/* Simulated crowd/people shapes */}
                        <div className="absolute bottom-4 left-4 w-3 h-6 bg-gray-600 rounded-full opacity-60"></div>
                        <div className="absolute bottom-4 right-6 w-2 h-5 bg-gray-600 rounded-full opacity-60"></div>
                        <div className="absolute bottom-4 left-1/2 w-2 h-4 bg-gray-600 rounded-full opacity-60"></div>
                        
                        {/* Match detection box */}
                        {scanningProgress > 70 && cam === 2 && (
                          <div className="absolute bottom-4 right-8 w-4 h-8 border-2 border-yellow-400 rounded animate-pulse">
                            <div className="absolute -top-6 -left-2 text-yellow-400 text-xs font-mono animate-bounce">
                              MATCH
                            </div>
                            <div className="absolute inset-0 bg-yellow-400/20 rounded animate-pulse"></div>
                            {/* Match confidence indicator */}
                            <div className="absolute -bottom-4 -left-4 text-yellow-400 text-xs font-mono">
                              94%
                            </div>
                          </div>
                        )}
                        
                        {/* Scanning overlay effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/10 to-transparent"
                             style={{ 
                               transform: `translateY(${(scanningProgress * 0.8)}%)`,
                               transition: 'transform 0.1s linear',
                               height: '20%'
                             }}>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Cameras Active</span>
                    <span className="text-white">1,247 / 1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Scanning Progress</span>
                    <span className="text-yellow-400">{scanningProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-yellow-400 h-3 rounded-full transition-all duration-50"
                      style={{ width: `${scanningProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">Recognition Mode</span>
                    <span className="text-yellow-400">Face + Gait + Clothing</span>
                  </div>
                  
                  {/* Live scanning details */}
                  <div className="mt-3 pt-3 border-t border-purple-400/30">
                    <div className="text-xs text-purple-200 space-y-1">
                      <div className="flex justify-between">
                        <span>Faces Detected</span>
                        <span className="text-yellow-400">{Math.floor(scanningProgress * 47 / 100)} / 47</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Speed</span>
                        <span className="text-green-400">24.7 fps</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Match Confidence</span>
                        <span className="text-yellow-400">
                          {scanningProgress > 70 ? '94.3%' : scanningProgress > 40 ? '67.8%' : '23.1%'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current Step Visualization */}
          {currentStep >= 1 && (
            <div className="mb-6">
              <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">AI Age Progression</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Original Age: 8 years</span>
                    <span className="text-green-400">✓ Processed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Current Age: 8.5 years</span>
                    <span className="text-green-400">✓ Calculated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Variations Generated</span>
                    <span className="text-white">12 images</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Confidence Score</span>
                    <span className="text-yellow-400">96.8%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep >= 2 && (
            <div className="mb-6">
              <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Geo-Fenced Search Zones</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Railway Stations (15 locations)</span>
                    <span className="text-red-400">HIGH PRIORITY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Bus Terminals (8 locations)</span>
                    <span className="text-yellow-400">MEDIUM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Local Markets (12 locations)</span>
                    <span className="text-green-400">LOW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Search Radius</span>
                    <span className="text-white">5.2 km from last seen</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep >= 3 && (
            <div className="mb-6">
              <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">CCTV Network Scan</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Cameras Searched</span>
                    <span className="text-white">1,247 / 1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Recognition Methods</span>
                    <span className="text-yellow-400">Face + Gait + Clothing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Processing Status</span>
                    <span className="text-yellow-400">
                      {isPlaying && currentStep === 3 ? 'SCANNING...' : 'COMPLETE'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Potential Matches</span>
                    <span className="text-white">3 candidates</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Processing Time</span>
                    <span className="text-green-400">28 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {demoData.results && (
            <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <CheckCircle size={20} className="text-green-400 mr-2" />
                MATCH FOUND!
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-200">Match Confidence</span>
                  <span className="text-green-400 font-bold">{demoData.results.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Location Found</span>
                  <span className="text-white">{demoData.results.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Camera ID</span>
                  <span className="text-white">CAM_MUM_DADAR_001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Recognition Method</span>
                  <span className="text-yellow-400">Multi-modal (Face + Gait)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Detection Time</span>
                  <span className="text-white">
                    {new Date(demoData.results.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Total Search Time</span>
                  <span className="text-green-400 font-bold">45 seconds</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-green-400/30">
                <h4 className="text-white font-medium mb-2">Alerts Sent:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-green-400">✓</div>
                    <div className="text-xs text-blue-200">Police</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400">✓</div>
                    <div className="text-xs text-blue-200">Family</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400">✓</div>
                    <div className="text-xs text-blue-200">Citizens</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Modern Demo Impact */}
        <div className="modern-card rounded-2xl p-10 text-center mt-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-3 h-3 bg-emerald-500 rounded-full glow-emerald"></div>
            <h2 className="text-4xl font-bold text-gradient-purple">Demo Impact</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="modern-card p-6 gradient-emerald">
              <div className="text-5xl font-black text-emerald-400 mb-2">45s</div>
              <div className="text-gray-300 font-medium">Total Search Time</div>
              <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 rounded-full"></div>
            </div>
            <div className="modern-card p-6 gradient-cyan">
              <div className="text-5xl font-black text-cyan-400 mb-2">1,247</div>
              <div className="text-gray-300 font-medium">Cameras Searched</div>
              <div className="w-16 h-1 bg-cyan-500 mx-auto mt-3 rounded-full"></div>
            </div>
            <div className="modern-card p-6 gradient-amber">
              <div className="text-5xl font-black text-amber-400 mb-2">94.5%</div>
              <div className="text-gray-300 font-medium">Match Confidence</div>
              <div className="w-16 h-1 bg-amber-500 mx-auto mt-3 rounded-full"></div>
            </div>
          </div>
          
          <div className="bg-black/30 rounded-2xl p-6 border border-gray-700/50">
            <p className="text-2xl text-gray-300 leading-relaxed">
              Traditional methods would take <span className="text-rose-400 font-bold">6+ months</span>. 
              <br />
              <span className="text-gradient-cyan font-bold">DHUND found Priya in under a minute.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
