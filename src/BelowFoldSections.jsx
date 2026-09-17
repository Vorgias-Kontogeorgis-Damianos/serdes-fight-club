import Icon from './Icon.jsx';

const GALLERY_SECTIONS = [
  {
    className: 'grid-2x2',
    images: [
      ['school1.webp', 'School Facility'], ['building-new4.webp', 'Gym Exterior Sign'],
      ['building-new5.webp', 'Gym Interior Equipment'], ['school4.webp', 'School Facility'],
    ],
  },
  {
    className: 'grid-2x2',
    images: [
      ['gallery-jack1.webp', 'Pro Fighter Jack Grant Sparring'], ['gallery-jack2.webp', 'Pro Fighter Jack Grant Training'],
      ['gallery-jack3.webp', 'Pro Fighter Grappling'], ['gallery-visitor.webp', 'Visiting Amateur Fighter'],
    ],
  },
  {
    images: [
      ['gallery-seminar.webp', 'BJJ Seminar Poster'], ['gallery-seminar2.webp', 'UFC Seminar Event'], ['gallery-seminar3.webp', 'MMA Seminar Banner'],
    ],
  },
  {
    images: [
      ['comp1.webp', 'Fight Team in Ring'], ['comp2.webp', 'Female Fighter Victory'], ['comp3.webp', 'Medal Winner and Cage Action'],
      ['comp4.webp', 'Fight Team Outside Cage'], ['comp5.webp', 'Fight Team Group Shot'], ['comp6.webp', 'Fight Team Crowd'],
      ['comp8.webp', 'Fight Team Gym'], ['comp10.webp', 'Fight Team Action'], ['comp11.webp', 'Fight Team Competition'],
    ],
  },
];

export default function BelowFoldSections({ copy }) {
  return (
    <>
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
                  <img key={fileName} src={`/media/${fileName}`} alt={alt} className="gallery-img" loading="lazy" decoding="async" />
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
              <div>{Array.from({ length: 5 }, (_, index) => <Icon name="star" style={{ color: 'var(--accent)' }} key={index} />)}</div>
            </div>
          </div>
          <div className="grid reviews-grid">
            {copy.reviews.quotes.map((quote, index) => (
              <div className="card review-card" style={{ padding: '25px', backgroundColor: 'var(--secondary-bg)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }} key={quote}>
                <p style={{ fontStyle: 'italic', marginBottom: '15px', fontSize: '0.95rem' }}>{quote}</p>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>- {['Jack Grant MMA', 'fit_sala', 'Ryan Spitz', 'Georgios Drakonakis'][index]}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing section-padding">
        <div className="container">
          <div className="section-title">
            <h2>{copy.pricing.title} <span className="highlight">{copy.pricing.accent}</span></h2>
            <p>{copy.pricing.intro}</p>
          </div>
          <div className="grid pricing-grid" role="region" aria-label={copy.pricing.title}>
            {[['striking', 45], ['grappling', 45]].map(([plan, price]) => (
              <div className="card pricing-card" key={plan}>
                <h3>{copy.pricing[plan][0]}</h3>
                <div className="price">€{price}<span>{copy.pricing.month}</span></div>
                <ul className="pricing-features">
                  <li><Icon name="check" /> {copy.pricing[plan][1]}</li>
                  <li><Icon name="plus" className="highlight" /> {copy.pricing[plan][2]}</li>
                  <li><Icon name="plus" className="highlight" /> {copy.pricing[plan][3]}</li>
                </ul>
              </div>
            ))}
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
              <div className="contact-item"><Icon name="map" /><div><h4>{copy.contact.address}</h4><p>{copy.contact.location}</p></div></div>
              <div className="contact-item"><Icon name="phone" /><div><h4>{copy.contact.phone}</h4><p><a href="tel:+306957405110" style={{ color: 'var(--text-muted)' }}>695 740 5110</a></p></div></div>
              <div className="contact-item"><Icon name="instagram" /><div><h4>Instagram</h4><p><a href="https://www.instagram.com/serdesfightclub/?hl=el" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>@serdesfightclub</a></p></div></div>
              <div className="contact-item"><Icon name="tiktok" /><div><h4>TikTok</h4><p><a href="https://www.tiktok.com/@serdesfightclubofficial" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>@serdesfightclubofficial</a></p></div></div>
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
                title={copy.contact.location}
              />
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-content">
          <div className="logo" style={{ marginBottom: '10px' }}>
            <img src="/logo2.png" alt="Serdes Fight Club" width="258" height="90" loading="lazy" decoding="async" style={{ height: '90px', width: 'auto' }} />
          </div>
          <div className="social-links" style={{ display: 'flex', gap: '20px', fontSize: '1.5rem', marginBottom: '10px' }}>
            <a href="https://www.instagram.com/serdesfightclub/?hl=el" target="_blank" rel="noreferrer"><Icon name="instagram" /></a>
            <a href="https://www.tiktok.com/@serdesfightclubofficial" target="_blank" rel="noreferrer"><Icon name="tiktok" /></a>
          </div>
          <p>{copy.footer}</p>
        </div>
      </footer>
    </>
  );
}
