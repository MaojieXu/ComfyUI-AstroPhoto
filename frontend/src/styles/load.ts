export function loadStylesheet(url: URL) {
  if (Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
    .some(link => link.href === url.href)) return;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = url.href;
  document.head.appendChild(stylesheet);
}
