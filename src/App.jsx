import { useState, useEffect } from 'react';
import './index.css';

function loadVideoSource(video) {
  const source = video.querySelector('source[data-src]');
  if (!source) return false;
  source.src = source.dataset.src;
  source.removeAttribute('data-src');
  video.load();
  return true;
}

function playMutedVideo(video) {
  const play = () => video.play().catch(() => {});
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) play();
  else video.addEventListener('canplay', play, { once: true });
}

function toggleVideo(video) {
  const wasLoaded = loadVideoSource(video);
  if (wasLoaded || video.paused) {
    playMutedVideo(video);
  } else {
    video.pause();
  }
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [hoveredArt, setHoveredArt] = useState(null);

  const getArtStyle = (artName) => ({
    opacity: hoveredArt ? (hoveredArt === artName ? 1 : 0.3) : 1,
    transform: hoveredArt === artName ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.3s ease',
    cursor: 'default'
  });

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const programVideos = Array.from(document.querySelectorAll('video[data-lazy-video]'));
    const reelVideos = Array.from(document.querySelectorAll('video[data-reel-video]'));
    if (!('IntersectionObserver' in window)) {
      programVideos.forEach(loadVideoSource);
      reelVideos.forEach((video) => {
        loadVideoSource(video);
        playMutedVideo(video);
      });
      return undefined;
    }

    const programObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadVideoSource(entry.target);
        programObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px' });

    const reelObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }
        loadVideoSource(video);
        playMutedVideo(video);
      });
    }, { rootMargin: '200px 0px', threshold: 0.15 });

    programVideos.forEach((video) => programObserver.observe(video));
    reelVideos.forEach((video) => reelObserver.observe(video));
    return () => {
      programObserver.disconnect();
      reelObserver.disconnect();
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${scrollDirection === 'down' ? 'hide' : ''}`}>
        <div className="container nav-container">
          <div className="logo">
            <img src="/logo-transparent.png" alt="Serdes Fight Club" style={{ height: '60px' }} />
          </div>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#home" onClick={closeMenu}>Home</a></li>
            <li><a href="#programs" onClick={closeMenu}>Programs</a></li>
            <li><a href="#schedule" onClick={closeMenu}>Schedule</a></li>
            <li><a href="#instructors" onClick={closeMenu}>Instructors</a></li>
            <li><a href="#pricing" onClick={closeMenu}>Pricing</a></li>
            <li><a href="#faq" onClick={closeMenu}>FAQ</a></li>
            <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
          </ul>
          <div className="hamburger" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </div>
        </div>
      </nav>

      <header id="home" className="hero" style={{ backgroundImage: "url('/media/bg-inside2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">Unleash Your <span className="highlight">Potential</span></h1>
          <p className="hero-subtitle">Train with the best at Serdes Fight Club under Thodoris Serdes.</p>
          <div style={{ marginTop: '20px' }}>
            <a href="#schedule" className="btn btn-primary">View Schedule</a>
            <a href="https://www.instagram.com/serdesfightclub/?hl=el" target="_blank" rel="noreferrer" className="btn" style={{ marginLeft: '15px', backgroundColor: 'transparent', border: '2px solid var(--accent)', color: 'var(--accent)' }}>Book a Trial (DM)</a>
          </div>
          <p style={{ marginTop: '15px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>*or just drop in</p>
        </div>
      </header>

      <section id="programs" className="programs section-padding">
        <div className="container">
          <div className="section-title">
            <h2>Our <span className="highlight">Programs</span></h2>
            <p>We offer a variety of martial arts and fitness classes for all levels and ages.</p>
          </div>
          <div className="grid programs-grid">
            <div className="card program-card">
              <video autoPlay loop muted playsInline preload="none" data-lazy-video="true" className="card-video-bg">
                <source data-src="/videos/mma-1.mp4" type="video/mp4" />
              </video>
              <i className="fas fa-fist-raised fa-3x"></i>
              <h3>MMA</h3>
              <p>Train in all disciplines. Combining striking and grappling for the ultimate cage readiness.</p>
            </div>
            <div className="card program-card">
              <video autoPlay loop muted playsInline preload="none" data-lazy-video="true" className="card-video-bg">
                <source data-src="/videos/kick-9.mp4" type="video/mp4" />
              </video>
              <i className="fas fa-fire fa-3x"></i>
              <h3>Kickboxing / Muay Thai</h3>
              <p>Learn to strike with power and precision. Pad work, hard sparring, and heavy bags.</p>
            </div>
            <div className="card program-card">
              <video autoPlay loop muted playsInline preload="none" data-lazy-video="true" className="card-video-bg">
                <source data-src="/videos/bjj-1.mp4" type="video/mp4" />
              </video>
              <i className="fas fa-user-ninja fa-3x"></i>
              <h3>Brazilian Jiu Jitsu</h3>
              <p>The art of submission. Learn sweeps, chokes, and joint locks from expert black belts. We train both <strong>Gi and No Gi</strong>.</p>
            </div>
            <div className="card program-card">
              <video autoPlay loop muted playsInline preload="none" data-lazy-video="true" className="card-video-bg">
                <source data-src="/videos/kids-1.mp4" type="video/mp4" />
              </video>
              <i className="fas fa-child fa-3x"></i>
              <h3>Kids Muay Thai</h3>
              <p>Discipline, respect, and fitness. We teach kids self-defense in a safe, structured environment.</p>
            </div>
            <div className="card program-card" style={{ backgroundImage: "url('/bg-kids.png')" }}>
              <i className="fas fa-puzzle-piece fa-3x"></i>
              <h3>Structured Kids Muay Thai</h3>
              <p>Small-group, consistent and individualized training for children with developmental or learning difficulties, supporting confidence and each child&apos;s unique strengths.</p>
            </div>
            <div className="card program-card">
              <video autoPlay loop muted playsInline preload="none" data-lazy-video="true" className="card-video-bg">
                <source data-src="/videos/fitbox-1.mp4" type="video/mp4" />
              </video>
              <i className="fas fa-dumbbell fa-3x"></i>
              <h3>Fit Box</h3>
              <p>A high-cardio boxing workout. Sweat it out and get in fighting shape without the sparring.</p>
            </div>
            <div className="card program-card pilates-card" style={{ backgroundImage: "url('/bg-pilates.png')" }}>
              <i className="fas fa-spa fa-3x"></i>
              <h3>Pilates</h3>
              <p>Build core strength, flexibility, and balance to prevent injuries and improve overall athletic performance.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="schedule" className="schedule section-padding" style={{ backgroundImage: "url('/media/schedule-bg.jpg')", backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-title">
            <h2>Class <span className="highlight">Schedule</span></h2>
            <p>Find the perfect class time for your routine.</p>
          </div>
          <div className="schedule-container">
            <div className="table-responsive">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>TIME</th>
                    <th>MONDAY</th>
                    <th>TUESDAY</th>
                    <th>WEDNESDAY</th>
                    <th>THURSDAY</th>
                    <th>FRIDAY</th>
                    <th>SATURDAY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="time-col">9:00</td>
                    <td></td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('pilates')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('pilates')}>PILATES</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('pilates')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('pilates')}>PILATES</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('pilates')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('pilates')}>PILATES</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="time-col">10:00</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('kick')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('kick')}>KICKBOXING<br />MUAY THAI</td>
                    <td></td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('kick')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('kick')}>KICKBOXING<br />MUAY THAI</td>
                    <td></td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('kick')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('kick')}>KICKBOXING<br />MUAY THAI</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="time-col">12:00</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('bjj')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('bjj')}>BRAZILIAN<br />JIU-JITSU</td>
                  </tr>
                  <tr>
                    <td className="time-col">11:00</td><td></td><td></td><td></td><td></td><td></td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('structuredKids')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('structuredKids')}>STRUCTURED<br />KIDS MUAY THAI</td>
                  </tr>
                  <tr>
                    <td className="time-col">16:00</td><td></td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('structuredKids')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('structuredKids')}>STRUCTURED<br />KIDS MUAY THAI</td>
                    <td></td><td></td><td></td><td></td>
                  </tr>
                  <tr>
                    <td className="time-col">17:00</td>
                    <td></td><td className="class-filled" onMouseEnter={() => setHoveredArt('fitbox')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('fitbox')}>FIT BOX</td><td></td><td className="class-filled" onMouseEnter={() => setHoveredArt('fitbox')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('fitbox')}>FIT BOX</td><td></td><td></td>
                  </tr>
                  <tr>
                    <td className="time-col">18:00</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('kids')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('kids')}>KIDS MUAY THAI</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('kids')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('kids')}>KIDS MUAY THAI</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('kids')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('kids')}>KIDS MUAY THAI</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('kids')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('kids')}>KIDS MUAY THAI</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('kids')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('kids')}>KIDS MUAY THAI</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('fitbox')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('fitbox')}>FIT BOX</td>
                  </tr>
                  <tr>
                    <td className="time-col">19:00</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('kick')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('kick')}>KICKBOXING<br />MUAY THAI</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('mma')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('mma')}>MMA</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('kick')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('kick')}>KICKBOXING<br />MUAY THAI</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('mma')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('mma')}>MMA</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('kick')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('kick')}>KICKBOXING<br />MUAY THAI</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="time-col">20:30</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('bjj')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('bjj')}>BRAZILIAN<br />JIU-JITSU</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('fitbox')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('fitbox')}>FIT BOX</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('bjj')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('bjj')}>BRAZILIAN<br />JIU-JITSU</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('fitbox')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('fitbox')}>FIT BOX</td>
                    <td className="class-filled" onMouseEnter={() => setHoveredArt('bjj')} onMouseLeave={() => setHoveredArt(null)} style={getArtStyle('bjj')}>BRAZILIAN<br />JIU-JITSU</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="time-col">21:00</td>
                    <td></td>
                    <td></td><td></td><td></td><td></td><td></td><td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="instructors" className="instructors section-padding">
        <div className="container">
          <div className="instructor-layout">
            <div className="instructor-image">
              <img src="/media/coach.jpg" alt="Coach Thodoris Serdes" loading="eager" fetchPriority="high" decoding="async" />
            </div>
            <div className="instructor-info">
              <h2>Meet Your <span className="highlight">Head Coach</span></h2>
              <h3>Thodoris Serdes</h3>
              <p>Thodoris Serdes is an active Greek professional MMA fighter who has competed in Cage Warriors, Quest MMA, and Cage Survivor, bringing first-hand competition experience to his coaching.</p>
              <a href="https://www.instagram.com/serdes_mma/?hl=el" target="_blank" rel="noreferrer" className="btn btn-primary" style={{marginTop: '15px', marginBottom: '15px'}}>Follow on Instagram</a>
              <div style={{ marginTop: '10px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
                <h4 style={{ marginBottom: '5px', color: 'var(--text-main)' }}>An Elite Coaching Team</h4>
                <p style={{ fontSize: '0.95rem' }}>Thodoris is supported by a dedicated roster of specialized coaches. From our BJJ black belts to our expert Pilates instructors, every discipline is taught by a seasoned professional.</p>
              </div>
            </div>
          </div>

          <div className="grid sub-instructors-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
            <div className="card instructor-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <img src="/media/coach-giannis.jpg" alt="Giannis Ludakis" loading="lazy" decoding="async" style={{ width: '100%', height: '350px', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ padding: '25px' }}>
                <h3 style={{ marginBottom: '5px' }}>Giannis Ludakis</h3>
                <h4 style={{ color: 'var(--accent)', marginBottom: '15px', fontSize: '0.9rem' }}>BJJ Head Coach • Black Belt</h4>
                <p style={{ fontSize: '0.95rem', marginBottom: '15px' }}>A respected black belt with a strong presence in national competitions.</p>
                <a href="https://www.instagram.com/ludakisg/?hl=el" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}><i className="fab fa-instagram"></i> @ludakisg</a>
              </div>
            </div>
            
            <div className="card instructor-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <img src="/media/coach-emmanouela.jpg" alt="Emmanouela Fakoukaki" loading="lazy" decoding="async" style={{ width: '100%', height: '350px', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ padding: '25px' }}>
                <h3 style={{ marginBottom: '5px' }}>Emmanouela Fakoukaki</h3>
                <h4 style={{ color: 'var(--accent)', marginBottom: '15px', fontSize: '0.9rem' }}>Boxing & Kickboxing • PT</h4>
                <p style={{ fontSize: '0.95rem', marginBottom: '15px' }}>Certified fitness and personal trainer, specializing in high-energy boxing and kickboxing instruction.</p>
                <a href="https://www.instagram.com/emmanouela_fakoukaki_/?hl=el" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}><i className="fab fa-instagram"></i> @emmanouela_fakoukaki_</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reels" className="reels section-padding">
        <div className="container" style={{ padding: '0' }}>
          <div className="section-title">
            <h2>Action <span className="highlight">Reels</span></h2>
            <p>Raw footage straight from the mats.</p>
          </div>
          
          <div className="reels-container" style={{ padding: '0 20px' }}>
            {['bjj-4.mp4', 'kick-5.mp4', 'mma-2.mp4', 'kick-1.mp4', 'bjj-1.mp4', 'mma-1.mp4', 'kick-2.mp4', 'kick-3.mp4', 'bjj-2.mp4', 'fitbox-1.mp4', 'kick-4.mp4', 'bjj-3.mp4', 'kick-6.mp4', 'mma-3.mp4', 'kick-7.mp4', 'kick-8.mp4', 'kick-9.mp4'].map(vid => (
               <div key={vid} className="reel-card">
                 <video 
                   loop 
                   muted 
                   playsInline 
                   className="reel-video"
                   preload="none"
                   autoPlay
                   data-reel-video="true"
                   onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                   onMouseLeave={(e) => e.currentTarget.pause()}
                   onClick={(e) => toggleVideo(e.currentTarget)}
                 >
                   <source data-src={`/videos/${vid}#t=1.5`} type="video/mp4" />
                 </video>
               </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery section-padding bg-dark">
        <div className="container">
          <div className="section-title">
            <h2>Our <span className="highlight">Gallery</span></h2>
            <p>Take a look inside Serdes Fight Club.</p>
          </div>
          
          <div className="gallery-category">
            <div className="category-header">
              <h3>Inside the Club</h3>
              <p>Take a look at our fully-equipped, modern training facilities designed to accommodate every martial art and fitness goal.</p>
            </div>
            <div className="grid gallery-grid grid-2x2">
              <img src="/media/school1.jpg" alt="School Facility" className="gallery-img" loading="lazy" decoding="async" />
              <img src="/media/building-new4.jpg" alt="Gym Exterior Sign" className="gallery-img" loading="lazy" decoding="async" />
              <img src="/media/building-new5.jpg" alt="Gym Interior Equipment" className="gallery-img" loading="lazy" decoding="async" />
              <img src="/media/school4.jpg" alt="School Facility" className="gallery-img" loading="lazy" decoding="async" />
            </div>
          </div>

          <div className="gallery-category">
            <div className="category-header">
              <h3>Pros & Visitors</h3>
              <p>We frequently accommodate professional fighters looking for high-level training camps, as well as visiting amateurs and martial artists dropping in for 1-on-1 sessions or group classes.</p>
            </div>
            <div className="grid gallery-grid grid-2x2">
              <img src="/media/gallery-jack1.jpg" alt="Pro Fighter Jack Grant Sparring" className="gallery-img" loading="lazy" decoding="async" />
              <img src="/media/gallery-jack2.jpg" alt="Pro Fighter Jack Grant Training" className="gallery-img" loading="lazy" decoding="async" />
              <img src="/media/gallery-jack3.jpg" alt="Pro Fighter Grappling" className="gallery-img" loading="lazy" decoding="async" />
              <img src="/media/gallery-visitor.jpg" alt="Visiting Amateur Fighter" className="gallery-img" loading="lazy" decoding="async" />
            </div>
          </div>

          <div className="gallery-category">
            <div className="category-header">
              <h3>Seminars & Special Events</h3>
              <p>We regularly host and attend world-class seminars with elite martial artists to continually expand our knowledge.</p>
            </div>
            <div className="grid gallery-grid">
              <img src="/media/gallery-seminar.jpg" alt="BJJ Seminar Poster" className="gallery-img" loading="lazy" decoding="async" />
              <img src="/media/gallery-seminar2.jpg" alt="UFC Seminar Event" className="gallery-img" loading="lazy" decoding="async" />
              <img src="/media/gallery-seminar3.jpg" alt="MMA Seminar Banner" className="gallery-img" loading="lazy" decoding="async" />
            </div>
          </div>

          <div className="gallery-category">
            <div className="category-header">
              <h3>Our Fight Team</h3>
              <p>We maintain a strong, active presence in local and national competitions across Kickboxing, MMA, and BJJ.</p>
            </div>
            <div className="grid gallery-grid">
               <img src="/media/comp1.jpg" alt="Fight Team in Ring" className="gallery-img" loading="lazy" decoding="async" />
               <img src="/media/comp2.jpg" alt="Female Fighter Victory" className="gallery-img" loading="lazy" decoding="async" />
               <img src="/media/comp3.jpg" alt="Medal Winner and Cage Action" className="gallery-img" loading="lazy" decoding="async" />
               <img src="/media/comp4.jpg" alt="Fight Team Outside Cage" className="gallery-img" loading="lazy" decoding="async" />
               <img src="/media/comp5.jpg" alt="Fight Team Group Shot" className="gallery-img" loading="lazy" decoding="async" />
               <img src="/media/comp6.jpg" alt="Fight Team Crowd" className="gallery-img" loading="lazy" decoding="async" />
               <img src="/media/comp8.jpg" alt="Fight Team Gym" className="gallery-img" loading="lazy" decoding="async" />
               <img src="/media/comp10.jpg" alt="Fight Team Action" className="gallery-img" loading="lazy" decoding="async" />
               <img src="/media/comp11.jpg" alt="Fight Team Competition" className="gallery-img" loading="lazy" decoding="async" />
            </div>
          </div>

        </div>
      </section>

      <section id="reviews" className="reviews section-padding bg-dark">
        <div className="container">
          <div className="section-title">
            <h2>What People <span className="highlight">Say</span></h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px', fontSize: '1.2rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Google Maps Rating 5 Stars</span>
              <div>
                <i className="fas fa-star" style={{ color: 'var(--accent)' }}></i>
                <i className="fas fa-star" style={{ color: 'var(--accent)' }}></i>
                <i className="fas fa-star" style={{ color: 'var(--accent)' }}></i>
                <i className="fas fa-star" style={{ color: 'var(--accent)' }}></i>
                <i className="fas fa-star" style={{ color: 'var(--accent)' }}></i>
              </div>
            </div>
          </div>
          <div className="grid reviews-grid">
            <div className="card review-card" style={{ padding: '25px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: '0.95rem' }}>"Great training, gym's brilliant I’ll visit again for sure ✊🏼❤️"</p>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>- Jack Grant MMA</h4>
            </div>

            <div className="card review-card" style={{ padding: '25px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: '0.95rem' }}>"Always love working with high-level coaches. 🥊 Booked 1-on-1 English boxing sessions... High skill, high level coaching, super friendly atmosphere and perfect focus during training. Definitely coming back. 👊"</p>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>- fit_sala</h4>
            </div>

            <div className="card review-card" style={{ padding: '25px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: '0.95rem' }}>"While traveling in Crete, I had a great time training in Serdes Fight Club for one month. Students and coaches are great and you will always learn something whatever your level is."</p>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>- Ryan Spitz</h4>
            </div>

            <div className="card review-card" style={{ padding: '25px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: '0.95rem' }}>"Από τις καλύτερες σχολές πολεμικών τεχνών στο νησί. Ο χώρος είναι άψογος λειτουργικά και αισθητικά. Το κλίμα είναι εξαιρετικό, η δομή των μαθημάτων είναι προσανατολισμένη για όλα τα επίπεδα..."</p>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>- Georgios Drakonakis</h4>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing section-padding">
        <div className="container">
          <div className="section-title">
            <h2>Membership <span className="highlight">Plans</span></h2>
            <p>Choose the package that fits your goals.</p>
          </div>
          <div className="grid pricing-grid">
            <div className="card pricing-card">
              <h3>Striking Base</h3>
              <div className="price">€45<span>/mo</span></div>
              <ul className="pricing-features">
                <li><i className="fas fa-check"></i> Unlimited Kickboxing / Muay Thai</li>
                <li><i className="fas fa-plus highlight"></i> Bonus: Fit Box classes</li>
                <li><i className="fas fa-plus highlight"></i> Bonus: MMA classes</li>
              </ul>
            </div>
            <div className="card pricing-card">
              <h3>Grappling Base</h3>
              <div className="price">€45<span>/mo</span></div>
              <ul className="pricing-features">
                <li><i className="fas fa-check"></i> Unlimited BJJ (Gi & No Gi)</li>
                <li><i className="fas fa-plus highlight"></i> Bonus: Fit Box classes</li>
                <li><i className="fas fa-plus highlight"></i> Bonus: MMA classes</li>
              </ul>
            </div>
            <div className="card pricing-card featured">
              <div className="featured-badge">Best Value</div>
              <h3>Ultimate Package</h3>
              <div className="price">€60<span>/mo</span></div>
              <ul className="pricing-features">
                <li><i className="fas fa-check"></i> Unlimited access to ALL classes</li>
                <li><i className="fas fa-check"></i> Kickboxing & Muay Thai</li>
                <li><i className="fas fa-check"></i> BJJ (Gi & No Gi)</li>
                <li><i className="fas fa-check"></i> MMA & Fit Box</li>
                <li><i className="fas fa-check"></i> Pilates</li>
              </ul>
            </div>
            <div className="card pricing-card">
              <h3>Kids Package</h3>
              <div className="price">€40<span>/mo</span></div>
              <ul className="pricing-features">
                <li><i className="fas fa-check"></i> Specialized Kids Classes (5-14 yrs)</li>
                <li><i className="fas fa-check"></i> Safe & structured environment</li>
                <li><i className="fas fa-check"></i> Builds discipline & confidence</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="faq section-padding bg-dark">
        <div className="container">
          <div className="section-title">
            <h2>Frequently Asked <span className="highlight">Questions</span></h2>
            <p>Have questions? We've got answers in both English and Greek.</p>
          </div>
          <div className="faq-container">
            <div className="faq-item">
              <h3>1. Do I need prior experience? / Χρειάζομαι προηγούμενη εμπειρία;</h3>
              <p><strong>EN:</strong> No! We welcome all levels, from absolute beginners to professional fighters. Our coaches will guide you step-by-step.<br/>
                 <strong>GR:</strong> Όχι! Καλωσορίζουμε όλα τα επίπεδα, από εντελώς αρχάριους μέχρι επαγγελματίες αθλητές.</p>
            </div>
            <div className="faq-item">
              <h3>2. What gear do I need? / Τι εξοπλισμό χρειάζομαι;</h3>
              <p><strong>EN:</strong><br/>
                 - <strong>Striking:</strong> Boxing gloves, shinguards, mouthguard.<br/>
                 - <strong>Grappling:</strong> Mouthguard, and a Gi (for Gi classes).<br/>
                 - <strong>MMA:</strong> MMA sparring gloves, shinguards, mouthguard.<br/>
                 <strong>GR:</strong><br/>
                 - <strong>Striking:</strong> Γάντια του μποξ, επικαλαμίδες, μασελάκι.<br/>
                 - <strong>Grappling:</strong> Μασελάκι, και Gi (για τα μαθήματα Gi).<br/>
                 - <strong>MMA:</strong> Γάντια MMA (sparring), επικαλαμίδες, μασελάκι.</p>
            </div>
            <div className="faq-item">
              <h3>3. Can I try a class first? / Μπορώ να δοκιμάσω ένα μάθημα;</h3>
              <p><strong>EN:</strong> Yes, we offer a free trial class for new members. Come experience the gym and meet the team!<br/>
                 <strong>GR:</strong> Ναι, προσφέρουμε ένα δωρεάν δοκιμαστικό μάθημα για νέα μέλη. Ελάτε να γνωρίσετε τον χώρο και την ομάδα μας!</p>
            </div>
            <div className="faq-item">
              <h3>4. At what age can kids start? / Από ποια ηλικία ξεκινούν τα παιδιά;</h3>
              <p><strong>EN:</strong> Our Kids Muay Thai program starts from age 5, with classes split into 5-10 and 10-14 age groups.<br/>
                 <strong>GR:</strong> Το πρόγραμμα Παιδικού Muay Thai ξεκινάει από την ηλικία των 5 ετών, με τμήματα χωρισμένα για ηλικίες 5-10 και 10-14 ετών.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact section-padding">
        <div className="container">
          <div className="section-title">
            <h2>Find <span className="highlight">Us</span></h2>
            <p>Come visit us and start your martial arts journey today.</p>
          </div>
          <div className="grid contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Address</h4>
                  <p>ΕΟΚ 26, Ηράκλειο 713 05</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h4>Phone</h4>
                  <p><a href="tel:+306957405110" style={{color: 'var(--text-muted)'}}>695 740 5110</a></p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fab fa-instagram"></i>
                <div>
                  <h4>Instagram</h4>
                  <p><a href="https://www.instagram.com/serdesfightclub/?hl=el" target="_blank" rel="noreferrer" style={{color: 'var(--text-muted)'}}>@serdesfightclub</a></p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fab fa-tiktok"></i>
                <div>
                  <h4>TikTok</h4>
                  <p><a href="https://www.tiktok.com/@serdesfightclubofficial" target="_blank" rel="noreferrer" style={{color: 'var(--text-muted)'}}>@serdesfightclubofficial</a></p>
                </div>
              </div>
            </div>
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3294.062137682977!2d25.12266317511059!3d35.32944277265902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149a5999f0361a79%3A0x546417a720219d9f!2sSerdes%20Fight%20Club!5e0!3m2!1sen!2sgr!4v1717975836487!5m2!1sen!2sgr"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-content">
          <div className="logo" style={{ marginBottom: '10px' }}>
            <img src="/logo2.png" alt="Serdes Fight Club" style={{ height: '90px' }} />
          </div>
          <div className="social-links" style={{ display: 'flex', gap: '20px', fontSize: '1.5rem', marginBottom: '10px' }}>
            <a href="https://www.instagram.com/serdesfightclub/?hl=el" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.tiktok.com/@serdesfightclubofficial" target="_blank" rel="noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
          <p>&copy; 2026 Serdes Fight Club. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
