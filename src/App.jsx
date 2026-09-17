import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import './index.css';
import Icon from './Icon.jsx';
import { COPY } from './copy.js';
import { loadBelowFold } from './belowFoldLoader.js';

const REEL_VIDEOS = [
  'bjj-4.mp4', 'kick-5.mp4', 'mma-2.mp4', 'kick-1.mp4', 'bjj-1.mp4', 'mma-1.mp4',
  'kick-2.mp4', 'kick-3.mp4', 'bjj-2.mp4', 'fitbox-1.mp4', 'kick-4.mp4', 'bjj-3.mp4',
  'kick-6.mp4', 'mma-3.mp4', 'kick-7.mp4', 'kick-8.mp4', 'kick-9.mp4',
];

const SCHEDULE_ROWS = [
  ['9:00', [null, 'pilates', 'pilates', 'pilates', null, null]],
  ['10:00', ['kick', 'fitbox', 'kick', 'fitbox', 'kick', null]],
  ['11:00', ['hybrid', 'hybrid', 'hybrid', 'hybrid', 'hybrid', 'mma']],
  ['12:00', [null, null, null, null, null, 'bjj']],
  ['16:00', ['kids5', 'kids10', 'kids5', 'kids10', 'kids5', null]],
  ['17:00', ['kids10', 'hybrid', 'kids10', 'hybrid', 'kids10', 'hybrid']],
  ['18:00', ['kick', 'kick', 'kick', 'kick', 'kick', 'fitbox']],
  ['19:30', ['kick', 'mma', 'kick', 'mma', 'kick', null]],
  ['20:30', ['bjj', null, 'bjj', null, 'bjj', null]],
  ['21:00', [null, 'fitbox', null, 'fitbox', null, null]],
];

const BelowFoldSections = lazy(loadBelowFold);

function loadVideo(video) {
  if (video.dataset.loaded === 'true') return;
  const source = video.querySelector('source[data-src]');
  if (!source) return;
  source.src = source.dataset.src;
  video.dataset.loaded = 'true';
  video.load();
}

function loadVideoPoster(video) {
  if (video.dataset.poster && !video.poster) video.poster = video.dataset.poster;
}

function warmVideo(video) {
  if (!video) return;
  loadVideoPoster(video);
  loadVideo(video);
}

function allowsAutomaticVideo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const slowConnection = connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType);
  return !slowConnection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function playMutedVideo(video, force = false) {
  loadVideoPoster(video);
  if (!force && !allowsAutomaticVideo()) return;
  loadVideo(video);
  const play = () => video.play().catch(() => {});
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) play();
  else video.addEventListener('canplay', play, { once: true });
}

function toggleVideo(video) {
  if (video.paused) {
    playMutedVideo(video, true);
  } else {
    video.pause();
  }
}

function VideoLoader() {
  return (
    <span className="video-loader" aria-hidden="true">
      <span className="video-loader-mark">
        <img className="video-loader-half video-loader-upper" src="/SERDES_LEFT.svg" alt="" />
        <img className="video-loader-half video-loader-lower" src="/SERDES_RIGHT.svg" alt="" />
      </span>
      <span className="video-loader-wordmark">SERDES FIGHT CLUB</span>
    </span>
  );
}

function ScheduleLabel({ lines }) {
  return lines.map((line, index) => (
    <span key={line}>{line}{index < lines.length - 1 && <br />}</span>
  ));
}

