const endpoint = import.meta.env.VITE_RUM_ENDPOINT;
const pageId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;

function emit(name, value, rating) {
  const metric = { name, value: Math.round(value * 100) / 100, rating, pageId, path: location.pathname };
  window.dispatchEvent(new CustomEvent('serdes:web-vital', { detail: metric }));
  if (!endpoint) return;
  const body = new Blob([JSON.stringify(metric)], { type: 'application/json' });
  if (!navigator.sendBeacon(endpoint, body)) fetch(endpoint, { method: 'POST', body, keepalive: true }).catch(() => {});
}

const rate = (value, good, poor) => value <= good ? 'good' : value <= poor ? 'needs-improvement' : 'poor';

let lcp = 0;
const supported = globalThis.PerformanceObserver?.supportedEntryTypes || [];
if (supported.includes('largest-contentful-paint')) {
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    lcp = entries.at(-1)?.startTime || lcp;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
}

let cls = 0;
if (supported.includes('layout-shift')) {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) cls += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
}

let inp = 0;
if (supported.includes('event')) {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) inp = Math.max(inp, entry.duration);
  }).observe({ type: 'event', buffered: true, durationThreshold: 40 });
}

addEventListener('pagehide', () => {
  if (lcp) emit('LCP', lcp, rate(lcp, 2500, 4000));
  emit('CLS', cls, rate(cls, 0.1, 0.25));
  if (inp) emit('INP', inp, rate(inp, 200, 500));
}, { once: true });
