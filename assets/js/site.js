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
  const language = document.body.dataset.lang === 'en' ? 'en' : 'zh';
  const isChinese = language === 'zh';

  const ui = isChinese ? {
    nav: [['home', '首页', ''], ['research', '研究方向', 'research/'], ['publications', '论文成果', 'publications/'], ['projects', '科研项目', 'projects/'], ['teaching', '教学指导', 'teaching/'], ['news', '学术动态', 'news/'], ['contact', '联系方式', 'contact/']],
    homeLabel: '郭兴召学术主页', toggleNavigation: '展开或收起导航', primaryNavigation: '主导航',
    email: '邮箱', team: '团队', cv: '个人履历', built: '基于 GitHub Pages 构建',
    viewProject: '查看项目', researchProject: '科研项目', guidingQuestion: '核心问题', profilePhoto: '个人照片', pdfHint: '在 publications.json 中添加 PDF 路径',
    project: '科研项目', projectNotFound: '未找到该项目', backProjects: '返回项目列表', allProjects: '全部项目',
    status: '状态', period: '时间', funding: '项目来源', overview: '项目概述', challenge: '研究问题', approach: '研究方法', outcomes: '预期成果',
    coursesLink: '了解更多 →', resourcePlaceholder: '', cvLabels: { appointments: '工作经历', education: '教育背景', funding: '科研项目', outputs: '科研成果', honors: '荣誉奖励', service: '学术兼职' },
    cvDownload: '下载 PDF 简历 ↓', dataError: '网站内容加载失败。请通过网页服务器访问本站，不要直接打开 HTML 文件。'
  } : {
    nav: [['home', 'Home', ''], ['research', 'Research', 'research/'], ['publications', 'Publications', 'publications/'], ['projects', 'Projects', 'projects/'], ['teaching', 'Teaching', 'teaching/'], ['news', 'News', 'news/'], ['contact', 'Contact', 'contact/']],
    homeLabel: 'Academic homepage of Xingzhao Guo', toggleNavigation: 'Toggle navigation', primaryNavigation: 'Primary navigation',
    email: 'Email', team: 'Team', cv: 'CV', built: 'Built for GitHub Pages',
    viewProject: 'View Project', researchProject: 'Research project', guidingQuestion: 'Guiding question', profilePhoto: 'Profile photo of', pdfHint: 'Add a PDF path in publications.json',
    project: 'Project', projectNotFound: 'Project not found', backProjects: 'Back to projects', allProjects: 'All projects',
    status: 'Status', period: 'Period', funding: 'Funding', overview: 'Overview', challenge: 'Research challenge', approach: 'Approach', outcomes: 'Expected outcomes',
    coursesLink: 'Learn more →', resourcePlaceholder: '', cvLabels: { appointments: 'Appointments', education: 'Education', funding: 'Research Funding', outputs: 'Research Outputs', honors: 'Honors & Awards', service: 'Professional Service' },
    cvDownload: 'Download PDF CV ↓', dataError: 'Site content could not be loaded. Please serve the repository through a web server rather than opening index.html directly.'
  };

  const localizedPath = (path = '') => pathFor(`${isChinese ? '' : 'en/'}${path}`);
  const localizedDataPath = (path) => isChinese && path.startsWith('assets/data/')
    ? path.replace('assets/data/', 'assets/data/zh/')
    : path;

  function currentContentRoute() {
    const page = document.body.dataset.page || 'home';
    if (page === 'home') return '';
    if (page === 'project') return `projects/${document.body.dataset.projectId}/`;
    if (page === '404') return '';
    return `${page}/`;
  }

  async function loadJson(path) {
    const contentPath = localizedDataPath(path);
    const response = await fetch(assetUrl(contentPath));
    if (!response.ok) throw new Error(`Could not load ${path}`);
    return response.json();
  }

  function renderHeader() {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;
    const currentPage = document.body.dataset.page || 'home';
    const links = ui.nav.map(([pageKey, label, path]) => {
      const active = currentPage === pageKey || (currentPage === 'project' && pageKey === 'projects');
      return `<a href="${localizedPath(path)}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
    }).join('');
    const route = currentContentRoute();
    const chineseUrl = pathFor(route);
    const englishUrl = pathFor(`en/${route}`);
    const languageSwitch = isChinese
      ? `<div class="language-switch" aria-label="语言切换"><span aria-current="true">中文</span><span aria-hidden="true">/</span><a href="${englishUrl}" lang="en">EN</a></div>`
      : `<div class="language-switch" aria-label="Language switch"><a href="${chineseUrl}" lang="zh-CN">中文</a><span aria-hidden="true">/</span><span aria-current="true">EN</span></div>`;

    header.innerHTML = `
      <div class="nav-shell">
        <a class="site-mark" href="${localizedPath('')}" aria-label="${ui.homeLabel}">
          <span class="site-mark-monogram" aria-hidden="true">YN</span>
          <span class="site-mark-text">Xingzhao Guo</span>
        </a>
        <div class="nav-actions">
          <nav class="primary-nav" id="primary-navigation" aria-label="${ui.primaryNavigation}">${links}</nav>
          ${languageSwitch}
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
            <span class="sr-only">${ui.toggleNavigation}</span>
            <span></span><span></span><span></span>
          </button>
        </div>
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
      `<a href="mailto:${profile.email}">${ui.email}</a>`,
      profile.links.github ? `<a href="${profile.links.github}" ${externalAttrs}>GitHub</a>` : '',
      profile.links.google_scholar ? `<a href="${profile.links.google_scholar}" ${externalAttrs}>Google Scholar</a>` : '',
      `<a href="${localizedPath('team/')}">${ui.team}</a>`,
      `<a href="${localizedPath('cv/')}">${ui.cv}</a>`
    ].filter(Boolean).join('');
    footer.innerHTML = `
      <div class="footer-shell">
        <div>
          <p class="footer-name">${profile.name}</p>
          <p>${profile.title} · ${profile.institution}</p>
        </div>
        <div class="footer-links">${academicLinks}</div>
        <p class="copyright">© ${year} ${profile.name}. ${ui.built}.</p>
      </div>`;
  }

  function profileLinks(profile) {
    return [
      `<a href="mailto:${profile.email}">${ui.email}</a>`,
      profile.links.google_scholar ? `<a href="${profile.links.google_scholar}" ${externalAttrs}>Google Scholar</a>` : '',
      profile.links.orcid ? `<a href="${profile.links.orcid}" ${externalAttrs}>ORCID</a>` : '',
      profile.links.github ? `<a href="${profile.links.github}" ${externalAttrs}>GitHub</a>` : ''
    ].filter(Boolean).join('');
  }

  function projectCard(project) {
    const projectUrl = project.has_detail === false ? '' : localizedPath(`projects/${project.id}/`);
    const image = projectUrl
      ? `<a class="project-image-link" href="${projectUrl}" tabindex="-1" aria-hidden="true"><img src="${assetUrl(project.image)}" alt="" width="720" height="440" loading="lazy"></a>`
      : `<div class="project-image-link"><img src="${assetUrl(project.image)}" alt="" width="720" height="440" loading="lazy"></div>`;
    const title = projectUrl ? `<a href="${projectUrl}">${project.title}</a>` : project.title;
    const action = projectUrl
      ? `<a class="text-link" href="${projectUrl}">${ui.viewProject} <span aria-hidden="true">→</span></a>`
      : `<span class="project-card-note">${project.funding || ui.researchProject}</span>`;
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
      item.pdf ? `<a href="${assetUrl(item.pdf)}">PDF</a>` : `<span class="link-placeholder" title="${ui.pdfHint}">PDF</span>`,
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
    const label = item.display_date || date.toLocaleDateString(isChinese ? 'zh-CN' : 'en', { year: 'numeric', month: 'short', day: '2-digit' });
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
    document.querySelector('[data-profile-photo]').alt = `${ui.profilePhoto}${isChinese ? '：' : ' '}${profile.name}`;
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
          <p class="detail-label">${ui.guidingQuestion}</p><p>${area.questions}</p>
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
      main.innerHTML = `<section class="not-found section-shell"><p class="eyebrow">${ui.project}</p><h1>${ui.projectNotFound}</h1><a class="button button-primary" href="${localizedPath('projects/')}">${ui.backProjects}</a></section>`;
      return;
    }
    main.innerHTML = `
      <header class="project-hero section-shell">
        <div class="project-hero-copy"><p class="eyebrow">${ui.researchProject} · ${project.status}</p><h1>${project.title}</h1><p class="page-intro">${project.summary}</p><p class="project-period">${project.period}</p></div>
        <img src="${assetUrl(project.image)}" alt="${project.image_alt}" width="720" height="440">
      </header>
      <section class="project-content section-shell section-rule">
        <aside class="project-aside"><a class="text-link" href="${localizedPath('projects/')}"><span aria-hidden="true">←</span> ${ui.allProjects}</a><p class="detail-label">${ui.status}</p><p>${project.status}</p><p class="detail-label">${ui.period}</p><p>${project.period}</p><p class="detail-label">${ui.funding}</p><p>${project.funding}</p></aside>
        <div class="project-narrative prose"><h2>${ui.overview}</h2><p>${project.overview}</p><h2>${ui.challenge}</h2><p>${project.challenge}</p><h2>${ui.approach}</h2><p>${project.approach}</p><h2>${ui.outcomes}</h2><ul>${project.outcomes.map((outcome) => `<li>${outcome}</li>`).join('')}</ul></div>
      </section>`;
  }

  async function renderTeaching() {
    const teaching = await loadJson('assets/data/teaching.json');
    document.querySelector('[data-teaching-statement]').textContent = teaching.statement;
    document.querySelector('[data-courses]').innerHTML = teaching.activities.map((course) => `
      <article class="course-row"><div><span class="course-code">${course.code}</span><span class="course-term">${course.term}</span></div><div><h3>${course.title}</h3><p>${course.description}</p></div></article>`).join('');
    document.querySelector('[data-teaching-resources]').innerHTML = teaching.honors.map((item) => {
      const content = `<h3>${item.title}</h3><p>${item.description}</p>${item.url ? `<span class="text-link">${ui.coursesLink}</span>` : ''}`;
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
    document.querySelector('[data-cv-sections]').innerHTML = Object.entries(cv).map(([key, entries]) => `
      <section class="cv-section" aria-labelledby="cv-${key}"><h2 id="cv-${key}">${ui.cvLabels[key]}</h2><div>${entries.map((item) => `<article class="cv-row"><p>${item.period}</p><div><h3>${item.title}</h3><p>${item.place}</p></div></article>`).join('')}</div></section>`).join('');

    const button = document.querySelector('[data-cv-download]');
    try {
      const response = await fetch(assetUrl('assets/files/cv.pdf'), { method: 'HEAD', cache: 'no-store' });
      if (response.ok) {
        button.href = assetUrl('assets/files/cv.pdf');
        button.className = 'button button-primary';
        button.textContent = ui.cvDownload;
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
      if (main) main.insertAdjacentHTML('afterbegin', `<p class="data-error">${ui.dataError}</p>`);
    }
  }

  init();
})();
