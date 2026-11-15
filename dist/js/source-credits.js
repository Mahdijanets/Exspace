// Keep scientific image attribution in the footer, away from the hero content.
export function setSourceCredit(key, label, url, details = '') {
  const footer = document.querySelector('footer');
  if (!footer) return;
  let sources = document.getElementById('source-credits');
  if (!sources) {
    sources = document.createElement('div');
    sources.id = 'source-credits';
    sources.className = 'source-credits';
    footer.append(sources);
  }
  let link = document.getElementById(`source-credit-${key}`);
  if (!link) {
    link = document.createElement('a');
    link.id = `source-credit-${key}`;
    link.target = '_blank';
    link.rel = 'noreferrer';
    sources.append(link);
  }
  link.href = url;
  link.textContent = `${label}${details ? ' — ' + details : ''} ↗`;
}
