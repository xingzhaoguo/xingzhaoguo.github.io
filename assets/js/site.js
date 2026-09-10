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
    nav: [['home', '首页', ''], ['projects', '科研工作', 'projects/'], ['publications', '研究成果', 'publications/'], ['teaching', '教学指导', 'teaching/'], ['news', '学术动态', 'news/'], ['contact', '联系方式', 'contact/']],
    homeLabel: '郭兴召 Guo Xingzhao', toggleNavigation: '展开或收起导航', primaryNavigation: '主导航',
    email: '邮箱', built: '基于 GitHub Pages 构建',
    viewProject: '查看项目', researchProject: '科研项目', guidingQuestion: '核心问题', profilePhoto: '个人照片', doiPending: 'DOI 待更新',
    project: '科研项目', projectNotFound: '未找到该项目', backProjects: '返回项目列表', allProjects: '全部项目',
    status: '状态', period: '时间', funding: '项目来源', overview: '项目概述', challenge: '研究问题', approach: '研究方法', outcomes: '预期成果',
    coursesLink: '了解更多 →', applicationNumber: '申请号', registrationNumber: '登记号', granted: '已授权', substantiveReview: '实质审查', firstAdvisor: '第一指导老师', undergraduate: '本科', resourcePlaceholder: '', dataError: '网站内容加载失败。请通过网页服务器访问本站，不要直接打开 HTML 文件。'
  } : {
    nav: [['home', 'Home', ''], ['projects', 'Research Work', 'projects/'], ['publications', 'Research Outputs', 'publications/'], ['teaching', 'Teaching', 'teaching/'], ['news', 'News', 'news/'], ['contact', 'Contact', 'contact/']],
    homeLabel: '郭兴召 Guo Xingzhao', toggleNavigation: 'Toggle navigation', primaryNavigation: 'Primary navigation',
    email: 'Email', built: 'Built for GitHub Pages',
    viewProject: 'View Project', researchProject: 'Research project', guidingQuestion: 'Guiding question', profilePhoto: 'Profile photo of', doiPending: 'DOI pending',
    project: 'Project', projectNotFound: 'Project not found', backProjects: 'Back to projects', allProjects: 'All projects',
    status: 'Status', period: 'Period', funding: 'Funding', overview: 'Overview', challenge: 'Research challenge', approach: 'Approach', outcomes: 'Expected outcomes',
    coursesLink: 'Learn more →', applicationNumber: 'Application No.', registrationNumber: 'Registration No.', granted: 'Granted', substantiveReview: 'Substantive Examination', firstAdvisor: 'First Advisor', undergraduate: 'Undergraduate', resourcePlaceholder: '', dataError: 'Site content could not be loaded. Please serve the repository through a web server rather than opening index.html directly.'
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
    const response = await fetch(assetUrl(contentPath), { cache: 'no-store' });
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
          <span class="site-mark-monogram" aria-hidden="true">GX</span>
          <span class="site-mark-text">郭兴召 <span lang="en">Guo Xingzhao</span></span>
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
      `<a href="mailto:${profile.email}">Email</a>`,
      profile.links.github ? `<a href="${profile.links.github}" ${externalAttrs}>GitHub</a>` : '',
      profile.links.google_scholar ? `<a href="${profile.links.google_scholar}" ${externalAttrs}>Google Scholar</a>` : '',
      profile.links.researchgate ? `<a href="${profile.links.researchgate}" ${externalAttrs}>ResearchGate</a>` : ''
    ].filter(Boolean).join('');
    footer.innerHTML = `
      <div class="footer-shell">
        <div>
          <p class="footer-name">Guo Xingzhao</p>
          <p>School of Mechanical and Power Engineering · Zhengzhou University</p>
        </div>
        <div class="footer-links">${academicLinks}</div>
        <p class="copyright">© ${year} Guo Xingzhao. Built for GitHub Pages.</p>
      </div>`;
  }

  function profileLinks(profile) {
    return [
      `<a href="mailto:${profile.email}">${ui.email}</a>`,
      profile.links.google_scholar ? `<a href="${profile.links.google_scholar}" ${externalAttrs}>Google Scholar</a>` : '',
      profile.links.researchgate ? `<a href="${profile.links.researchgate}" ${externalAttrs}>ResearchGate</a>` : '',
      profile.links.orcid ? `<a href="${profile.links.orcid}" ${externalAttrs}>ORCID</a>` : '',
      profile.links.github ? `<a href="${profile.links.github}" ${externalAttrs}>GitHub</a>` : ''
    ].filter(Boolean).join('');
  }

  function projectCard(project) {
    const projectUrl = project.has_detail === false ? '' : localizedPath(`projects/${project.id}/`);
    const imageClasses = [
      project.image_fit === 'contain' ? 'project-image-contain' : '',
      project.image_position === 'left' ? 'project-image-left' : ''
    ].filter(Boolean).join(' ');
    const imageClass = imageClasses ? ` class="${imageClasses}"` : '';
    const image = projectUrl
      ? `<a class="project-image-link" href="${projectUrl}" tabindex="-1" aria-hidden="true"><img${imageClass} src="${assetUrl(project.image)}" alt="" width="720" height="440" loading="lazy"></a>`
      : `<div class="project-image-link"><img${imageClass} src="${assetUrl(project.image)}" alt="" width="720" height="440" loading="lazy"></div>`;
    const title = projectUrl ? `<a href="${projectUrl}">${project.title}</a>` : project.title;
    const action = '';
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

  function highlightSelf(value) {
    return value.replace(/郭兴召|Xingzhao Guo|Guo Xingzhao/g, '<strong class="author-self">$&</strong>');
  }

  function selfAuthorPosition(item) {
    if (!item.authors) return Number.POSITIVE_INFINITY;
    const position = item.authors
      .split(/[；;]/)
      .map((author) => author.trim())
      .findIndex((author) => /郭兴召|Xingzhao Guo|Guo Xingzhao/.test(author));
    return position === -1 ? Number.POSITIVE_INFINITY : position;
  }

  function publicationItem(item) {
    const authors = highlightSelf(item.authors);
    const doi = item.doi
      ? `<a href="${item.doi}" ${externalAttrs}>DOI</a>`
      : `<span class="link-placeholder">${ui.doiPending}</span>`;
    return `
      <li class="publication-item">
        <div class="publication-year">${item.year}</div>
        <div>
          <h3>${item.title}</h3>
          <p class="publication-authors">${authors}</p>
          <p class="publication-venue"><em>${item.venue}</em> · ${item.type}</p>
          <div class="publication-links">${doi}</div>
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
    document.querySelector('[data-profile-biography]').textContent = profile.biography;
    document.querySelector('[data-profile-photo]').src = assetUrl(profile.photo);
    document.querySelector('[data-profile-photo]').alt = `${ui.profilePhoto}${isChinese ? '：' : ' '}${profile.name}`;
    document.querySelector('[data-profile-links]').innerHTML = profileLinks(profile);
    const backgroundItem = (item) => `
      <article class="background-item">
        <time>${item.period}</time>
        <div><h3>${item.title}</h3><p>${item.place}</p></div>
      </article>`;
    document.querySelector('[data-home-education]').innerHTML = cv.education.map(backgroundItem).join('');
    document.querySelector('[data-home-experience]').innerHTML = cv.appointments.map(backgroundItem).join('');
    const interests = document.querySelector('[data-interests]');
    if (interests) {
      interests.innerHTML = profile.research_interests.map((interest, index) => `
        <article class="interest-card reveal" style="--index: ${index}">
          <span class="interest-number">0${index + 1}</span>
          <h3>${interest}</h3>
        </article>`).join('');
    }
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
    const [publications, intellectualProperty] = await Promise.all([
      loadJson('assets/data/publications.json'),
      loadJson('assets/data/intellectual-property.json')
    ]);
    publications.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
    const years = [...new Set(publications.map((item) => item.year))];
    document.querySelector('[data-all-publications]').innerHTML = years.map((year) => `
      <section class="publication-group" aria-labelledby="year-${year}">
        <h2 id="year-${year}">${year}</h2>
        <ol class="publication-list">${publications.filter((item) => item.year === year).map(publicationItem).join('')}</ol>
      </section>`).join('');
    document.querySelector('[data-intellectual-property]').innerHTML = intellectualProperty.map((group) => {
      const items = group.kind === 'patent'
        ? group.items.map((item, index) => ({ item, index }))
          .sort((a, b) => selfAuthorPosition(a.item) - selfAuthorPosition(b.item) || a.index - b.index)
          .map(({ item }) => item)
        : group.items;
      return `<section class="ip-group">
        <header class="ip-group-header"><h3>${group.category}</h3><span>${group.count}</span></header>
        <ol class="ip-list">${items.map((item) => {
          const authors = item.authors ? `<p class="ip-authors">${highlightSelf(item.authors)}</p>` : '';
          const status = group.kind === 'patent'
            ? `<span class="ip-status ${item.granted ? 'is-granted' : 'is-review'}">${item.granted ? ui.granted : ui.substantiveReview}</span>`
            : '';
          const metadata = group.kind === 'patent'
            ? [`<time datetime="${item.date}">${item.date}</time>`, item.country, `${ui.applicationNumber}：${item.number}`]
            : [item.type, `${ui.registrationNumber}：${item.registration_number}`, `<time datetime="${item.date}">${item.date}</time>`];
          return `<li class="ip-item"><div><div class="ip-item-heading"><h4>${item.title}</h4>${status}</div>${authors}<p class="ip-meta">${metadata.map((value) => `<span>${value}</span>`).join('')}</p></div></li>`;
        }).join('')}</ol>
      </section>`;
    }).join('');
  }

  async function renderProjects() {
    const projects = await loadJson('assets/data/projects.json');
    const representativeProjects = projects.filter((project) => project.featured);
    const researchProjects = projects
      .filter((project) => !project.featured)
      .sort((a, b) => (a.display_order ?? Number.MAX_SAFE_INTEGER) - (b.display_order ?? Number.MAX_SAFE_INTEGER));
    document.querySelector('[data-representative-projects]').innerHTML = representativeProjects.map(projectCard).join('');
    document.querySelector('[data-research-projects]').innerHTML = researchProjects.map((project) => `
      <li class="ip-item">
        <div>
          <div class="ip-item-heading"><h4>${project.title}</h4></div>
          <p class="ip-authors">${project.funding || ui.researchProject}</p>
          <p class="ip-meta"><span>${project.period}</span><span>${project.status}</span></p>
        </div>
      </li>`).join('');
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
        <aside class="project-aside"><a class="text-link" href="${localizedPath('projects/')}"><span aria-hidden="true">←</span> ${ui.allProjects}</a><p class="detail-label">${ui.status}</p><p>${project.status}</p><p class="detail-label">${ui.period}</p><p>${project.period}</p>${project.funding ? `<p class="detail-label">${ui.funding}</p><p>${project.funding}</p>` : ''}</aside>
        <div class="project-narrative prose"><h2>${ui.overview}</h2><p>${project.overview}</p><h2>${ui.challenge}</h2><p>${project.challenge}</p><h2>${ui.approach}</h2><p>${project.approach}</p><h2>${ui.outcomes}</h2><ul>${project.outcomes.map((outcome) => `<li>${outcome}</li>`).join('')}</ul></div>
      </section>`;
  }

  async function renderTeaching() {
    const teaching = await loadJson('assets/data/teaching.json');
    document.querySelector('[data-courses]').innerHTML = teaching.courses.map((course) => {
      const metadata = [course.credits, course.hours, course.category].filter(Boolean);
      return `<li class="ip-item"><div><div class="ip-item-heading"><h4>${course.title}</h4></div><p class="ip-meta">${metadata.map((value) => `<span>${value}</span>`).join('')}</p></div></li>`;
    }).join('');

    document.querySelector('[data-graduation-projects]').innerHTML = teaching.graduation_projects.map((group) => `
      <section class="publication-group teaching-group">
        <h3>${group.year}</h3>
        <ol class="teaching-record-list">${group.items.map((item) => `
          <li class="teaching-record">
            <div class="teaching-record-heading"><h4>${item.title}</h4><span class="teaching-person">${item.student}</span></div>
            <div class="teaching-honors"><span>${ui.undergraduate}</span>${item.honors?.map((honor) => `<span>${honor}</span>`).join('') || ''}</div>
          </li>`).join('')}</ol>
      </section>`).join('');

    document.querySelector('[data-innovation-projects]').innerHTML = teaching.innovation_projects.map((group) => `
      <section class="publication-group teaching-group">
        <h3>${group.year}</h3>
        <ol class="teaching-record-list">${group.items.map((item) => `
          <li class="teaching-record">
            <div class="teaching-record-heading"><h4>${item.title}</h4><span class="ip-status ${item.status === '已结题' || item.status === 'Completed' ? 'is-review' : 'is-granted'}">${item.status}</span></div>
            <p class="ip-meta"><span>${item.level}</span><span class="teaching-advisor">${item.advisor}</span></p>
          </li>`).join('')}</ol>
      </section>`).join('');

    const competitionAward = (award) => {
      const isProvincial = /省|Provincial/i.test(award);
      if (isChinese) return isProvincial ? award.replace('金奖（省奖）', '省级金奖') : `国家${award}`;
      return isProvincial ? award : `National ${award}`;
    };
    const competitionRank = (award) => {
      if (/一等奖|First Prize/i.test(award)) return 1;
      if (/二等奖|Second Prize/i.test(award)) return 2;
      if (/三等奖|Third Prize/i.test(award)) return 3;
      if (/金奖|Gold Award/i.test(award)) return 4;
      return 5;
    };
    document.querySelector('[data-competitions]').innerHTML = teaching.competitions.map((group) => `
      <section class="publication-group teaching-group">
        <h3>${group.year}</h3>
        <ol class="teaching-record-list">${group.items.slice().sort((a, b) => competitionRank(a.award) - competitionRank(b.award) || b.date.localeCompare(a.date)).map((item) => `
          <li class="teaching-record">
            <div class="teaching-record-heading"><h4>${item.title}</h4><span class="ip-status is-granted">${competitionAward(item.award)}</span></div>
            <p class="ip-authors">${item.students}</p>
            <p class="ip-meta"><time>${item.date}</time><span>${item.organizer}</span><span class="teaching-advisor">${ui.firstAdvisor}</span></p>
          </li>`).join('')}</ol>
      </section>`).join('');
  }

  async function renderNews() {
    const news = await loadJson('assets/data/news.json');
    news.sort((a, b) => b.date.localeCompare(a.date));
    document.querySelector('[data-all-news]').innerHTML = news.map(newsItem).join('');
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
      profile.links.researchgate ? `<a href="${profile.links.researchgate}" ${externalAttrs}><span>ResearchGate</span><span aria-hidden="true">↗</span></a>` : '',
      profile.links.orcid ? `<a href="${profile.links.orcid}" ${externalAttrs}><span>ORCID</span><span aria-hidden="true">↗</span></a>` : '',
      profile.links.github ? `<a href="${profile.links.github}" ${externalAttrs}><span>GitHub</span><span aria-hidden="true">↗</span></a>` : ''
    ].filter(Boolean).join('');
  }

  async function init() {
    renderHeader();
    try {
      const profile = await loadJson('assets/data/profile.json');
      renderFooter(profile);
      const page = document.body.dataset.page;
      if (page === 'home') await renderHome(profile);
      if (page === 'research') await renderResearch();
      if (page === 'publications') await renderPublications();
      if (page === 'projects') await renderProjects();
      if (page === 'project') await renderProjectDetail();
      if (page === 'teaching') await renderTeaching();
      if (page === 'news') await renderNews();
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
