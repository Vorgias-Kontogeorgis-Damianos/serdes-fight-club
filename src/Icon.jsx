const glyphs = {
  menu: '\u2630', fist: '\u2726', fire: '\u2668', ninja: '\u25c8', child: '\u2605', puzzle: '\u25c6', dumbbell: '\u25b0', spa: '\u273f',
  star: '\u2605', check: '\u2713', plus: '+', map: '\u2316', phone: '\u260e',
};

export default function Icon({ name, className = '', style }) {
  if (name === 'kettlebell') {
    return <svg className={`icon icon-${name} ${className}`} style={style} viewBox="0 0 64 64" aria-hidden="true" fill="currentColor"><path d="M23 19a9 9 0 1 1 18 0v3.2a22 22 0 0 1 13 20.1C54 54.3 44.2 62 32 62S10 54.3 10 42.3a22 22 0 0 1 13-20.1V19Zm6 1.1a22.9 22.9 0 0 1 6 0V19a3 3 0 1 0-6 0v1.1ZM32 26c-8.8 0-16 7.3-16 16.3C16 50.6 22.5 56 32 56s16-5.4 16-13.7C48 33.3 40.8 26 32 26Z" /></svg>;
  }
  if (name === 'instagram') {
    return <svg className={`icon icon-${name} ${className}`} style={style} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
  }
  if (name === 'tiktok') {
    return <svg className={`icon icon-${name} ${className}`} style={style} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M14 3v10.1a4.8 4.8 0 1 1-3.3-4.57v2.65a2.25 2.25 0 1 0 1.1 1.93V3h2.2c.5 2.2 1.8 3.55 4 3.95v2.23A8.1 8.1 0 0 1 14 7.85V3Z" /></svg>;
  }
  if (name === 'map') {
    return <svg className={`icon icon-${name} ${className}`} style={style} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
  }
  if (name === 'phone') {
    return <svg className={`icon icon-${name} ${className}`} style={style} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .8 2.9a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.9.7 2.9.8a2 2 0 0 1 1.6 1.9Z" /></svg>;
  }
  return <span className={`icon icon-${name} ${className}`} style={style} aria-hidden="true">{glyphs[name] || '\u2022'}</span>;
}
