(() => {
  'use strict';

  const scriptUrl = new URL(document.currentScript.src);
  const marker = '/assets/js/site.js';
  const rootPath = scriptUrl.pathname.endsWith(marker)
    ? scriptUrl.pathname.slice(0, -marker.length)
    : '';

  const pathFor = (path = '') => `${rootPath}/${path}`.replace(/\/{2,}/g, '/');
  const assetUrl = (path) => new URL(pathFor(path), window.location.origin).href;
  const externalAttrs = 'target="_blank" rel="noopener noreferrer"';

  const navigation = [
    ['Home', ''],
    ['Research', 'research/'],
    ['Publications', 'publications/'],
    ['Projects', 'projects/'],
    ['Teaching', 'teaching/'],
    ['News', 'news/'],
    ['Contact', 'contact/']
  ];

  async function loadJson(path) {
    const response = await fetch(assetUrl(path));
    if (!response.ok) throw new Error(`Could not load ${path}`);
    return response.json();
  }

  function renderHeader() {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;
    const currentPage = document.body.dataset.page || 'home';
    const links = navigation.map(([label, path]) => {
      const pageKey = label.toLowerCase();
      const active = currentPage === pageKey || (currentPage === 'project' && pageKey === 'projects');
      return `<a href="${pathFor(path)}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
    }).join('');

    header.innerHTML = `
      <div class="nav-shell">
        <a class="site-mark" href="${pathFor('')}" aria-label="Academic homepage">
          <span class="site-mark-monogram" aria-hidden="true">YN</span>
          <span class="site-mark-text">Xingzhao Guo</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
          <span class="sr-only">Toggle navigation</span>
          <span></span><span></span><span></span>
        </button>
        <nav class="primary-nav" id="primary-navigation" aria-label="Primary navigation">${links}</nav>
      </div>`;

    const button = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.primary-nav');
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
  }

  function renderFooter(profile) {
    const footer = document.querySelector('[data-site-footer]');
    if (!footer) return;
    const year = new Date().getFullYear();
    const academicLinks = [
      `<a href="mailto:${profile.email}">Email</a>`,
      profile.links.github ? `<a href="${profile.links.github}" ${externalAttrs}>GitHub</a>` : '',
      profile.links.google_scholar ? `<a href="${profile.links.google_scholar}" ${externalAttrs}>Google Scholar</a>` : '',
      `<a href="${pathFor('team/')}">Team</a>`,
      `<a href="${pathFor('cv/')}">CV</a>`
    ].filter(Boolean).join('');
    footer.innerHTML = `
      <div class="footer-shell">
        <div>
          <p class="footer-name">${profile.name}</p>
          <p>${profile.title} · ${profile.institution}</p>
        </div>
        <div class="footer-links">${academicLinks}</div>
        <p class="copyright">© ${year} ${profile.name}. Built for GitHub Pages.</p>
      </div>`;
  }

  function profileLinks(profile) {
    return [
      `<a href="mailto:${profile.email}">Email</a>`,
      profile.links.google_scholar ? `<a href="${profile.links.google_scholar}" ${externalAttrs}>Google Scholar</a>` : '',
      profile.links.orcid ? `<a href="${profile.links.orcid}" ${externalAttrs}>ORCID</a>` : '',
      profile.links.github ? `<a href="${profile.links.github}" ${externalAttrs}>GitHub</a>` : ''
    ].filter(Boolean).join('');
  }

  function projectCard(project) {
    const projectUrl = project.has_detail === false ? '' : pathFor(`projects/${project.id}/`);
    const image = projectUrl
      ? `<a class="project-image-link" href="${projectUrl}" tabindex="-1" aria-hidden="true"><img src="${assetUrl(project.image)}" alt="" width="720" height="440" loading="lazy"></a>`
      : `<div class="project-image-link"><img src="${assetUrl(project.image)}" alt="" width="720" height="440" loading="lazy"></div>`;
    const title = projectUrl ? `<a href="${projectUrl}">${project.title}</a>` : project.title;
    const action = projectUrl
      ? `<a class="text-link" href="${projectUrl}">View Project <span aria-hidden="true">→</span></a>`
      : `<span class="project-card-note">${project.funding || 'Research project'}</span>`;
    return `
      <article class="project-card reveal">
        ${image}
        <div class="project-card-body">
          <div class="project-meta"><span>${project.period}</span><span>${project.status}</span></div>
          <h3>${title}</h3>
          <p>${project.summary}</p>
          ${action}
        </div>
      </article>`;
  }

  function publicationItem(item) {
    const links = [
      item.pdf ? `<a href="${assetUrl(item.pdf)}">PDF</a>` : '<span class="link-placeholder" title="Add a PDF path in publications.json">PDF</span>',
      item.doi ? `<a href="${item.doi}" ${externalAttrs}>DOI</a>` : ''
    ].filter(Boolean).join('<span aria-hidden="true">·</span>');
    return `
      <li class="publication-item">
        <div class="publication-year">${item.year}</div>
        <div>
          <h3>${item.title}</h3>
          <p class="publication-authors">${item.authors}</p>
          <p class="publication-venue"><em>${item.venue}</em> · ${item.type}</p>
          <div class="publication-links">${links}</div>
        </div>
      </li>`;
  }

  function newsItem(item) {
    const date = new Date(`${item.date}T00:00:00`);
    const label = item.display_date || date.toLocaleDateString('en', { year: 'numeric', month: 'short', day: '2-digit' });
    const title = item.url ? `<a href="${item.url}">${item.title}</a>` : item.title;
    return `<article class="news-item"><time datetime="${item.date}">${label}</time><p>${title}</p></article>`;
  }

  async function renderHome(profile) {
    const [projects, publications, news, cv] = await Promise.all([
      loadJson('assets/data/projects.json'),
      loadJson('assets/data/publications.json'),
      loadJson('assets/data/news.json'),
      loadJson('assets/data/cv.json')
    ]);
    document.querySelector('[data-profile-name]').innerHTML = `${profile.name}${profile.name_zh ? `<small>${profile.name_zh}</small>` : ''}`;
    document.querySelector('[data-profile-role]').textContent = `${profile.title} · ${profile.department}`;
    document.querySelector('[data-profile-affiliation]').textContent = profile.institution;
    document.querySelector('[data-profile-statement]').textContent = profile.tagline;
    document.querySelector('[data-profile-photo]').src = assetUrl(profile.photo);
    document.querySelector('[data-profile-photo]').alt = `Profile photo of ${profile.name}`;
    document.querySelector('[data-profile-links]').innerHTML = profileLinks(profile);
    document.querySelector('[data-biography]').innerHTML = `<p>${profile.biography}</p>`;
    const backgroundItem = (item) => `
      <article class="background-item">
        <time>${item.period}</time>
        <div><h3>${item.title}</h3><p>${item.place}</p></div>
      </article>`;
    document.querySelector('[data-home-education]').innerHTML = cv.education.map(backgroundItem).join('');
    document.querySelector('[data-home-experience]').innerHTML = cv.appointments.map(backgroundItem).join('');
    document.querySelector('[data-interests]').innerHTML = profile.research_interests.map((interest, index) => `
      <article class="interest-card reveal" style="--index: ${index}">
        <span class="interest-number">0${index + 1}</span>
        <h3>${interest}</h3>
      </article>`).join('');
    document.querySelector('[data-featured-projects]').innerHTML = projects.filter((item) => item.featured).slice(0, 3).map(projectCard).join('');
    document.querySelector('[data-featured-publications]').innerHTML = publications.filter((item) => item.selected).slice(0, 4).map(publicationItem).join('');
    document.querySelector('[data-recent-news]').innerHTML = news.slice(0, 5).map(newsItem).join('');
  }

  async function renderResearch() {
    const areas = await loadJson('assets/data/research.json');
    document.querySelector('[data-research-areas]').innerHTML = areas.map((area) => `
      <article class="research-row">
        <div class="research-index">${area.number}</div>
        <div class="research-summary"><h3>${area.title}</h3><p>${area.summary}</p></div>
        <div class="research-detail">
          <p class="detail-label">Guiding question</p><p>${area.questions}</p>
          <div class="method-tags">${area.methods.map((method) => `<span>${method}</span>`).join('')}</div>
        </div>
      </article>`).join('');
  }

  async function renderPublications() {
    const publications = await loadJson('assets/data/publications.json');
    publications.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
    const years = [...new Set(publications.map((item) => item.year))];
    document.querySelector('[data-all-publications]').innerHTML = years.map((year) => `
      <section class="publication-group" aria-labelledby="year-${year}">
        <h2 id="year-${year}">${year}</h2>
        <ol class="publication-list">${publications.filter((item) => item.year === year).map(publicationItem).join('')}</ol>
      </section>`).join('');
  }

  async function renderProjects() {
    const projects = await loadJson('assets/data/projects.json');
    document.querySelector('[data-all-projects]').innerHTML = projects.map(projectCard).join('');
  }

  async function renderProjectDetail() {
    const projects = await loadJson('assets/data/projects.json');
    const project = projects.find((item) => item.id === document.body.dataset.projectId);
    const main = document.querySelector('[data-project-detail]');
    if (!project) {
      main.innerHTML = '<section class="not-found section-shell"><p class="eyebrow">Project</p><h1>Project not found.</h1><a class="button button-primary" href="../">Back to projects</a></section>';
      return;
    }
    main.innerHTML = `
      <header class="project-hero section-shell">
        <div class="project-hero-copy"><p class="eyebrow">Research project · ${project.status}</p><h1>${project.title}</h1><p class="page-intro">${project.summary}</p><p class="project-period">${project.period}</p></div>
        <img src="${assetUrl(project.image)}" alt="${project.image_alt}" width="720" height="440">
      </header>
      <section class="project-content section-shell section-rule">
        <aside class="project-aside"><a class="text-link" href="${pathFor('projects/')}"><span aria-hidden="true">←</span> All projects</a><p class="detail-label">Status</p><p>${project.status}</p><p class="detail-label">Period</p><p>${project.period}</p><p class="detail-label">Funding</p><p>${project.funding}</p></aside>
        <div class="project-narrative prose"><h2>Overview</h2><p>${project.overview}</p><h2>Research challenge</h2><p>${project.challenge}</p><h2>Approach</h2><p>${project.approach}</p><h2>Expected outcomes</h2><ul>${project.outcomes.map((outcome) => `<li>${outcome}</li>`).join('')}</ul></div>
      </section>`;
  }

  async function renderTeaching() {
    const teaching = await loadJson('assets/data/teaching.json');
    document.querySelector('[data-teaching-statement]').textContent = teaching.statement;
    document.querySelector('[data-courses]').innerHTML = teaching.activities.map((course) => `
      <article class="course-row"><div><span class="course-code">${course.code}</span><span class="course-term">${course.term}</span></div><div><h3>${course.title}</h3><p>${course.description}</p></div></article>`).join('');
    document.querySelector('[data-teaching-resources]').innerHTML = teaching.honors.map((item) => {
      const content = `<h3>${item.title}</h3><p>${item.description}</p>${item.url ? '<span class="text-link">Learn more →</span>' : ''}`;
      return item.url ? `<a class="resource-card" href="${item.url}">${content}</a>` : `<article class="resource-card resource-placeholder">${content}</article>`;
    }).join('');
  }

  async function renderNews() {
    const news = await loadJson('assets/data/news.json');
    news.sort((a, b) => b.date.localeCompare(a.date));
    document.querySelector('[data-all-news]').innerHTML = news.map(newsItem).join('');
  }

  async function renderTeam() {
    const team = await loadJson('assets/data/team.json');
    document.querySelector('[data-team-intro]').textContent = team.intro;
    document.querySelector('[data-team-groups]').innerHTML = team.groups.map((group) => `
      <section class="team-group" aria-labelledby="team-${group.title.toLowerCase().replace(/\s+/g, '-')}">
        <h2 id="team-${group.title.toLowerCase().replace(/\s+/g, '-')}">${group.title}</h2>
        <div class="member-grid">${group.members.map((member) => `<article class="member-card"><div class="member-avatar" aria-hidden="true">${member.initials}</div><h3>${member.name}</h3><p class="member-role">${member.role}</p><p>${member.focus}</p></article>`).join('')}</div>
      </section>`).join('');
  }

  async function renderCv() {
    const cv = await loadJson('assets/data/cv.json');
    const labels = { appointments: 'Appointments', education: 'Education', funding: 'Research Funding', outputs: 'Research Outputs', honors: 'Honors & Awards', service: 'Professional Service' };
    document.querySelector('[data-cv-sections]').innerHTML = Object.entries(cv).map(([key, entries]) => `
      <section class="cv-section" aria-labelledby="cv-${key}"><h2 id="cv-${key}">${labels[key]}</h2><div>${entries.map((item) => `<article class="cv-row"><p>${item.period}</p><div><h3>${item.title}</h3><p>${item.place}</p></div></article>`).join('')}</div></section>`).join('');

    const button = document.querySelector('[data-cv-download]');
    try {
      const response = await fetch(assetUrl('assets/files/cv.pdf'), { method: 'HEAD', cache: 'no-store' });
      if (response.ok) {
        button.href = assetUrl('assets/files/cv.pdf');
        button.className = 'button button-primary';
        button.textContent = 'Download PDF CV ↓';
        button.removeAttribute('aria-disabled');
        button.removeAttribute('title');
      }
    } catch (_) { /* The disabled placeholder remains when no CV is present. */ }
  }

  function renderContact(profile) {
    document.querySelector('[data-contact-name]').textContent = profile.name;
    document.querySelector('[data-contact-role]').textContent = `${profile.title} · ${profile.department}`;
    document.querySelector('[data-contact-institution]').textContent = profile.institution;
    document.querySelector('[data-contact-location]').textContent = profile.location;
    const email = document.querySelector('[data-contact-email]');
    email.href = `mailto:${profile.email}`;
    email.textContent = profile.email;
    document.querySelector('[data-contact-links]').innerHTML = [
      profile.links.google_scholar ? `<a href="${profile.links.google_scholar}" ${externalAttrs}><span>Google Scholar</span><span aria-hidden="true">↗</span></a>` : '',
      profile.links.orcid ? `<a href="${profile.links.orcid}" ${externalAttrs}><span>ORCID</span><span aria-hidden="true">↗</span></a>` : '',
      profile.links.github ? `<a href="${profile.links.github}" ${externalAttrs}><span>GitHub</span><span aria-hidden="true">↗</span></a>` : ''
    ].filter(Boolean).join('');
  }

  async function init() {
    renderHeader();
    try {
      const profile = await loadJson('assets/data/profile.json');
      renderFooter(profile);
      const monogram = profile.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
      const mark = document.querySelector('.site-mark-monogram');
      if (mark && monogram) mark.textContent = monogram;
      const markText = document.querySelector('.site-mark-text');
      if (markText) markText.textContent = profile.name;
      const page = document.body.dataset.page;
      if (page === 'home') await renderHome(profile);
      if (page === 'research') await renderResearch();
      if (page === 'publications') await renderPublications();
      if (page === 'projects') await renderProjects();
      if (page === 'project') await renderProjectDetail();
      if (page === 'teaching') await renderTeaching();
      if (page === 'news') await renderNews();
      if (page === 'team') await renderTeam();
      if (page === 'cv') await renderCv();
      if (page === 'contact') renderContact(profile);
      document.body.classList.add('is-ready');
    } catch (error) {
      console.error(error);
      const main = document.querySelector('main');
      if (main) main.insertAdjacentHTML('afterbegin', '<p class="data-error">Site content could not be loaded. Please serve the repository through a web server rather than opening index.html directly.</p>');
    }
  }

  init();
})();
