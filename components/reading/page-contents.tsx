export function PageContents({ links, className = "" }: { links: ReadonlyArray<{ href: string; label: string }>; className?: string }) {
  return <div className={`page-contents ${className}`}>
    <nav className="page-contents-desktop" aria-label="On this page">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
    <details className="page-contents-mobile"><summary>On this page</summary><nav aria-label="Page sections">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav></details>
  </div>
}
