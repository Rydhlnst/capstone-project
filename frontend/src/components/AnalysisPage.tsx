import React, { useState } from 'react';
import { Upload, Youtube } from 'lucide-react';

interface AnalysisPageProps {
  onBackClick: () => void;
  onAnalyzeSuccess: (data: any) => void;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ onBackClick, onAnalyzeSuccess }) => {
  const [mode, setMode] = useState<'youtube' | 'upload'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const casualTexts = [
    "Sabar ya, lagi dianalisis...",
    "Bentar lagi selesai kok...",
    "Sedang mencari inti kontennya..."
  ];

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.includes('video')) {
      setFile(selectedFile);
    } else {
      setError('Pilih file video MP4 ya!');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAnalyze = async () => {
    if (mode === 'youtube' && !youtubeUrl.trim()) {
      setError('Masukkan URL YouTube dulu!');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (mode === 'upload' && !file) {
      setError('Upload file video dulu!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      let response;
      
      if (mode === 'youtube') {
        console.log('🎬 Menganalisis video YouTube:', youtubeUrl);
        
        response = await fetch('/api/vibelytube/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: youtubeUrl,
            sessionId
          }),
        });
      } else {
        console.log('📁 Menganalisis file:', file?.name);
        
        const formData = new FormData();
        formData.append('file', file!);
        formData.append('sessionId', sessionId);
        
        response = await fetch('/api/vibelytube/upload', {
          method: 'POST',
          body: formData,
        });
      }

      const data = await response.json();
      
      if (data.success) {
        onAnalyzeSuccess({
          ...data.data,
          sessionId
        });
      } else {
        throw new Error(data.error || 'Gagal menganalisis konten');
      }
    } catch (error: any) {
      console.error('❌ Error during analysis:', error);
      setError(error.message || 'Terjadi kesalahan saat menganalisis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="analysis-page">
      <div className="page-nav">
        <button className="page-button secondary" onClick={onBackClick}>
          &larr; Kembali
        </button>
      </div>
      
      <div className="analysis-form">
        <div className="mode-selector">
          <button 
            className={`mode-btn ${mode === 'youtube' ? 'active' : ''}`}
            onClick={() => setMode('youtube')}
          >
            <Youtube size={24} />
            YouTube
          </button>
          <button 
            className={`mode-btn ${mode === 'upload' ? 'active' : ''}`}
            onClick={() => setMode('upload')}
          >
            <Upload size={24} />
            Upload Video
          </button>
        </div>
        
        {mode === 'youtube' ? (
          <div className="input-group">
            <label htmlFor="youtube-url">Tempel URL YouTube:</label>
            <input
              id="youtube-url"
              type="text"
              className="url-input"
              placeholder="https://youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </div>
        ) : (
          <div className="input-group">
            <label>Upload File Video (MP4):</label>
            <div 
              className="file-upload"
              onClick={handleFileClick}
            >
              {file ? file.name : "Klik untuk pilih file video MP4"}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="video/mp4,video/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        )}
        
        {error && <div className="error">{error}</div>}
        
        <button 
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Bentar ya..." : "Analisis Sekarang!"}
        </button>
        
        {isAnalyzing && (
          <div className="casual-text">
            {casualTexts[Math.floor(Math.random() * casualTexts.length)]}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