function App({ BelowFoldComponent = BelowFoldSections }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [hoveredArt, setHoveredArt] = useState(null);
  const [language, setLanguage] = useState('en');
  const reelDrag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const copy = COPY[language];

  const startReelDrag = (event) => {
    if (event.pointerType !== 'mouse') return;
    const rail = event.currentTarget;
    reelDrag.current = { active: true, moved: false, startX: event.clientX, scrollLeft: rail.scrollLeft };
    rail.setPointerCapture(event.pointerId);
    rail.classList.add('is-dragging');
  };

  const moveReelDrag = (event) => {
    const state = reelDrag.current;
    if (!state.active) return;
    const distance = event.clientX - state.startX;
    if (Math.abs(distance) > 4) state.moved = true;
    event.currentTarget.scrollLeft = state.scrollLeft - distance;
  };

  const endReelDrag = (event) => {
    if (!reelDrag.current.active) return;
    reelDrag.current.active = false;
    event.currentTarget.classList.remove('is-dragging');
  };

  const handleReelClick = (event) => {
    if (reelDrag.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    toggleVideo(event.currentTarget);
  };

  const getArtStyle = (artName) => ({
    opacity: hoveredArt ? (hoveredArt === artName ? 1 : 0.3) : 1,
    transform: hoveredArt === artName ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.3s ease',
    cursor: 'default'
  });

  useEffect(() => {
    const languageTimer = window.setTimeout(() => {
      const savedLanguage = window.localStorage.getItem('serdes-language');
      if (savedLanguage === 'en' || savedLanguage === 'el') setLanguage(savedLanguage);
    }, 0);
    return () => window.clearTimeout(languageTimer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem('serdes-language', nextLanguage);
  };

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
    const allVideos = Array.from(document.querySelectorAll('video.card-video-bg, video.reel-video'));
    const reelVideos = allVideos.filter((video) => video.classList.contains('reel-video'));
    if (!('IntersectionObserver' in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.classList.contains('reel-video')) {
            const currentIndex = reelVideos.indexOf(video);
            loadVideoPoster(video);
            loadVideoPoster(reelVideos[currentIndex + 1]);
            if (allowsAutomaticVideo()) warmVideo(reelVideos[currentIndex + 1]);
          } else {
            loadVideoPoster(video);
          }
          playMutedVideo(video);
        } else {
          video.pause();
        }
      });
    }, { rootMargin: '100px 0px', threshold: 0.15 });

    allVideos.forEach((v) => observer.observe(v));
    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const handleVideoLoaded = (event) => {
    event.currentTarget.closest('.program-card, .reel-card')?.classList.add('is-video-ready');
  };

  return (
    <>
      <div className="page-intro" aria-hidden="true">
          <div className="intro-lockup">
            <span className="intro-logo-mark">
              <img className="intro-logo-half intro-logo-upper" src="/SERDES_LEFT.svg" alt="" />
              <img className="intro-logo-half intro-logo-lower" src="/SERDES_RIGHT.svg" alt="" />
            </span>
            <span className="intro-wordmark">SERDES FIGHT CLUB</span>
          </div>
        </div>

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${scrollDirection === 'down' ? 'hide' : ''}`}>
        <div className="container nav-container">
          <a className="logo nav-home-logo" href="#home" onClick={closeMenu} aria-label={language === 'el' ? 'Αρχική σελίδα' : 'Home'}>
            <span className="nav-logo-mark" aria-hidden="true">
              <img className="nav-logo-half nav-logo-upper" src="/SERDES_LEFT.svg" alt="" />
              <img className="nav-logo-half nav-logo-lower" src="/SERDES_RIGHT.svg" alt="" />
            </span>
            <span className="nav-logo-name">SERDES<br />FIGHT CLUB</span>
          </a>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            {copy.nav.map(([id, label]) => (
              <li key={id}><a href={`#${id}`} onClick={closeMenu}>{label}</a></li>
            ))}
          </ul>
          <div className="nav-actions">
            <div className="language-switch" role="group" aria-label={copy.language.label}>
              <button type="button" className={language === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')} aria-pressed={language === 'en'}>{copy.language.english}</button>
              <button type="button" className={language === 'el' ? 'active' : ''} onClick={() => changeLanguage('el')} aria-pressed={language === 'el'}>{copy.language.greek}</button>
            </div>
            <button type="button" className="hamburger" onClick={toggleMenu} aria-label={language === 'el' ? (isMenuOpen ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού') : (isMenuOpen ? 'Close menu' : 'Open menu')} aria-expanded={isMenuOpen}>
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </nav>

      <header id="home" className="hero">
        <picture className="hero-media" aria-hidden="true">
          <img src="/media/bg-inside2-960.webp" alt="" width="640" height="1280" fetchPriority="high" decoding="async" />
        </picture>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">{copy.hero.title} <span className="highlight">{copy.hero.accent}</span></h1>
          <p className="hero-subtitle">{copy.hero.subtitle}</p>
          <div className="hero-actions">
            <a href="#schedule" className="btn btn-primary">{copy.hero.schedule}</a>
            <a href="https://www.instagram.com/serdesfightclub/?hl=el" target="_blank" rel="noreferrer" className="btn btn-trial">{copy.hero.trial}</a>
          </div>
          <p style={{ marginTop: '15px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>{copy.hero.dropIn}</p>
        </div>
      </header>

      <section id="programs" className="programs section-padding">
        <div className="container">
          <div className="section-title">
            <h2>{copy.programs.title} <span className="highlight">{copy.programs.accent}</span></h2>
            <p>{copy.programs.intro}</p>
          </div>
          <div className="grid programs-grid" role="region" aria-label={copy.programs.title}>
            <div className="card program-card">
              <video loop muted playsInline preload="none" loading="lazy" data-poster="/posters/mma-1.webp" className="card-video-bg" onLoadedData={handleVideoLoaded}>
                <source data-src="/videos/mma-1.mp4" type="video/mp4" />
              </video>
              <VideoLoader />
              <Icon name="fist" className="program-icon" />
              <h3>{copy.programs.mma[0]}</h3>
              <p>{copy.programs.mma[1]}</p>
            </div>
            <div className="card program-card">
              <video loop muted playsInline preload="none" loading="lazy" data-poster="/posters/kick-9.webp" className="card-video-bg" onLoadedData={handleVideoLoaded}>
                <source data-src="/videos/kick-9.mp4" type="video/mp4" />
              </video>
              <VideoLoader />
              <Icon name="fire" className="program-icon" />
              <h3>{copy.programs.kick[0]}</h3>
              <p>{copy.programs.kick[1]}</p>
            </div>
            <div className="card program-card">
              <video loop muted playsInline preload="none" loading="lazy" data-poster="/posters/bjj-1.webp" className="card-video-bg" onLoadedData={handleVideoLoaded}>
                <source data-src="/videos/bjj-1.mp4" type="video/mp4" />
              </video>
              <VideoLoader />
              <Icon name="ninja" className="program-icon" />
              <h3>{copy.programs.bjj[0]}</h3>
              <p>{copy.programs.bjj[1]}</p>
            </div>
            <div className="card program-card">
              <video loop muted playsInline preload="none" loading="lazy" data-poster="/posters/kids-1.webp" className="card-video-bg" onLoadedData={handleVideoLoaded}>
                <source data-src="/videos/kids-1.mp4" type="video/mp4" />
              </video>
              <VideoLoader />
              <Icon name="child" className="program-icon" />
              <h3>{copy.programs.kids[0]}</h3>
              <p>{copy.programs.kids[1]}</p>
            </div>
            <div className="card program-card structured-kids-card">
              <img className="structured-kids-image" src="/bg-kids.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <Icon name="puzzle" className="program-icon" />
              <h3>{copy.programs.structuredKids[0]}</h3>
              <p>{copy.programs.structuredKids[1]}</p>
            </div>
            <div className="card program-card">
              <video loop muted playsInline preload="none" loading="lazy" data-poster="/posters/fitbox-1.webp" className="card-video-bg" onLoadedData={handleVideoLoaded}>
                <source data-src="/videos/fitbox-1.mp4" type="video/mp4" />
              </video>
              <VideoLoader />
              <Icon name="dumbbell" className="program-icon" />
              <h3>{copy.programs.fitbox[0]}</h3>
              <p>{copy.programs.fitbox[1]}</p>
            </div>
            <div className="card program-card pilates-card">
              <img className="card-image-bg" src="/bg-pilates.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <Icon name="spa" className="program-icon" />
              <h3>{copy.programs.pilates[0]}</h3>
              <p>{copy.programs.pilates[1]}</p>
            </div>
            <div className="card program-card">
              <video loop muted playsInline preload="none" loading="lazy" data-poster="/posters/hybrid-training.webp" className="card-video-bg" onLoadedData={handleVideoLoaded}>
                <source data-src="/videos/hybrid-training.mp4" type="video/mp4" />
              </video>
              <VideoLoader />
              <Icon name="kettlebell" className="program-icon" />
              <h3>{copy.programs.hybrid[0]}</h3>
              <p>{copy.programs.hybrid[1]}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="schedule" className="schedule section-padding" style={{ position: 'relative' }}>
        <img className="schedule-media" src="/media/schedule-bg.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-title">
            <h2>{copy.schedule.title} <span className="highlight">{copy.schedule.accent}</span></h2>
            <p>{copy.schedule.intro}</p>
          </div>
          <div className="schedule-container">
            <div className="table-responsive">
              <table className="schedule-table">
                <thead>
                  <tr>
                    {copy.schedule.headers.map((header) => <th key={header}>{header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {SCHEDULE_ROWS.map(([time, classes]) => (
                    <tr key={time}>
                      <td className="time-col">{time}</td>
                      {classes.map((artName, dayIndex) => (
                        artName ? (
                          <td
                            key={dayIndex}
                            className="class-filled"
                            onMouseEnter={() => setHoveredArt(artName)}
                            onMouseLeave={() => setHoveredArt(null)}
                            style={getArtStyle(artName)}
                          >
                            <ScheduleLabel lines={copy.schedule.classes[artName]} />
                          </td>
                        ) : <td key={dayIndex}></td>
                      ))}
                    </tr>
                  ))}
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
              <img src="/media/coach-900.webp" srcSet="/media/coach-480.webp 480w, /media/coach-900.webp 900w" sizes="(max-width: 768px) 100vw, 50vw" alt="Coach Thodoris Serdes" loading="lazy" decoding="async" />
            </div>
            <div className="instructor-info">
              <h2>{copy.instructors.title} <span className="highlight">{copy.instructors.accent}</span></h2>
              <h3>Thodoris Serdes</h3>
              <p>{copy.instructors.headDescription}</p>
              <a href="https://www.instagram.com/serdes_mma/?hl=el" target="_blank" rel="noreferrer" className="coach-instagram"><Icon name="instagram" /> @serdes_mma</a>
              <div style={{ marginTop: '10px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
                <h4 style={{ marginBottom: '5px', color: 'var(--text-main)' }}>{copy.instructors.teamTitle}</h4>
                <p style={{ fontSize: '0.95rem' }}>{copy.instructors.teamDescription}</p>
              </div>
            </div>
          </div>

          <div className="grid sub-instructors-grid" role="region" aria-label={language === 'el' ? 'Προπονητές' : 'Coaches'} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
            <div className="card instructor-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <img src="/media/coach-giannis-900.webp" srcSet="/media/coach-giannis-480.webp 480w, /media/coach-giannis-900.webp 900w" sizes="(max-width: 768px) 100vw, 50vw" alt="Giannis Ludakis" loading="lazy" decoding="async" style={{ width: '100%', height: '350px', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ padding: '25px' }}>
                <h3 style={{ marginBottom: '5px' }}>Giannis Ludakis</h3>
                <h4 style={{ color: 'var(--accent)', marginBottom: '15px', fontSize: '0.9rem' }}>{copy.instructors.giannisRole}</h4>
                <p style={{ fontSize: '0.95rem', marginBottom: '15px' }}>{copy.instructors.giannisDescription}</p>
                <a href="https://www.instagram.com/ludakisg/?hl=el" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}><Icon name="instagram" /> @ludakisg</a>
              </div>
            </div>
            
            <div className="card instructor-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <img src="/media/coach-emmanouela-900.webp" srcSet="/media/coach-emmanouela-480.webp 480w, /media/coach-emmanouela-900.webp 900w" sizes="(max-width: 768px) 100vw, 50vw" alt="Emmanouela Fakoukaki" loading="lazy" decoding="async" style={{ width: '100%', height: '350px', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ padding: '25px' }}>
                <h3 style={{ marginBottom: '5px' }}>Emmanouela Fakoukaki</h3>
                <h4 style={{ color: 'var(--accent)', marginBottom: '15px', fontSize: '0.9rem' }}>{copy.instructors.emmanouelaRole}</h4>
                <p style={{ fontSize: '0.95rem', marginBottom: '15px' }}>{copy.instructors.emmanouelaDescription}</p>
                <a href="https://www.instagram.com/emmanouela_fakoukaki_/?hl=el" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}><Icon name="instagram" /> @emmanouela_fakoukaki_</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reels" className="reels section-padding">
        <div className="container" style={{ padding: '0' }}>
          <div className="section-title">
            <h2>{copy.reels.title} <span className="highlight">{copy.reels.accent}</span></h2>
            <p>{copy.reels.intro}</p>
          </div>
          
          <div className="reels-container" style={{ padding: '0 20px' }} onPointerDown={startReelDrag} onPointerMove={moveReelDrag} onPointerUp={endReelDrag} onPointerCancel={endReelDrag}>
            {REEL_VIDEOS.map((vid, index) => (
               <div key={vid} className="reel-card">
                 <video 
                   loop 
                   muted 
                   playsInline 
                   className="reel-video"
                   preload="none"
                   loading="lazy"
                   poster={index < 2 ? `/posters/${vid.replace('.mp4', '.webp')}` : undefined}
                   data-poster={`/posters/${vid.replace('.mp4', '.webp')}`}
                   onLoadedData={handleVideoLoaded}
                   onMouseEnter={(e) => playMutedVideo(e.currentTarget, true)}
                   onMouseLeave={(e) => e.currentTarget.pause()}
                   onClick={handleReelClick}
                 >
                   <source data-src={`/videos/${vid}`} type="video/mp4" />
                 </video>
                 <VideoLoader />
               </div>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="below-fold-placeholder" aria-hidden="true" />}>
        <BelowFoldComponent copy={copy} />
      </Suspense>
    </>
  );
}

export default App;
