import React, { useState, FormEvent, KeyboardEvent } from 'react';
import '../vibelytube.css';
import '../team-styles.css';

interface HomePageProps {
  onStartClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Generate consistent session ID
      const sessionId = Date.now().toString();
      
      // Call backend to analyze YouTube video
      const response = await fetch(`${process.env.BACKEND_URL}/api/vibelytube/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: searchQuery.trim(),
          sessionId: sessionId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Video analysis successful:', result.data.title);
        // Store the analysis result and session ID for chat page
        localStorage.setItem('currentVideoAnalysis', JSON.stringify(result.data));
        localStorage.setItem('currentVideoSession', sessionId); // Use consistent key
        onStartClick(); // Navigate to chat page with Siti Khadijah
      } else {
        console.error('❌ Analysis failed:', result.error);
        alert('Gagal menganalisis video. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('❌ Error calling backend:', error);
      alert('Terjadi kesalahan saat menghubungi server. Pastikan backend berjalan.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        handleSearch(e as unknown as FormEvent);
      }
    }
  };
  
  // Function removed as we no longer have pricing plans

  return (
    <div className="vibelytube-home">
      {/* Header */}
      <header className="header simple-header">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
          </svg>
          <span>Intinya aja dongs</span>
        </div>
        <nav className="main-nav">
          <a href="#beranda" className="active">Beranda</a>
          <a href="#fitur-utama">Cara Kerja</a>
          <a href="#team">Tim Kami</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Dapatkan Inti dari Video, <br />Tanpa Nonton Semuanya</h1>
          <form onSubmit={handleSearch} className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Tempel URL YouTube di sini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isAnalyzing}
            />
            <button 
              type="submit"
              className={`search-button ${isAnalyzing ? 'loading' : ''}`}
              disabled={isAnalyzing || !searchQuery.trim()}
            >
              {isAnalyzing ? 'Menganalisis...' : 'Analisis Video'}
            </button>
          </form>
                    <p className="hero-helper-text">Paste URL video YouTube untuk langsung mendapatkan intisarinya</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="fitur-utama">
        <h2>Cara Menggunakan Intinya aja dongs</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon feature-step">
              <span>1</span>
            </div>
            <h3>Tempel URL YouTube</h3>
            <p>Cukup salin dan tempel URL video YouTube yang ingin Anda analisis</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon feature-step">
              <span>2</span>
            </div>
            <h3>Ekstraksi dengan YTDL, YouTube API & Assembly</h3>
            <p>Sistem kami menggunakan 3 teknologi untuk mengekstrak teks dari video</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon feature-step">
              <span>3</span>
            </div>
            <h3>Chat dengan Siti Khodjiah AI</h3>
            <p>Tanyakan apa saja tentang isi video kepada AI chatbot Siti Khodjiah</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <h2>Testimoni Pengguna Intinya aja dongs</h2>
        <div className="testimonial-container">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
              <span>@sinta_wijaya</span>
            </div>
            <p>
              "Saya chat dengan Siti Khodjiah AI tentang video kuliah MIT yang 2 jam, langsung dapet poin-poin penting tanpa harus nonton semua. Genius banget!"
            </p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
              <span>@bagus_pratama</span>
            </div>
            <p>
              "Tutorial coding 3 jam di YouTube jadi mudah dipahami. Siti Khodjiah AI bisa jawab pertanyaan detail tentang code yang dijelasin di video. Keren!"
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section" id="team">
        <h2>Tim Kami</h2>
        <div className="team-container">
          <div className="team-card">
            <div className="team-avatar">
              <div className="avatar-placeholder">IA</div>
            </div>
            <div className="team-info">
              <h3>Achmad Izan</h3>
              <p className="team-role">Program Manager</p>
              <p className="team-bio">Mengkoordinasikan pengembangan produk dan mengatur roadmap fitur untuk memastikan aplikasi memenuhi kebutuhan pengguna.</p>
            </div>
          </div>
          
          <div className="team-card">
            <div className="team-avatar">
              <div className="avatar-placeholder">OT</div>
            </div>
            <div className="team-info">
              <h3>Oki Taruna Ramadhan</h3>
              <p className="team-role">Machine Learning Engineer</p>
              <p className="team-bio">Mengembangkan model AI untuk analisis video dan ekstraksi intisari dari konten YouTube.</p>
            </div>
          </div>

          <div className="team-card">
            <div className="team-avatar">
              <div className="avatar-placeholder">MR</div>
            </div>
            <div className="team-info">
              <h3>Muhammad Riyadhu</h3>
              <p className="team-role">Full Stack Developer</p>
              <p className="team-bio">Membangun antarmuka pengguna yang responsif dan backend yang powerful untuk aplikasi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer simple-footer">
        <div className="footer-bottom">
          <p>Made with ❤️ by Intinya aja dongs Team</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
