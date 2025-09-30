import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import CecepChatPage from './components/CecepChatPage';
import { CheckCircle } from 'lucide-react';

// Import Nunito font for Roblox-style design
import './fonts.css';
// Import cyberpunk theme
import './components/cyberpunk.css';
import './components/cyberpunk-animations.css';

interface AnalysisResult {
  title?: string;
  transcript?: string;
  duration?: string;
  url?: string;
  description?: string;
  processedAt?: string;
  channelTitle?: string;
  viewCount?: number;
  likeCount?: number;
  sessionId?: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'chat'>('home');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [success, setSuccess] = useState('');
  
  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  useEffect(() => {
    // Check if there's analysis data in localStorage when component mounts
    const storedAnalysis = localStorage.getItem('currentVideoAnalysis');
    const storedSession = localStorage.getItem('currentVideoSession');
    
    if (storedAnalysis) {
      try {
        const analysisData = JSON.parse(storedAnalysis);
        
        // Add sessionId to analysis data
        const enrichedData = {
          ...analysisData,
          sessionId: storedSession || 'default',
          analysisId: analysisData.id // Make sure analysisId is included
        };
        
        setAnalysisResult(enrichedData);
      } catch (error) {
        console.error('Failed to parse stored analysis data', error);
      }
    }
  }, []);

  const handleStartAnalysis = () => {
    // Check if there's analysis data in localStorage
    const storedAnalysis = localStorage.getItem('currentVideoAnalysis');
    const storedSession = localStorage.getItem('currentVideoSession');
    
    if (storedAnalysis) {
      try {
        const analysisData = JSON.parse(storedAnalysis);
        
        // Add sessionId to analysis data
        const enrichedData = {
          ...analysisData,
          sessionId: storedSession || 'default',
          analysisId: analysisData.id // Make sure analysisId is included
        };
        
        setAnalysisResult(enrichedData);
        
        // Show success notification
        showSuccess('✅ Analysis completed! You can now chat with Cecep');
        
        // Go directly to chat page with the analysis data
        setCurrentPage('chat');
        
        // Clear localStorage after use
        localStorage.removeItem('currentVideoAnalysis');
        localStorage.removeItem('currentVideoSession');
      } catch (error) {
        console.error('Failed to parse stored analysis data', error);
        setCurrentPage('home'); // Fallback to home page
      }
    } else {
      setCurrentPage('home');
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setAnalysisResult(null);
  };
  
  return (
    <div className="container">
      {/* Success Messages - Shown on all pages */}
      {success && (
        <div className="notification-area">
          <div className="success">
            <CheckCircle size={18} style={{ display: 'inline', marginRight: '8px' }} />
            {success}
          </div>
        </div>
      )}

      {/* Current Page Content */}
      {currentPage === 'home' && (
        <div className="main-content">          
          <HomePage onStartClick={handleStartAnalysis} />
        </div>
      )}
      
      {currentPage === 'chat' && (
        <CecepChatPage 
          onBackClick={handleBackToHome}
          initialVideoData={analysisResult}
        />
      )}
    </div>
  );
};

export default App;
