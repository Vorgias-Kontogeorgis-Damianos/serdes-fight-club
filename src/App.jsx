import { useState, useEffect, useRef } from 'react';
import './index.css';
import Icon from './Icon.jsx';
import { COPY } from './copy.js';

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

const GALLERY_SECTIONS = [
  {
    title: 'Inside the Club',
    description: 'Take a look inside our fully-equipped, modern training facilities designed to accommodate every martial art and fitness goal.',
    className: 'grid-2x2',
    images: [
      ['school1.jpg', 'School Facility'], ['building-new4.jpg', 'Gym Exterior Sign'],
      ['building-new5.jpg', 'Gym Interior Equipment'], ['school4.jpg', 'School Facility'],
    ],
  },
  {
    title: 'Pros & Visitors',
    description: 'We frequently accommodate professional fighters looking for high-level training camps, as well as visiting amateurs and martial artists dropping in for 1-on-1 sessions or group classes.',
    className: 'grid-2x2',
    images: [
      ['gallery-jack1.jpg', 'Pro Fighter Jack Grant Sparring'], ['gallery-jack2.jpg', 'Pro Fighter Jack Grant Training'],
      ['gallery-jack3.jpg', 'Pro Fighter Grappling'], ['gallery-visitor.jpg', 'Visiting Amateur Fighter'],
    ],
  },
  {
    title: 'Seminars & Special Events',
    description: 'We regularly host and attend world-class seminars with elite martial artists to continually expand our knowledge.',
    images: [
      ['gallery-seminar.jpg', 'BJJ Seminar Poster'], ['gallery-seminar2.jpg', 'UFC Seminar Event'], ['gallery-seminar3.jpg', 'MMA Seminar Banner'],
    ],
  },

  {
    title: 'Our Fight Team',
    description: 'We maintain a strong, active presence in local and national competitions across Kickboxing, MMA, and BJJ.',
    images: [
      ['comp1.jpg', 'Fight Team in Ring'], ['comp2.jpg', 'Female Fighter Victory'], ['comp3.jpg', 'Medal Winner and Cage Action'],
      ['comp4.jpg', 'Fight Team Outside Cage'], ['comp5.jpg', 'Fight Team Group Shot'], ['comp6.jpg', 'Fight Team Crowd'],
      ['comp8.jpg', 'Fight Team Gym'], ['comp10.jpg', 'Fight Team Action'], ['comp11.jpg', 'Fight Team Competition'],
    ],
  },
];

function playMutedVideo(video) {
  const play = () => video.play().catch(() => {});
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) play();
  else video.addEventListener('canplay', play, { once: true });
}

function toggleVideo(video) {
  if (video.paused) {
    playMutedVideo(video);
  } else {
    video.pause();
  }
}

