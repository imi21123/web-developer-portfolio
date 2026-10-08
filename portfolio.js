(() => {
  const pages = [...document.querySelectorAll('.page')];
  const select = document.getElementById('page-select');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const mode = document.getElementById('mode');
  const status = document.getElementById('page-status');
  let current = 0;
  let single = false;
  pages.forEach((page, i) => select.add(new Option(`${String(i + 1).padStart(2, '0')} · ${page.dataset.title}`, i)));
  function sync(i) {
    current = Math.max(0, Math.min(pages.length - 1, i));
    select.value = String(current);
    prev.disabled = current === 0;
    next.disabled = current === pages.length - 1;
    pages.forEach((p, index) => p.classList.toggle('is-current', index === current));
    status.textContent = `${current + 1} / ${pages.length} · ${pages[current].dataset.title}`;
  }
  function go(i) {
    sync(i);
    history.replaceState(null, '', `#${pages[current].id}`);
    pages[current].scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
  }
  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  select.addEventListener('change', () => go(Number(select.value)));
  mode.addEventListener('click', () => {
    single = !single;
    document.body.classList.toggle('single-view', single);
    mode.setAttribute('aria-pressed', String(single));
    mode.textContent = single ? '전체 보기' : '한 장씩 보기';
    go(current);
  });
  document.addEventListener('keydown', event => {
    if (event.target.closest('input, textarea, select, [contenteditable=true]') || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); go(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(current - 1); }
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#page-"]');
    if (!link) return;
    const index = pages.findIndex(p => `#${p.id}` === link.getAttribute('href'));
    if (index >= 0) { event.preventDefault(); go(index); }
  });
  const observer = new IntersectionObserver(entries => {
    if (single) return;
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible.length) sync(pages.indexOf(visible[0].target));
  }, {rootMargin: '-66px 0px -15% 0px', threshold: [0.25, 0.5, 0.75]});
  pages.forEach(p => observer.observe(p));
  const initial = pages.findIndex(p => `#${p.id}` === location.hash);
  sync(initial >= 0 ? initial : 0);
  window.addEventListener('hashchange', () => {
    const index = pages.findIndex(p => `#${p.id}` === location.hash);
    if (index >= 0) go(index);
  });
})();
