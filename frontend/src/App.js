import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ReportMissing from './components/ReportMissing';
import SearchNetwork from './components/SearchNetwork';
import CitizenReport from './components/CitizenReport';
import EmergencyAlert from './components/EmergencyAlert';
import Header from './components/Header';
import Demo from './components/Demo';
import Sightings from './components/Sightings';
import AgeProgression from './components/AgeProgression';

function App() {
  const [currentDemo, setCurrentDemo] = useState(null);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report-missing" element={<ReportMissing />} />
          <Route path="/search-network" element={<SearchNetwork />} />
          <Route path="/citizen-report" element={<CitizenReport />} />
          <Route path="/emergency-alert" element={<EmergencyAlert />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/sightings" element={<Sightings />} />
          <Route path="/age-progression" element={<AgeProgression />} />
          {/* Legacy routes for backward compatibility */}
          <Route path="/report" element={<ReportMissing />} />
          <Route path="/search" element={<SearchNetwork />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