function ScheduleLabel({ lines }) {
  return lines.map((line, index) => (
    <span key={line}>{line}{index < lines.length - 1 && <br />}</span>
  ));
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [hoveredArt, setHoveredArt] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
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
    const savedLanguage = window.localStorage.getItem('serdes-language');
    if (savedLanguage === 'en' || savedLanguage === 'el') {
      setLanguage(savedLanguage);
    } else {
      setLanguage('en');
    }
    const loaderTimer = window.setTimeout(() => setIsLoading(false), 2600);
    return () => {
      window.clearTimeout(loaderTimer);
    };
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
    if (!('IntersectionObserver' in window)) {
      allVideos.forEach(playMutedVideo);
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          playMutedVideo(video);
        } else {
          video.pause();
        }
      });
    }, { rootMargin: '150px 0px', threshold: 0.1 });

    allVideos.forEach((v) => observer.observe(v));
    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <div className={`page-loader ${isLoading ? '' : 'is-hidden'}`} aria-hidden={!isLoading}>
        <div className="loader-mark" aria-label="Serdes Fight Club">
          <img className="loader-logo-half loader-logo-left" src="/SERDES_LEFT.svg" alt="" />
          <img className="loader-logo-half loader-logo-right" src="/SERDES_RIGHT.svg" alt="" />
        </div>
        <span className="loader-name">SERDES FIGHT CLUB</span>
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

      <header id="home" className="hero" style={{ backgroundImage: "url('/media/bg-inside2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
          <div className="grid programs-grid">
            <div className="card program-card">
              <video autoPlay loop muted playsInline preload="metadata" className="card-video-bg">
                <source src="/videos/mma-1.mp4" type="video/mp4" />
              </video>
              <i className="fas fa-fist-raised fa-3x program-icon"></i>
              <h3>{copy.programs.mma[0]}</h3>
              <p>{copy.programs.mma[1]}</p>
            </div>
            <div className="card program-card">
              <video autoPlay loop muted playsInline preload="metadata" className="card-video-bg">
                <source src="/videos/kick-9.mp4" type="video/mp4" />
              </video>
              <i className="fas fa-fire fa-3x program-icon"></i>
              <h3>{copy.programs.kick[0]}</h3>
              <p>{copy.programs.kick[1]}</p>
            </div>
            <div className="card program-card">
              <video autoPlay loop muted playsInline preload="metadata" className="card-video-bg">
                <source src="/videos/bjj-1.mp4" type="video/mp4" />
              </video>
              <i className="fas fa-user-ninja fa-3x program-icon"></i>
              <h3>{copy.programs.bjj[0]}</h3>
              <p>{copy.programs.bjj[1]}</p>
            </div>
            <div className="card program-card">
              <video autoPlay loop muted playsInline preload="metadata" className="card-video-bg">
                <source src="/videos/kids-1.mp4" type="video/mp4" />
              </video>
              <i className="fas fa-child fa-3x program-icon"></i>
              <h3>{copy.programs.kids[0]}</h3>
              <p>{copy.programs.kids[1]}</p>
            </div>
            <div className="card program-card structured-kids-card">
              <img className="structured-kids-image" src="/bg-kids.png" alt="" aria-hidden="true" decoding="async" />
              <i className="fas fa-puzzle-piece fa-3x program-icon"></i>
              <h3>{copy.programs.structuredKids[0]}</h3>
              <p>{copy.programs.structuredKids[1]}</p>
            </div>
            <div className="card program-card">
              <video autoPlay loop muted playsInline preload="metadata" className="card-video-bg">
                <source src="/videos/fitbox-1.mp4" type="video/mp4" />
              </video>
              <i className="fas fa-dumbbell fa-3x program-icon"></i>
              <h3>{copy.programs.fitbox[0]}</h3>
              <p>{copy.programs.fitbox[1]}</p>
            </div>
            <div className="card program-card pilates-card" style={{ backgroundImage: "url('/bg-pilates.png')" }}>
              <i className="fas fa-spa fa-3x program-icon"></i>
              <h3>{copy.programs.pilates[0]}</h3>
              <p>{copy.programs.pilates[1]}</p>
            </div>
            <div className="card program-card">
              <video autoPlay loop muted playsInline preload="metadata" className="card-video-bg">
                <source src="/videos/hybrid-training.mp4" type="video/mp4" />
              </video>
              <Icon name="kettlebell" className="program-icon" />
              <h3>{copy.programs.hybrid[0]}</h3>
              <p>{copy.programs.hybrid[1]}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="schedule" className="schedule section-padding" style={{ backgroundImage: "url('/media/schedule-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
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
              <img src="/media/coach.jpg" alt="Coach Thodoris Serdes" loading="eager" fetchPriority="high" decoding="async" />
            </div>
            <div className="instructor-info">
              <h2>{copy.instructors.title} <span className="highlight">{copy.instructors.accent}</span></h2>
              <h3>Thodoris Serdes</h3>
              <p>{copy.instructors.headDescription}</p>
              <a href="https://www.instagram.com/serdes_mma/?hl=el" target="_blank" rel="noreferrer" className="btn btn-primary" style={{marginTop: '15px', marginBottom: '15px'}}>{copy.instructors.follow}</a>
              <div style={{ marginTop: '10px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
                <h4 style={{ marginBottom: '5px', color: 'var(--text-main)' }}>{copy.instructors.teamTitle}</h4>
                <p style={{ fontSize: '0.95rem' }}>{copy.instructors.teamDescription}</p>
              </div>
            </div>
          </div>

          <div className="grid sub-instructors-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
            <div className="card instructor-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <img src="/media/coach-giannis.jpg" alt="Giannis Ludakis" loading="lazy" decoding="async" style={{ width: '100%', height: '350px', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ padding: '25px' }}>
                <h3 style={{ marginBottom: '5px' }}>Giannis Ludakis</h3>
                <h4 style={{ color: 'var(--accent)', marginBottom: '15px', fontSize: '0.9rem' }}>{copy.instructors.giannisRole}</h4>
                <p style={{ fontSize: '0.95rem', marginBottom: '15px' }}>{copy.instructors.giannisDescription}</p>
                <a href="https://www.instagram.com/ludakisg/?hl=el" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}><Icon name="instagram" /> @ludakisg</a>
              </div>
            </div>
            
            <div className="card instructor-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px' }}>
              <img src="/media/coach-emmanouela.jpg" alt="Emmanouela Fakoukaki" loading="lazy" decoding="async" style={{ width: '100%', height: '350px', objectFit: 'cover', objectPosition: 'top' }} />
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
            {REEL_VIDEOS.map((vid) => (
               <div key={vid} className="reel-card">
                 <video 
                   loop 
                   muted 
                   playsInline 
                   className="reel-video"
                   preload="metadata"
                   autoPlay
                   onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                   onMouseLeave={(e) => e.currentTarget.pause()}
                   onClick={handleReelClick}
                 >
                   <source src={`/videos/${vid}#t=1.5`} type="video/mp4" />
                 </video>
               </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery section-padding bg-dark">
        <div className="container">
          <div className="section-title">
            <h2>{copy.gallery.title} <span className="highlight">{copy.gallery.accent}</span></h2>
            <p>{copy.gallery.intro}</p>
          </div>
          
          {GALLERY_SECTIONS.map(({ className = '', images }, sectionIndex) => (
            <section className="gallery-category" key={copy.gallery.sections[sectionIndex][0]}>
              <div className="category-header">
                <h3>{copy.gallery.sections[sectionIndex][0]}</h3>
                <p>{copy.gallery.sections[sectionIndex][1]}</p>
              </div>
              <div className={`grid gallery-grid ${className}`}>
                {images.map(([fileName, alt]) => (
                  <img key={fileName} src={`/media/${fileName}`} alt={alt} className="gallery-img" loading={sectionIndex === 0 ? 'eager' : 'lazy'} decoding="async" />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section id="reviews" className="reviews section-padding bg-dark">
        <div className="container">
          <div className="section-title">
            <h2>{copy.reviews.title} <span className="highlight">{copy.reviews.accent}</span></h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px', fontSize: '1.2rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{copy.reviews.rating}</span>
              <div>
                <Icon name="star" style={{ color: 'var(--accent)' }} />
                <Icon name="star" style={{ color: 'var(--accent)' }} />
                <Icon name="star" style={{ color: 'var(--accent)' }} />
                <Icon name="star" style={{ color: 'var(--accent)' }} />
                <Icon name="star" style={{ color: 'var(--accent)' }} />
              </div>
            </div>
          </div>
          <div className="grid reviews-grid">
            <div className="card review-card" style={{ padding: '25px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: '0.95rem' }}>{copy.reviews.quotes[0]}</p>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>- Jack Grant MMA</h4>
            </div>

            <div className="card review-card" style={{ padding: '25px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: '0.95rem' }}>{copy.reviews.quotes[1]}</p>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>- fit_sala</h4>
            </div>

            <div className="card review-card" style={{ padding: '25px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: '0.95rem' }}>{copy.reviews.quotes[2]}</p>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>- Ryan Spitz</h4>
            </div>

            <div className="card review-card" style={{ padding: '25px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: '0.95rem' }}>{copy.reviews.quotes[3]}</p>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>- Georgios Drakonakis</h4>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing section-padding">
        <div className="container">
          <div className="section-title">
            <h2>{copy.pricing.title} <span className="highlight">{copy.pricing.accent}</span></h2>
            <p>{copy.pricing.intro}</p>
          </div>
          <div className="grid pricing-grid">
            <div className="card pricing-card">
              <h3>{copy.pricing.striking[0]}</h3>
              <div className="price">€45<span>{copy.pricing.month}</span></div>
              <ul className="pricing-features">
                <li><Icon name="check" /> {copy.pricing.striking[1]}</li>
                <li><Icon name="plus" className="highlight" /> {copy.pricing.striking[2]}</li>
                <li><Icon name="plus" className="highlight" /> {copy.pricing.striking[3]}</li>
              </ul>
            </div>
            <div className="card pricing-card">
              <h3>{copy.pricing.grappling[0]}</h3>
              <div className="price">€45<span>{copy.pricing.month}</span></div>
              <ul className="pricing-features">
                <li><Icon name="check" /> {copy.pricing.grappling[1]}</li>
                <li><Icon name="plus" className="highlight" /> {copy.pricing.grappling[2]}</li>
                <li><Icon name="plus" className="highlight" /> {copy.pricing.grappling[3]}</li>
              </ul>
            </div>
            <div className="card pricing-card featured">
              <div className="featured-badge">{copy.pricing.best}</div>
              <h3>{copy.pricing.ultimate[0]}</h3>
              <div className="price">€60<span>{copy.pricing.month}</span></div>
              <ul className="pricing-features">
                {copy.pricing.ultimate.slice(1).map((feature) => <li key={feature}><Icon name="check" /> {feature}</li>)}
              </ul>
            </div>
            <div className="card pricing-card">
              <h3>{copy.pricing.kids[0]}</h3>
              <div className="price">€40<span>{copy.pricing.month}</span></div>
              <ul className="pricing-features">
                {copy.pricing.kids.slice(1).map((feature) => <li key={feature}><Icon name="check" /> {feature}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="faq section-padding bg-dark">
        <div className="container">
          <div className="section-title">
            <h2>{copy.faq.title} <span className="highlight">{copy.faq.accent}</span></h2>
            <p>{copy.faq.intro}</p>
          </div>
          <div className="faq-container">
            {copy.faq.items.map(([question, answer], index) => (
              <div className="faq-item" key={question}>
                <h3>{index + 1}. {question}</h3>
                <p>{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact section-padding">
        <div className="container">
          <div className="section-title">
            <h2>{copy.contact.title} <span className="highlight">{copy.contact.accent}</span></h2>
            <p>{copy.contact.intro}</p>
          </div>
          <div className="grid contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <Icon name="map" />
                <div>
                  <h4>{copy.contact.address}</h4>
                  <p>{copy.contact.location}</p>
                </div>
              </div>
              <div className="contact-item">
                <Icon name="phone" />
                <div>
                  <h4>{copy.contact.phone}</h4>
                  <p><a href="tel:+306957405110" style={{color: 'var(--text-muted)'}}>695 740 5110</a></p>
                </div>
              </div>
              <div className="contact-item">
                <Icon name="instagram" />
                <div>
                  <h4>Instagram</h4>
                  <p><a href="https://www.instagram.com/serdesfightclub/?hl=el" target="_blank" rel="noreferrer" style={{color: 'var(--text-muted)'}}>@serdesfightclub</a></p>
                </div>
              </div>
              <div className="contact-item">
                <Icon name="tiktok" />
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
              <Icon name="instagram" />
            </a>
            <a href="https://www.tiktok.com/@serdesfightclubofficial" target="_blank" rel="noreferrer">
              <Icon name="tiktok" />
            </a>
          </div>
          <p>{copy.footer}</p>
        </div>
      </footer>
    </>
  );
}

export default App;
