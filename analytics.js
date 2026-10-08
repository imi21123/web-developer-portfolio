(() => {
  const measurementId = document.querySelector('meta[name="google-analytics-id"]')?.content.trim();
  const publicSite = location.hostname === 'imi21123.github.io' && location.pathname.startsWith('/web-developer-portfolio/');
  const optOut = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  if (!/^G-[A-Z0-9]+$/.test(measurementId || '') || !publicSite || optOut) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  const siteUrl = location.origin + location.pathname;
  const knownProjects = new Map([...document.querySelectorAll('.project-view')].map(project => [project.id, project.dataset.project]));
  let currentPage = null;
  let lastLocation = '';
  let seenSections = new Set();
  function cleanReferrer(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.origin + url.pathname : '';
    } catch { return ''; }
  }
  function event(name, parameters = {}) {
    if (!currentPage) return;
    gtag('event', name, {
      send_to: measurementId,
      page_location: lastLocation,
      page_title: currentPage.title,
      ...parameters,
    });
  }
  function trackPage(detail) {
    const slug = knownProjects.has(detail.projectId) ? detail.projectId : 'home';
    if (currentPage?.slug === slug) return;
    const title = slug === 'home' ? '한채연 | 웹 개발자 포트폴리오' : `${knownProjects.get(slug)} | 한채연 웹 개발자 포트폴리오`;
    const pageLocation = siteUrl + (slug === 'home' ? '' : '#' + slug);
    const pageReferrer = lastLocation || cleanReferrer(document.referrer);
    currentPage = {slug, title};
    lastLocation = pageLocation;
    seenSections = new Set();
    event('page_view', {page_referrer: pageReferrer});
    if (slug !== 'home') event('project_view', {project_name: knownProjects.get(slug), project_id: slug});
  }
  // Pageviews are sent explicitly; also disable browser-history pageviews in GA4.
  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: siteUrl,
    page_referrer: cleanReferrer(document.referrer),
  });
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
  document.head.append(tag);
  document.addEventListener('portfolio:route-view', message => trackPage(message.detail));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || !currentPage || seenSections.has(entry.target.id)) return;
      const project = entry.target.closest('.project-view');
      if (project ? currentPage.slug !== project.id : currentPage.slug !== 'home') return;
      seenSections.add(entry.target.id);
      event(project ? 'case_view' : 'section_view', {
        section_id: entry.target.id,
        section_name: entry.target.querySelector('h1, h2')?.textContent.replace(/\s+/g, ' ').trim(),
        ...(project ? {project_name: project.dataset.project} : {}),
      });
    });
  }, {rootMargin: '-80px 0px -10% 0px', threshold: .2});
  document.querySelectorAll('#home-view>section[id], #background, .case-study').forEach(section => observer.observe(section));
  document.addEventListener('click', message => {
    const link = message.target.closest('a[href]');
    if (!link) return;
    const method = link.getAttribute('href').startsWith('mailto:') ? 'email' : link.hostname === 'github.com' ? 'github' : '';
    if (!method) return;
    event('contact_click', {
      contact_method: method,
      link_area: link.closest('.site-header') ? 'header' : link.closest('.site-footer') ? 'footer' : 'intro',
    });
  });
})();
