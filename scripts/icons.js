const I={
  home:'<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
  doc:'<path d="M14 3v5h5M8 13h8M8 17h8M8 9h2"/><path d="M14 3H6v18h12V8z"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  pulse:'<path d="M3 12h4l2-6 4 12 2-6h6"/>',
  link:'<path d="M9 17H7A5 5 0 017 7h2M15 7h2a5 5 0 010 10h-2M8 12h8"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  spark:'<path d="M12 3l2.1 5.5L20 10l-5.9 1.5L12 17l-2.1-5.5L4 10l5.9-1.5z"/>',
  bolt:'<path d="M13 2L3 14h7l-1 8 10-12h-7z"/>',
  pill:'<rect x="3" y="9" width="18" height="6" rx="3"/><path d="M12 9v6"/>',
  walk:'<circle cx="13" cy="4" r="2"/><path d="M12 8l-2 5 3 2 1 5M10 13l-3 1M15 10l3 1"/>',
  wound:'<path d="M12 3v18M8 7l8 10M16 7L8 17"/>',
  sleep:'<path d="M20 14A8 8 0 118 2a6 6 0 0012 12z"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  warn:'<path d="M12 2l10 18H2z"/><path d="M12 9v5M12 17h.01" stroke="#fff"/>',
  bell:'<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.5 21a2 2 0 01-3 0"/>',
  phone:'<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8 9.5a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
  heart:'<path d="M12 21C5 14 3 11 3 8a4.5 4.5 0 019-1 4.5 4.5 0 019 1c0 3-2 6-9 13z"/>',
  drop:'<path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z"/>',
  food:'<path d="M4 3v7a3 3 0 006 0V3M7 3v18M15 3c-1.5 1-2 3-2 5s.5 4 2 5v8"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M20 14A8 8 0 118 2a6 6 0 0012 12z"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22V4"/>',
  play:'<path d="M6 4l14 8-14 8z"/>',
  send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>'
};
function svg(p,w){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w||2}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`}

