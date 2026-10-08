(() => {
  const home = document.getElementById('home-view');
  const projects = [...document.querySelectorAll('.project-view')];
  const siteNav = document.getElementById('site-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const topButton = document.querySelector('.back-to-top');
  const routeStatus = document.getElementById('route-status');
  const legacy = JSON.parse(document.getElementById('legacy-routes').textContent);
  const mainLinks = [...siteNav.querySelectorAll('a[href^="#"]')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let sectionObserver;
  let activeProject = null;
  function closeMenu() {
    siteNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '메뉴 열기');
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    siteNav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuToggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    closeMenu();
    if (location.hash === link.hash) {
      event.preventDefault();
      renderRoute(true);
    }
  });
  matchMedia('(max-width: 640px)').addEventListener('change', closeMenu);
  function setMainActive(id) {
    mainLinks.forEach(link => {
      if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function observeSections(project) {
    sectionObserver?.disconnect();
    const links = project ? [...project.querySelectorAll('.case-toc a')] : mainLinks;
    const targets = project ? [project.querySelector('.project-hero'), ...project.querySelectorAll('.case-study')] : [...home.querySelectorAll('section[id]')];
    sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      const target = visible[0].target;
      const id = target.classList.contains('project-hero') ? project.id : target.id;
      if (!project) setMainActive(id);
      else links.forEach(link => {
        if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin: '-100px 0px -48% 0px', threshold: 0});
    targets.forEach(target => sectionObserver.observe(target));
  }
  function renderRoute(shouldFocus = false) {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = 'intro'; }
    const oldPage = /^page-(\d+)$/.exec(id);
    if (oldPage && legacy[oldPage[1]]) {
      id = legacy[oldPage[1]];
      history.replaceState(null, '', '#' + id);
    }
    let target = document.getElementById(id || 'intro');
    if (!target) target = document.getElementById('intro');
    const project = target.closest('.project-view');
    home.hidden = Boolean(project);
    projects.forEach(view => { view.hidden = view !== project; });
    activeProject = project;
    document.title = project ? `${project.dataset.project} | 한채연 웹 개발자 포트폴리오` : '한채연 | 웹 개발자 포트폴리오';
    document.dispatchEvent(new CustomEvent('portfolio:route-view', {detail: {projectId: project?.id || null}}));
    if (project) setMainActive('projects');
    else setMainActive(target.id);
    observeSections(project);
    routeStatus.textContent = project ? `${project.dataset.project} 프로젝트 상세` : `${target.querySelector('h1, h2')?.textContent || '포트폴리오'}`;
    requestAnimationFrame(() => {
      target.scrollIntoView({block: 'start', behavior: shouldFocus && !reduceMotion.matches ? 'smooth' : 'instant'});
      if (shouldFocus) {
        const heading = target.querySelector('h1, h2') || target;
        heading.setAttribute('tabindex', '-1');
        heading.focus({preventScroll: true});
      }
    });
  }
  window.addEventListener('hashchange', () => renderRoute(true));
  renderRoute();
  document.fonts.ready.then(() => renderRoute());
  document.querySelectorAll('.history-filters button').forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      document.querySelectorAll('.history-filters button').forEach(item => {
        const selected = item === button;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      const items = [...document.querySelectorAll('.history-list>li')];
      items.forEach(item => { item.hidden = filter !== 'all' && item.dataset.category !== filter; });
      document.getElementById('history-status').textContent = `${button.textContent} 이력 ${items.filter(item => !item.hidden).length}개`;
    });
  });
  let scrollScheduled = false;
  window.addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      topButton.hidden = window.scrollY < 640;
      scrollScheduled = false;
    });
  }, {passive: true});
  topButton.addEventListener('click', () => {
    const heading = (activeProject || home).querySelector('h1');
    window.scrollTo({top: 0, behavior: reduceMotion.matches ? 'instant' : 'smooth'});
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({preventScroll: true});
  });
})();
