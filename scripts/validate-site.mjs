import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const checked = [];

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function requirePath(relativePath) {
  checked.push(relativePath);
  if (!exists(relativePath)) errors.push(`Missing required path: ${relativePath}`);
}

function readJson(relativePath) {
  requirePath(relativePath);
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON in ${relativePath}: ${error.message}`);
    return null;
  }
}

function walk(directory, extension) {
  const output = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== '.git') output.push(...walk(full, extension));
    if (entry.isFile() && full.endsWith(extension)) output.push(full);
  }
  return output;
}

function resolveLocalReference(htmlFile, reference) {
  const clean = reference.split(/[?#]/)[0];
  if (!clean || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(clean)) return null;
  const candidate = clean.startsWith('/')
    ? path.join(root, clean.replace(/^\/+/, ''))
    : path.resolve(path.dirname(htmlFile), clean);
  if (clean.endsWith('/')) return path.join(candidate, 'index.html');
  if (!path.extname(candidate) && fs.existsSync(path.join(candidate, 'index.html'))) return path.join(candidate, 'index.html');
  return candidate;
}

[
  '.nojekyll', 'index.html', '404.html', 'assets/css/main.css', 'assets/js/site.js',
  'research/index.html', 'publications/index.html', 'projects/index.html',
  'teaching/index.html', 'team/index.html', 'news/index.html', 'cv/index.html',
  'contact/index.html', 'assets/images/og-xingzhao-guo.png',
  'en/index.html', 'en/research/index.html', 'en/publications/index.html',
  'en/projects/index.html', 'en/teaching/index.html', 'en/team/index.html',
  'en/news/index.html', 'en/cv/index.html', 'en/contact/index.html'
].forEach(requirePath);

const profile = readJson('assets/data/profile.json');
const projects = readJson('assets/data/projects.json');
const publications = readJson('assets/data/publications.json');
const news = readJson('assets/data/news.json');
readJson('assets/data/research.json');
readJson('assets/data/teaching.json');
readJson('assets/data/team.json');
readJson('assets/data/cv.json');
const zhProfile = readJson('assets/data/zh/profile.json');
const zhProjects = readJson('assets/data/zh/projects.json');
readJson('assets/data/zh/publications.json');
readJson('assets/data/zh/news.json');
readJson('assets/data/zh/research.json');
readJson('assets/data/zh/teaching.json');
readJson('assets/data/zh/team.json');
readJson('assets/data/zh/cv.json');

if (profile) requirePath(profile.photo);
if (zhProfile) requirePath(zhProfile.photo);
if (projects) {
  for (const project of projects) {
    requirePath(project.image);
    if (project.has_detail !== false) {
      requirePath(`projects/${project.id}/index.html`);
      requirePath(`en/projects/${project.id}/index.html`);
    }
  }
}
if (projects && zhProjects && projects.map(({ id }) => id).join('|') !== zhProjects.map(({ id }) => id).join('|')) {
  errors.push('Chinese and English project IDs should match and use the same order.');
}
if (publications) {
  for (const item of publications) if (item.pdf) requirePath(item.pdf);
  for (let index = 1; index < publications.length; index += 1) {
    if (publications[index].year > publications[index - 1].year) {
      errors.push('publications.json should be stored in reverse chronological order.');
      break;
    }
  }
}
if (news) {
  for (let index = 1; index < news.length; index += 1) {
    if (news[index].date > news[index - 1].date) {
      errors.push('news.json should be stored in reverse chronological order.');
      break;
    }
  }
}

for (const htmlFile of walk(root, '.html')) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const relative = path.relative(root, htmlFile);
  if (!/<meta\s+name="viewport"/i.test(html)) errors.push(`Missing viewport meta tag: ${relative}`);
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`Missing page title: ${relative}`);
  if (relative.startsWith(`en${path.sep}`) && !/<body[^>]+data-lang="en"/i.test(html)) errors.push(`Missing English language marker: ${relative}`);
  if (!relative.startsWith(`en${path.sep}`) && relative !== '404.html' && !/<body[^>]+data-lang="zh"/i.test(html)) errors.push(`Missing Chinese language marker: ${relative}`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = resolveLocalReference(htmlFile, match[1]);
    if (target && !fs.existsSync(target)) errors.push(`Broken local reference in ${relative}: ${match[1]}`);
  }
}

if (errors.length) {
  console.error(`Site validation failed with ${errors.length} issue(s):`);
  for (const error of [...new Set(errors)]) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Site validation passed: ${walk(root, '.html').length} HTML pages, ${checked.length} required paths, and all JSON files are valid.`);
