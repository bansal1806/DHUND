import axios from 'axios';
import { apiUrl } from '../config/api';

const apiService = {
  // System status
  getStatus: async () => {
    const response = await axios.get(apiUrl('/'));
    return response.data;
  },

  // Missing Persons
  getMissingPersons: async () => {
    const response = await axios.get(apiUrl('/api/missing-persons'));
    return response.data;
  },

  reportMissing: async (formData) => {
    const response = await axios.post(apiUrl('/api/report-missing'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Citizen Reports
  getSightings: async () => {
    const response = await axios.get(apiUrl('/api/sightings'));
    return response.data;
  },

  getSightingDetails: async (reportId) => {
    const response = await axios.get(apiUrl(`/api/sightings/${reportId}`));
    return response.data;
  },

  citizenReport: async (formData) => {
    const response = await axios.post(apiUrl('/api/citizen-report'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Search
  semanticSearch: async (query, limit = 10) => {
    const response = await axios.post(
      apiUrl(`/api/semantic-search?query=${encodeURIComponent(query)}&limit=${limit}`)
    );
    return response.data;
  },

  searchCCTV: async (personId) => {
    const formData = new FormData();
    formData.append('person_id', personId.toString());
    const response = await axios.post(apiUrl('/api/search-cctv'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Age Progression
  generateAgeProgression: async (formData) => {
    const response = await axios.post(apiUrl('/api/age-progression'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  targetReconstruction: async (formData) => {
    const response = await axios.post(apiUrl('/api/ai/target-reconstruction'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Voice Processing
  processVoice: async (audioFile) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    const response = await axios.post(apiUrl('/api/ai/process-voice'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Search Status
  getSearchStatus: async (personId) => {
    const response = await axios.get(apiUrl(`/api/search-status/${personId}`));
    return response.data;
  },
};

export default apiService;

